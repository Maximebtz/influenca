import cloudinary from './cloudinary';

export async function uploadToCloudinary(file: Buffer, folder: string = 'influenca'): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Upload failed'));
          return;
        }
        resolve(result.secure_url);
      }
    );

    uploadStream.end(file);
  });
}

export function validateFileType(filename: string): boolean {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = filename.toLowerCase().match(/\.[^.]*$/)?.[0];
  return ext ? allowedExtensions.includes(ext) : false;
} 