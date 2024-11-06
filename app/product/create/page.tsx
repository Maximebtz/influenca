import ProductCreateForm from "@/components/product/ProductCreateForm"


const CreateArticle = () => {
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