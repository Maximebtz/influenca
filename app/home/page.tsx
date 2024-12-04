import InfluencerCard from "@/components/influencer/InfluencerCard";
import { prisma } from "@/lib/db";
import type { User, Product, Follow, Category } from '@prisma/client';

type ProductWithCategories = Product & {
    categories: { category: Category }[];
};

type UserWithRelations = User & {
    followers: Follow[];
    products: ProductWithCategories[];
};

const getInfluencers = async () => {
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
};

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
                        influencers.map((influencer: UserWithRelations) => (
                            <InfluencerCard
                                key={influencer.id}
                                id={influencer.id}
                                username={influencer.username || ''}
                                avatar={influencer.avatar || ''}
                                banner={influencer.banner || ''}
                                followers={influencer.followers}
                                products={influencer.products}
                            />
                        ))
                    ) : (
                        <p>Aucun influenceur trouvé</p>
                    )}
                </div>
            </div>
        </div>
    );
}