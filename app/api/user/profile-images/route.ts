import { auth } from "@/app/auth"
import { prisma } from "@/lib/db"
import { writeFile } from 'fs/promises'
import { NextResponse } from "next/server"
import path from 'path'

export async function POST(request: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const formData = await request.formData()
        const avatar = formData.get('avatar') as File | null
        const banner = formData.get('banner') as File | null

        const updateData: any = {}

        if (avatar) {
            const avatarBuffer = await avatar.arrayBuffer()
            const avatarFilename = `${session.user.id}-avatar-${Date.now()}${path.extname(avatar.name)}`
            await writeFile(
                path.join(process.cwd(), 'public/uploads', avatarFilename),
                Buffer.from(avatarBuffer)
            )
            updateData.avatar = avatarFilename
        }

        if (banner) {
            const bannerBuffer = await banner.arrayBuffer()
            const bannerFilename = `${session.user.id}-banner-${Date.now()}${path.extname(banner.name)}`
            await writeFile(
                path.join(process.cwd(), 'public/uploads', bannerFilename),
                Buffer.from(bannerBuffer)
            )
            updateData.banner = bannerFilename
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error('Erreur lors de la mise à jour des images:', error)
        return NextResponse.json(
            { error: "Erreur lors de la mise à jour des images" },
            { status: 500 }
        )
    }
} 