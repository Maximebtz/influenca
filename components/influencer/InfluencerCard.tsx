import Image from 'next/image'
import Link from 'next/link'

type InfluencerCardProps = {
    id: string
    username: string
    bio?: string
    avatar?: string
    banner?: string
    role: string
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

function InfluencerCard({ id, username, bio, avatar, banner, role, followers, products }: InfluencerCardProps) {
    const uniqueCategories = Array.from(new Set(
        products.flatMap(product => 
            product.categories.map(cat => cat.category.name)
        )
    ));

    console.log(banner)

    return (
        <Link href={`/boutique/${id}`} className='max-h-[512px] h-[512px]'>
            <div className="relative card transition duration-100 cursor-pointer h-full">
                <div className='relative'>
                    {/* Image principale (bannière) */}
                    {banner ? (
                        <Image
                            src={`/uploads/${banner}`}
                            alt={`Bannière de ${username}`}
                            width={200}
                            height={240}
                            className="rounded-lg w-full h-[240px] object-cover"
                            priority
                        />
                    ) : (
                        <div className="w-full h-[240px] bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500">No banner available</span>
                        </div>
                    )}
                    
                    {/* Avatar superposé */}
                    <div className="absolute left-8 bottom-0 translate-y-1/2 flex items-center gap-2">
                        <div className="w-[calc(3.5rem+4px)] h-[calc(3.5rem+4px)] rounded-full bg-white flex items-center justify-center">
                            {avatar ? (
                                <Image
                                    src={`/uploads/${avatar}`}
                                    alt={username}
                                    width={56}
                                    height={56}
                                    className="w-14 h-14 rounded-full object-cover"
                                    priority
                                />
                            ) : (
                                <div className='w-14 h-14 bg-black rounded-full flex items-center justify-center'>
                                    <span className='text-white'>
                                        {username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className='flex flex-col gap-2 mt-8'>
                    <div className='flex w-full justify-between gap-2'>
                        <div className='flex items-center gap-1'>
                            <span className='text-influenca-gray font-medium'>@</span>
                            <h3 className="text-sm font-medium first-letter:uppercase ">
                                {username}
                            </h3>
                        </div>
                        <p className="text-sm text-influenca-gray font-medium -mt-1">
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