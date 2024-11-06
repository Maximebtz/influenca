import Image from 'next/image'
import Link from 'next/link'

type ProductCardProps = {
    id: string
    description: string
    price: number
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

function ProductCard({ id, description, price, influencer, categories }: ProductCardProps) {
    return (
        <Link href={`/product/${id}`}>
            <div className="card hover:scale-105 transition-transform cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-full bg-influenca-light-gray flex items-center justify-center">
                        {influencer.avatar ? (
                            <Image
                                src={influencer.avatar}
                                alt={influencer.username}
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                        ) : (
                            <div className='w-10 h-10 bg-black rounded-full flex items-center justify-center'>
                                <span className='text-white'>
                                    {influencer.username?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>
                    <span className="text-sm font-medium">{influencer.username}</span>
                </div>
                <p className="text-sm text-black">
                    {categories?.map((category) => category.category.name).join(', ')}
                </p>
                <p className="card-description">{description}</p>
                <p className="text-lg font-bold">{price}€</p>
            </div>
        </Link>
    )
}

export default ProductCard