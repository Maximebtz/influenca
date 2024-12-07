const CredentialsProvider = () => ({
  id: 'credentials',
  name: 'Credentials',
  type: 'credentials',
  credentials: {
    email: { label: "Email", type: "text" },
    password: { label: "Password", type: "password" }
  },
  authorize: jest.fn()
});

export default CredentialsProvider; 