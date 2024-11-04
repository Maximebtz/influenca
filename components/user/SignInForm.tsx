

export default function SignInForm() {
  return (
    <form className="flex flex-col gap-4 mt-14 w-full max-w-md mx-auto">
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Mot de passe" required />
        <button className="medium-button" type="submit">Se connecter</button>
    </form>
  );
}
