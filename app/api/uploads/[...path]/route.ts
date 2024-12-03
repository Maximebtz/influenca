import { NextResponse } from 'next/server'
import { join } from 'path'
import { createReadStream } from 'fs'
import { stat } from 'fs/promises'

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = join(process.cwd(), 'public', 'uploads', ...params.path)
    console.log('Tentative d\'accès au fichier:', filePath)

    const stats = await stat(filePath)
    if (!stats.isFile()) {
      return new NextResponse('Not found', { status: 404 })
    }

    const fileStream = createReadStream(filePath)
    
    // Déterminer le type MIME
    const ext = filePath.split('.').pop()?.toLowerCase()
    const mimeTypes: { [key: string]: string } = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'webp': 'image/webp'
    }

    return new NextResponse(fileStream as unknown as BodyInit, {
      headers: {
        'Content-Type': mimeTypes[ext || ''] || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Erreur lors de l\'accès au fichier:', error)
    return new NextResponse('File not found', { status: 404 })
  }
} 