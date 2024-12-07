import { describe, expect, test } from '@jest/globals';

// Fonction pour générer un slug à partir d'un titre
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9]+/g, '-')     // Remplace les caractères spéciaux par des tirets
    .replace(/^-+|-+$/g, '')         // Supprime les tirets au début et à la fin
    .substring(0, 200);              // Limite la longueur
}

describe('generateSlug', () => {
  test('devrait générer un slug correct', () => {
    expect(generateSlug('Titre avec des accents et des caractères spéciaux!')).toBe('titre-avec-des-accents-et-des-caracteres-speciaux');
    expect(generateSlug('   Titre avec des espaces   ')).toBe('titre-avec-des-espaces');
    expect(generateSlug('Lors de la création d’URL conviviales pour le référencement, il est essentiel de transformer les titres en slugs lisibles, en remplaçant les espaces par des tirets et en supprimant les caractères spéciaux.')).toHaveLength(200);
  });
});