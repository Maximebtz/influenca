'use client'

// import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import ProductCard from '@/components/product/ProductCard'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string
  title: string
  description: string
  slug: string
  price: number
  createdAt: Date
  images: { url: string }[] | undefined
  influencer: {
    id: string
    username: string
    avatar?: string
  }
  categories: {
    category: {
      name: string
    }
  }[]
}

interface Influencer {
  username: string
  avatar?: string
  banner?: string
  bio?: string
}

export default function BoutiqueInfluenceur() {
  // const { data: session } = useSession()
  const params = useParams()
  const [products, setProducts] = useState<Product[]>([])
  const [influencer, setInfluencer] = useState<Influencer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInfluencerAndProducts = async () => {
      try {
        // Récupérer les informations de l'influenceur
        const influencerResponse = await fetch(`/api/influencer/${params.influencerId}`)
        if (!influencerResponse.ok) {
          throw new Error('Erreur lors de la récupération des informations de l\'influenceur')
        }
        const influencerData = await influencerResponse.json()
        setInfluencer(influencerData)

        // Récupérer les produits de l'influenceur
        const productsResponse = await fetch(`/api/boutique/${params.influencerId}/products`)
        if (!productsResponse.ok) {
          throw new Error('Erreur lors de la récupération des produits')
        }
        const productsData = await productsResponse.json()
        setProducts(productsData)
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.influencerId) {
      fetchInfluencerAndProducts()
    }
  }, [params.influencerId])

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Chargement...</div>
  }

  if (!influencer) {
    return <div className="wrapper">Influenceur non trouvé</div>
  }

  return (
    <div className='wrapper '>
      {/* En-tête de la boutique */}
      <div className='relative mb-8 h-[200px] w-full'>
        {influencer.banner ? (
          <Image
            src={`/uploads/${influencer.banner}`}
            alt="Bannière"
            fill
            className="object-cover"
            priority
            unoptimized
          />
        ) : (
          <div className="size-full bg-gradient-to-r from-gray-100 to-gray-200" />
        )}
        <div className='absolute bottom-4 left-4 flex items-center gap-4'>
          {influencer.avatar && (
            <Image
              width={64}
              height={64}
              src={`/uploads/${influencer.avatar}`}
              alt={influencer.username}
              className="flex size-16 min-h-16 min-w-16 rounded-full border-2 border-white object-cover"
              unoptimized
            />
          )}
          <div className='flex flex-wrap gap-2'>
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">
              Boutique de {influencer.username}
            </h1>
          </div>
        </div>
      </div>
      {/* Liste des produits */}
      <div className='mx-auto flex max-w-7xl flex-col gap-8 px-4 pt-16'>
        {/* fil d'ariane */}
        <div className='flex items-center gap-4'>
          <Link href='/home' className='text-influenca-gold hover:opacity-60'>Accueil</Link>
          <span className='font-bold text-influenca-gray' >/</span>
          <p className='font-bold text-influenca-black-70 first-letter:uppercase'>{influencer.username}</p>
        </div>
        {influencer.bio && (
          <div className='flex flex-col '>
            <h3>
              Bio
            </h3>
              <p className="text-influenca-gray">{influencer.bio}</p>
          </div>
        )}
        {products.length === 0 ? (
          <p>Aucun produit disponible pour le moment</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className='relative'>
                <ProductCard
                  id={product.id}
                  title={product.title}
                  slug={product.slug}
                  price={product.price}
                  description={product.description}
                  // createdAt={product.createdAt}
                  // influencer={product.influencer}
                  categories={product.categories}
                  images={product.images}
                  modify={false}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 