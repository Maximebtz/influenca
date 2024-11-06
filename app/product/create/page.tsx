'use client'

import ProductCreateForm from "@/components/product/ProductCreateForm"
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'


const CreateArticle = () => {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login')
    }

    if (session?.user?.role !== 'INFLUENCER') {
      redirect('/home')
    }
  })

  return (
    <div className='wrapper'>
      <div className='max-w-7xl mx-auto px-4'>
        <h1 className='mb-8'>
          Créer un produit
        </h1>
        <ProductCreateForm />
      </div>
    </div>
  )
}

export default CreateArticle