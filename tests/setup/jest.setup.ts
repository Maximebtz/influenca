import { FormData } from 'formdata-node';

// Configuration globale pour les tests
global.FormData = FormData as any;

// Configuration de l'environnement de test
process.env.CLOUDINARY_CLOUD_NAME = 'test_cloud_name';
process.env.CLOUDINARY_API_KEY = 'test_api_key';
process.env.CLOUDINARY_API_SECRET = 'test_api_secret'; 