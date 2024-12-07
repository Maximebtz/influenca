import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import Home from "@/app/home/page";
import { prisma } from "@/lib/db";
import React from 'react';
import type { User, Role, Follow, Product, Category } from '@prisma/client';

declare global {
  namespace jest {
    interface Matchers<R, T> {
      toBeTruthy(): R;
    }
  }
}

type ProductWithCategories = Product & {
  categories: { category: Category }[];
};

type UserWithRelations = User & {
  followers: Follow[];
  products: ProductWithCategories[];
};

// Mock des composants et des dépendances
jest.mock('@/components/influencer/InfluencerCard', () => ({
  __esModule: true,
  default: function MockInfluencerCard(props: any) {
    return React.createElement('div', {
      'data-testid': 'influencer-card'
    }, props.username);
  }
}));

jest.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findMany: jest.fn()
    }
  }
}));

describe("Page Home", () => {
  let consoleErrorSpy: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
    const mockUser: UserWithRelations = {
      id: '1',
      username: 'testuser',
      name: null,
      bio: null,
      email: 'test@test.com',
      emailVerified: null,
      avatar: 'test-avatar.jpg',
      banner: 'test-banner.jpg',
      password: 'hashedpassword',
      role: 'INFLUENCER' as Role,
      createdAt: new Date(),
      updatedAt: new Date(),
      followers: [],
      products: []
    };

    (prisma.user.findMany as jest.MockedFunction<() => Promise<UserWithRelations[]>>)
      .mockResolvedValue([mockUser]);
    
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("affiche la liste des influenceurs", async () => {
    const { getByText, getByTestId } = render(await Home());
    
    expect(getByText("Découvrez nos influenceurs")).toBeTruthy();
    expect(getByTestId("influencer-card")).toBeTruthy();
    expect(getByText("testuser")).toBeTruthy();
  });

  it("affiche un message quand aucun influenceur n'est trouvé", async () => {
    (prisma.user.findMany as jest.MockedFunction<() => Promise<UserWithRelations[]>>)
      .mockResolvedValueOnce([]);
    
    const { getByText } = render(await Home());
    expect(getByText("Aucun influenceur trouvé")).toBeTruthy();
  });

  it("gère les erreurs de récupération des influenceurs", async () => {
    (prisma.user.findMany as jest.MockedFunction<() => Promise<UserWithRelations[]>>)
      .mockRejectedValueOnce(new Error('Erreur DB'));
    
    const { getByText } = render(await Home());
    expect(getByText("Aucun influenceur trouvé")).toBeTruthy();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Erreur lors de la récupération des influenceurs:',
      expect.any(Error)
    );
  });
}); 