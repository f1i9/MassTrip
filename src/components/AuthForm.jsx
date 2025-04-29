import { useState } from "react";
import { signUp, signIn, logOut, signInWithGoogle } from "../utils/auth";
import { useAuth } from "../context/AuthContext";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message);
    }
  };

  if (currentUser) {
    return <div>Welcome, {currentUser.email}! <button onClick={() => logOut()}>Log Out</button></div>;
  }

  return (
    <div>
      <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
      <form onSubmit={handleAuth}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</button>
      </form>

      <button onClick={handleGoogleSignIn}>Sign In with Google</button>
      <p>
        {isSignUp ? "Already have an account?" : "No account?"}
        <button onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Sign In" : "Sign Up"}
        </button>
      </p>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AuthForm;