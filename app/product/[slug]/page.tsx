import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

async function getProduct(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        categories: {
          include: {
            category: true
          }
        },
        influencer: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        images: true
      }
    });

    if (!product) {
      return null;
    }

    return product;
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    return null;
  }
}

const ShowProduct = async ({ params }: { params: { slug: string } }) => {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className='wrapper'>
      <div className='mx-auto mt-10 max-w-7xl px-4'>
        <div className="flex flex-col gap-4">
          {/* fil d'ariane */}
          <div className='flex items-center gap-4'>
            <Link href='/home' className='text-influenca-gold hover:opacity-60'>Accueil</Link>
            <span className='font-bold text-influenca-gray' >/</span>
            <Link href={`/boutique/${product.influencer.id}`} className='text-influenca-gold first-letter:uppercase hover:opacity-60'>{product.influencer.username}</Link>
            <span className='font-bold text-influenca-gray' >/</span>
            <p className='font-bold text-influenca-black-70 first-letter:uppercase'>{product.title}</p>
          </div>
          {/* Informations du vendeur */}
          <div className="mb-6 flex items-center gap-4">
            {product.influencer.avatar ? (
              <Image
                src={product.influencer.avatar}
                alt={product.influencer.username}
                width={48}
                height={48}
                className="size-20 rounded-full object-cover"
                unoptimized
              />
            ) : (
              <div className="flex size-12 items-center justify-center rounded-full bg-influenca-black">
                <span className="text-lg text-white">
                  {product.influencer.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold">{product.influencer.username}</h2>
              <div className="flex gap-2">
                {product.categories.map((cat) => (
                  <span key={cat.category.id} className="tag">
                    {cat.category.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Détails du produit */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Taille</h4>
                <p>{product.size}</p>
              </div>
              <div>
                <h4 className="font-medium">Couleur</h4>
                <p>{product.color}</p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold">{product.price}€</h3>
            </div>

            <button className="w-full rounded-lg bg-influenca-black py-3 text-white hover:opacity-80">
              Acheter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowProduct; 