const nextAuth = jest.fn(() => ({
  auth: jest.fn()
}));

export default nextAuth;

export const signIn = jest.fn();
export const signOut = jest.fn();
export const useSession = jest.fn(); 