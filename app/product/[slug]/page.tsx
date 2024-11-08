import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";

async function getProduct(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        categories: {
          include: {
            category: true
          }
        },
        influencer: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        images: true
      }
    });

    if (!product) {
      return null;
    }

    return product;
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    return null;
  }
}

const ShowProduct = async ({ params }: { params: { slug: string } }) => {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className='wrapper'>
      <div className='max-w-7xl mx-auto px-4 mt-10'>
        <div className="flex flex-col gap-4">
          {/* Informations du vendeur */}
          <div className="flex items-center gap-4 mb-6">
            {product.influencer.avatar ? (
              <Image
                src={`/uploads/${product.influencer.avatar}`}
                alt={product.influencer.username}
                width={48}
                height={48}
                className="rounded-full object-cover w-20 h-20"
              />
            ) : (
              <div className="w-12 h-12 bg-influenca-black rounded-full flex items-center justify-center">
                <span className="text-white text-lg">
                  {product.influencer.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold">{product.influencer.username}</h2>
              <div className="flex gap-2">
                {product.categories.map((cat) => (
                  <span key={cat.category.id} className="tag">
                    {cat.category.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Détails du produit */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Taille</h4>
                <p>{product.size}</p>
              </div>
              <div>
                <h4 className="font-medium">Couleur</h4>
                <p>{product.color}</p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold">{product.price}€</h3>
            </div>

            <button className="w-full bg-influenca-black text-white py-3 rounded-lg hover:opacity-80">
              Acheter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowProduct; 