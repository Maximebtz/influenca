import ProductCard from "@/components/product/ProductCard";


async function getProducts() {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/product`;
    console.log('Fetching products from:', apiUrl);

    const res = await fetch(apiUrl, {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      console.error('Erreur de réponse:', res.status, res.statusText);
      const errorText = await res.text();
      console.error('Détails de l\'erreur:', errorText);
      return [];
    }
    
    const data = await res.json();
    
    return data;
  } catch (error) {
    console.error('Erreur détaillée:', error);
    return [];
  }
}

async function Home() {
  const products = await getProducts();

  return (
    <div className='wrapper'>
      <div className='max-w-7xl mx-auto px-4'>
        <h1 className='mb-8'>
          Découvrez nos produits
        </h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {products && products.length > 0 ? (
            products.map((product: any) => (
              <ProductCard
                key={product.id}
                id={product.id}
                slug={product.slug}
                title={product.title}
                createdAt={product.createdAt}
                description={product.description}
                price={product.price}
                influencer={product.influencer}
                categories={product.categories}
                modify={false}
              />
            ))
          ) : (
            <p>Aucun produit disponible pour le moment</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home