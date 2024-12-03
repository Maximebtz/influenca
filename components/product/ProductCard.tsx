import Image from 'next/image'
import Link from 'next/link'

type ProductCardProps = {
    id: string
    slug: string
    title: string
    description: string
    price: number
    // createdAt: Date
    // influencer: {
    //     username: string
    //     avatar?: string
    //     followers: string[]
    // }
    categories: {
        category: {
            name: string
        }
    }[]
    images?: { url: string }[]
    modify?: boolean
    onDelete?: (id: string) => void
}

function ProductCard({ id, slug, title, description, price, categories, images, modify, onDelete }: ProductCardProps) {
    if (!images || images.length === 0) {
        throw new Error("Chaque produit doit avoir au moins une image.");
    }

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        if (onDelete) {
            onDelete(id)
        }
    }
    
    return (
        <Link href={`/product/${slug}`} className='flex h-[512px] max-h-[512px] min-h-[512px] flex-col'>
            <div className="card relative flex h-full cursor-pointer flex-col transition duration-100">
            

                <div className='relative'>
                    <Image
                        src={`/uploads/${images[0].url}`}
                        alt={title}
                        width={200}
                        height={200}
                        className="size-full rounded-lg object-cover"
                        priority
                        unoptimized
                    />
                </div>
                <div className=' relative flex flex-col gap-2'>
                    {modify && (
                        <div className='absolute right-0 top-2 z-10 flex gap-2'>
                            <Link href={`/product/edit/${id}`}>
                                <button
                                    className="mt-0 rounded bg-black p-2 text-white hover:opacity-80"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                                    </svg>
                                </button>
                            </Link>
                            <button
                                onClick={handleClick}
                                className="mt-0 rounded bg-red-500 p-2 text-white hover:opacity-80"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                                </svg>
                            </button>
                        </div>
                    )}
                    <h2 className='pt-4 text-xl font-semibold'>
                        {title}
                    </h2>
                    <span className="tag">
                        {categories?.map((category) => category.category.name).join(', ')}
                    </span>
                    <div className='flex flex-col gap-1'>
                        <h4 className='text-base font-semibold'>
                            Description du produit
                        </h4>
                        <p className="card-description">{description}</p>
                    </div>
                    <p className="text-lg font-bold italic opacity-70">{price}€</p>
                </div>
            </div>
        </Link>
    )
}

export default ProductCard