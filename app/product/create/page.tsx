'use client'

import ProductCreateForm from "@/components/product/ProductCreateForm"
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'


const CreateArticle = () => {
  const { data: session, status } = useSession()

  // Vérifier si l'utilisateur est connecté et a le rôle INFLUENCER
  if (status === 'loading') {
    return null
  }

  if (!session?.user || session.user.role !== 'INFLUENCER') {
    throw new Error('Accès non autorisé')
    redirect('/home')
  }

  return (
    <div className='wrapper'>
      <div className='max-w-2xl mx-auto px-4 mt-10'>
        <h1 className='mb-8 text-center'>
          Créer un produit
        </h1>
        <ProductCreateForm />
      </div>    
    </div>
  )
}

export default CreateArticle