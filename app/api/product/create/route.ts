import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import sharp from 'sharp';

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const productData = JSON.parse(data.get('productData') as string);
    const files = data.getAll('images') as File[];

    if (files.length === 0) {
      return NextResponse.json(
        { error: "Au moins une image est requise" },
        { status: 400 }
      );
    }

    const savedFiles = [];
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileName = `${crypto.randomBytes(6).toString('hex')}${path.extname(file.name)}`;
      const filePath = path.join('public/uploads', fileName);
      console.log('Chemin de sauvegarde:', path.join(process.cwd(), 'public/uploads', fileName));

      const optimizedBuffer = await sharp(buffer)
        .resize(1920, null, { // largeur max de 1920px
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality: 85 })
        .toBuffer();

      await fs.promises.writeFile(filePath, optimizedBuffer);

      savedFiles.push({ url: `${fileName}` });
    }

    const price = parseFloat(productData.price);
    
    // Générer un slug unique basé sur le titre
    const baseSlug = generateSlug(productData.title);
    let slug = baseSlug;

    // Vérifier si le slug existe déjà
    while (await prisma.product.findUnique({ where: { slug } })) {
      const randomString = Math.random().toString(36).substring(2, 8);
      slug = `${baseSlug}-${randomString}`;
    }

    const product = await prisma.product.create({
      data: {
        title: productData.title,
        slug: slug,
        color: productData.color,
        size: productData.size,
        price: price,
        description: productData.description,
        images: {
          create: savedFiles
        },
        influencer: {
          connect: {
            id: productData.influencerId
          }
        },
        categories: {
          create: productData.categoryIds.map((categoryId: string) => ({
            categoryId
          }))
        }
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Erreur création produit:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du produit" },
      { status: 500 }
    );
  }
}
