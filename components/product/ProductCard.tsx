import Image from 'next/image'
import Link from 'next/link'

type ProductCardProps = {
    id: string
    slug: string
    title: string
    description: string
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
    modify?: boolean
    onDelete?: (id: string) => void
}
function ProductCard({ id, slug, title, description, price, createdAt, influencer, categories, modify, onDelete }: ProductCardProps) {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        if (onDelete) {
            onDelete(id)
        }
    }

    return (
        <Link href={`/product/${slug}`}>
            <div className="reliative card hover:scale-105 transition-transform cursor-pointer">
                {modify && (
                    <div className='absolute top-2 right-2 flex gap-2'>
                        <button
                            onClick={handleClick}
                            className="mt-0 bg-black text-white px-2 py-2 rounded hover:opacity-80"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                            </svg>
                        </button>
                        <button
                            onClick={handleClick}
                            className="mt-0 bg-red-500 text-white px-2 py-2 rounded hover:opacity-80"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                            </svg>
                        </button>
                    </div>
                )}
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
                <h2 className='text-lg font-bold'>
                    {title}
                </h2>
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