export const v2 = {
  config: jest.fn(),
  uploader: {
    upload: jest.fn().mockResolvedValue({
      secure_url: 'https://res.cloudinary.com/test/image/upload/test.jpg'
    }),
    destroy: jest.fn().mockResolvedValue({ result: 'ok' })
  }
}; 