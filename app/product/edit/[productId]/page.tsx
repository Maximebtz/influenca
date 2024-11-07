'use client'

import ProductEditForm from "@/components/product/ProductEditForm"
import { useSession } from 'next-auth/react'
import { useEffect, useState } from "react"
import { redirect } from 'next/navigation'

interface Product {
  title: string;
  color: string;
  size: string;
  price: number;
  description: string;
  categories: { categoryId: string }[];
}

const EditProduct = ({ params }: { params: { productId: string } }) => {
  const { data: session, status } = useSession()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/product/${params.productId}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
        }
      } catch (error) {
        console.error("Erreur lors du chargement du produit:", error)
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      fetchProduct()
    }
  }, [session, params.productId])

  if (status === 'loading' || loading) {
    return <div className="wrapper">Chargement...</div>
  }

  if (!session?.user || session.user.role !== 'INFLUENCER') {
    redirect('/home')
  }

  if (!product) {
    return <div className="wrapper">Produit non trouvé</div>
  }

  const initialData = {
    title: product.title,
    color: product.color,
    size: product.size,
    price: product.price,
    description: product.description,
    categoryIds: product.categories.map((cat: any) => cat.categoryId)
  }

  return (
    <div className='wrapper'>
      <div className='max-w-2xl mx-auto px-4 mt-10'>
        <h1 className='mb-8 text-center'>
          Modifier le produit
        </h1>
        <ProductEditForm productId={params.productId} initialData={initialData} />
      </div>    
    </div>
  )
}

export default EditProduct 