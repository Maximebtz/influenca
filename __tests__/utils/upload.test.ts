import { describe, expect, test } from '@jest/globals';

// Fonction de validation du type de fichier
function validateFileType(filename: string): boolean {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = filename.toLowerCase().match(/\.[^.]*$/)?.[0];
  return ext ? allowedExtensions.includes(ext) : false;
}

describe('validateFileType', () => {
  test('devrait valider les types de fichiers corrects', () => {
    expect(validateFileType('image.jpg')).toBe(true);
    expect(validateFileType('image.jpeg')).toBe(true);
    expect(validateFileType('image.png')).toBe(true);
    expect(validateFileType('image.webp')).toBe(true);
  });

  test('devrait rejeter les types de fichiers incorrects', () => {
    expect(validateFileType('document.pdf')).toBe(false);
    expect(validateFileType('archive.zip')).toBe(false);
    expect(validateFileType('image.bmp')).toBe(false);
  });
}); 