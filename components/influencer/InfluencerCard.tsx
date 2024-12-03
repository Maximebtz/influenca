import Image from 'next/image'
import Link from 'next/link'

type InfluencerCardProps = {
    id: string
    username: string
    bio?: string
    avatar?: string
    banner?: string
    // role: string
    followers: {
        id: string
    }[]
    products: {
        categories: {
            category: {
                name: string
            }
        }[]
    }[]
}

function InfluencerCard({ id, username, bio, avatar, banner, followers, products }: InfluencerCardProps) {
    const uniqueCategories = Array.from(new Set(
        products.flatMap(product => 
            product.categories.map(cat => cat.category.name)
        )
    ));

    console.log(banner)

    return (
        <Link href={`/boutique/${id}`} className='h-[512px] max-h-[512px]'>
            <div className="card relative h-full cursor-pointer transition duration-100">
                <div className='relative'>
                    {/* Image principale (bannière) */}
                    {banner ? (
                        <Image
                            src={`/uploads/${banner}`}
                            alt={`Bannière de ${username}`}
                            width={200}
                            height={240}
                            className="h-[240px] w-full rounded-lg object-cover"
                            priority
                            unoptimized
                        />
                    ) : (
                        <div className="flex h-[240px] w-full items-center justify-center rounded-lg bg-gradient-to-r from-gray-100 to-gray-200">
                            <span className="text-gray-500">No banner available</span>
                        </div>
                    )}
                    
                    {/* Avatar superposé */}
                    <div className="absolute bottom-0 left-8 flex translate-y-1/2 items-center gap-2">
                        <div className="flex size-[calc(3.5rem+4px)] items-center justify-center rounded-full bg-white">
                            {avatar ? (
                                <Image
                                    src={`/uploads/${avatar}`}
                                    alt={username}
                                    width={56}
                                    height={56}
                                    className="size-14 rounded-full object-cover"
                                    priority
                                    unoptimized
                                />
                            ) : (
                                <div className='flex size-14 items-center justify-center rounded-full bg-black'>
                                    <span className='text-white'>
                                        {username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className='mt-8 flex flex-col gap-2'>
                    <div className='flex w-full justify-between gap-2'>
                        <div className='flex items-center gap-1'>
                            <span className='font-medium text-influenca-gray'>@</span>
                            <h3 className="text-sm font-medium first-letter:uppercase ">
                                {username}
                            </h3>
                        </div>
                        <p className="-mt-1 text-sm font-medium text-influenca-gray">
                            {followers.length} followers
                        </p>
                    </div>
                
                    <div className="flex flex-wrap gap-2">
                        {uniqueCategories.map((category, index) => (
                            <span key={index} className="tag">
                                {category}
                            </span>
                        ))}
                    </div>
                    <div>
                        <h4 className='text-base font-semibold'>
                            Bio
                        </h4>
                        <p className="card-description">
                            {bio || "Aucune description disponible"}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default InfluencerCard