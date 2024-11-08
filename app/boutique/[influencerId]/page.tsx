'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import ProductCard from '@/components/product/ProductCard'
import { useParams } from 'next/navigation'

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
  const { data: session } = useSession()
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
    return <div className="flex justify-center items-center min-h-screen">Chargement...</div>
  }

  if (!influencer) {
    return <div className="wrapper">Influenceur non trouvé</div>
  }

  return (
    <div className='wrapper'>
      {/* En-tête de la boutique */}
      <div className='relative w-full h-[200px] mb-8'>
        {influencer.banner ? (
          <img
            src={`/uploads/${influencer.banner}`}
            alt="Bannière"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200" />
        )}
        <div className='absolute bottom-4 left-4 flex items-center gap-4'>
          {influencer.avatar && (
            <img
              src={`/uploads/${influencer.avatar}`}
              alt={influencer.username}
              className="w-16 h-16 rounded-full border-2 border-white"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">
              Boutique de {influencer.username}
            </h1>
            {influencer.bio && (
              <p className="text-white drop-shadow-lg">{influencer.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* Liste des produits */}
      <div className='max-w-7xl mx-auto px-4'>
        {products.length === 0 ? (
          <p>Aucun produit disponible pour le moment</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className='relative'>
                <ProductCard
                  id={product.id}
                  title={product.title}
                  slug={product.slug}
                  price={product.price}
                  description={product.description}
                  createdAt={product.createdAt}
                  influencer={product.influencer}
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