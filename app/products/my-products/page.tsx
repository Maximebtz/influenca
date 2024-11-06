'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
}

export default function MyProducts() {
  const { data: session, status } = useSession()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Vérifier si l'utilisateur est connecté et a le rôle INFLUENCER
        if (!session?.user || session.user.role !== 'INFLUENCER') {
          throw new Error('Accès non autorisé')
          redirect('/home')
        }

        const response = await fetch('/api/products/my-products', {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include' // Important pour les cookies de session
        })

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`)
        }

        const data = await response.json()
        setProducts(data)

        console.log("Data :" + data)
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchProducts()
    }
  }, [session, status])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Chargement...</div>
  }
  console.log(products)
  return (
    <div className='wrapper'>
      <div className='max-w-7xl mx-auto px-4'>
        <h1 className="text-2xl font-bold">Mes Produits</h1>
        
        {products.length === 0 ? (
            <p>Vous n'avez pas encore de produits.</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
                <div key={product.id} className="bg-white bg-opacity-10 rounded-lg p-4">
                {product.images && product.images[0] && (
                    <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                )}
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-300 mb-2">{product.description}</p>
                <p className="font-bold">{product.price}€</p>
                </div>
            ))}
            </div>
        )}
        </div>
    </div>
  )
} 