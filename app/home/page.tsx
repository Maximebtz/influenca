import InfluencerCard from "@/components/influencer/InfluencerCard";
import { prisma } from "@/lib/db";

async function getInfluencers() {
    try {
        const influencers = await prisma.user.findMany({
            where: {
                role: 'INFLUENCER'
            },
            include: {
                followers: true,
                products: {
                    include: {
                        categories: {
                            include: {
                                category: true
                            }
                        }
                    }
                }
            }
        });
        
        return influencers;
    } catch (error) {
        console.error('Erreur lors de la récupération des influenceurs:', error);
        return [];
    }
}

export default async function Home() {
    const influencers = await getInfluencers();

    return (
        <div className='wrapper'>
            <div className='max-w-7xl mx-auto px-4'>
                <h1 className='mb-8'>
                    Découvrez nos influenceurs
                </h1>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                    {influencers && influencers.length > 0 ? (
                        influencers.map((influencer) => (
                            <InfluencerCard
                                key={influencer.id}
                                id={influencer.id}
                                username={influencer.username}
                                bio={influencer.bio || undefined}
                                avatar={influencer.avatar || undefined}
                                banner={influencer.banner || undefined}
                                role={influencer.role}
                                followers={influencer.followers}
                                products={influencer.products}
                            />
                        ))
                    ) : (
                        <p>Aucun influenceur disponible pour le moment</p>
                    )}
                </div>
            </div>
        </div>
    )
}