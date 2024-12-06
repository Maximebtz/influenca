import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import Home from "../app/home/page";
import { prisma } from "@/lib/db";
import React from 'react';
import type { User, Role, Follow, Product } from '@prisma/client';

declare global {
  namespace jest {
    interface Matchers<R, T> {
      toBeTruthy(): R;
    }
  }
}

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

// Type pour l'utilisateur avec les relations
type UserWithRelations = User & {
  followers: Follow[];
  products: Product[];
};

describe("Page Home", () => {
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

    (prisma.user.findMany as jest.MockedFunction<typeof prisma.user.findMany>)
      .mockResolvedValue([mockUser]);
  });

  it("affiche la liste des influenceurs", async () => {
    const { getByText, getByTestId } = render(await Home());
    
    expect(getByText("Découvrez nos influenceurs")).toBeTruthy();
    expect(getByTestId("influencer-card")).toBeTruthy();
    expect(getByText("testuser")).toBeTruthy();
  });

  it("affiche un message quand aucun influenceur n'est trouvé", async () => {
    (prisma.user.findMany as jest.MockedFunction<typeof prisma.user.findMany>)
      .mockResolvedValueOnce([]);
    
    const { getByText } = render(await Home());
    expect(getByText("Aucun influenceur trouvé")).toBeTruthy();
  });
});