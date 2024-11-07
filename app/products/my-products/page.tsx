'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import ProductCard from '@/components/product/ProductCard'

interface Product {
  id: string
  title: string
  name: string
  description: string
  slug: string
  price: number
  createdAt: Date
  influencer: {
    username: string
    avatar?: string
  }
  categories: {
    category: {
      name: string
    }
  }[]
}

export default function MyProducts() {
  const { data: session, status } = useSession()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const handleDelete = async (productId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        const response = await fetch(`/api/products/my-products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
          setProducts(products.filter(product => product.id !== productId));
          alert('Produit supprimé avec succès');
        } else {
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

  return (
    <div className='wrapper'>
      <div className='max-w-7xl mx-auto px-4 mt-10'>
        <h1 className="text-2xl font-bold mb-6">Mes Produits</h1>
        
        {products.length === 0 ? (
            <p>Vous n'avez pas encore de produits.</p>
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