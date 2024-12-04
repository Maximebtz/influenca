import InfluencerCard from "@/components/influencer/InfluencerCard";
import { prisma } from "@/lib/db";
import { unstable_cache } from 'next/cache';

interface Influencer {
  id: string;
  username: string;
  bio?: string | null;
  avatar?: string | null;
  banner?: string | null;
  followers: { id: string }[];
  products: {
    categories: {
      category: {
        name: string;
      };
    }[];
  }[];
}

const getInfluencers = unstable_cache(
  async () => {
    try {
        const influencers = await prisma.user.findMany({
            where: {
                role: 'INFLUENCER'
            },
            select: {
                id: true,
                username: true,
                bio: true,
                avatar: true,
                banner: true,
                followers: {
                    select: {
                        id: true
                    }
                },
                products: {
                    select: {
                        categories: {
                            select: {
                                category: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        
        return influencers as Influencer[];
    } catch (error) {
        console.error('Erreur lors de la récupération des influenceurs:', error);
        return [] as Influencer[];
    }
  },
  ['influencers-list'],
  {
    revalidate: 60,
    tags: ['influencers']
  }
);

export const revalidate = 60;
export const dynamic = 'force-dynamic'; 

export default async function Home() {
    const influencers = await getInfluencers();

    return (
        <div className='wrapper'>
            <div className='mx-auto max-w-7xl px-4'>
                <h1 className='mb-8'>
                    Découvrez nos influenceurs
                </h1>
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3'>
                    {influencers && influencers.length > 0 ? (
                        influencers.map((influencer) => (
                            <InfluencerCard
                                key={influencer.id}
                                id={influencer.id}
                                username={influencer.username}
                                bio={influencer.bio || undefined}
                                avatar={influencer.avatar || undefined}
                                banner={influencer.banner || undefined}
                                // role={influencer.role}
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