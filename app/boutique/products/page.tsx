'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import ProductCard from '@/components/product/ProductCard'

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

export default function BoutiquePage() {
  const { data: session, status } = useSession()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const handleDelete = async (productId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        const response = await fetch(`/api/boutique/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        if (response.ok) {
          const refreshResponse = await fetch('/api/boutique/products', {
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            cache: 'no-store'
          });
          
          if (refreshResponse.ok) {
            const freshData = await refreshResponse.json();
            setProducts(freshData);
          }
          
          alert('Produit supprimé avec succès');
        } else {
          const data = await response.json();
          console.error('Erreur de suppression:', data);
          alert(data.error || 'Erreur lors de la suppression du produit');
        }
      } catch (error) {
        console.error('Erreur détaillée:', error);
        alert('Erreur lors de la suppression du produit');
      }
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Vérifier si l'utilisateur est connecté et a le rôle INFLUENCER
        if (!session?.user || session.user.role !== 'INFLUENCER') {
          throw new Error('Accès non autorisé')
        }

        const response = await fetch('/api/boutique/products', {
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
    return <div className="flex min-h-screen items-center justify-center">Chargement...</div>
  }

  return (
    <div className='wrapper'>
      <div className='mx-auto mt-10 max-w-7xl px-4'>
        <h1 className="mb-6 text-2xl font-bold">Ma Boutique</h1>

        {products.length === 0 ? (
          <p>Vous n&apos;avez pas encore de produits.</p>
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
                  modify={true}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 