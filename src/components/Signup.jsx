import { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { signUp, signIn, logOut, signInWithGoogle } from "../utils/auth";
import { useAuth } from "../context/AuthContext";


function SignUp() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  const navigate = useNavigate();

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

  const handleLogOut = async () => {
    setError("");
    try {
      await logOut();
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
    return (
      <div>
      <div className="justify-content-center text-center">You are logged in as {currentUser.email}!</div>
      <div className="justify-content-center text-center"><Button onClick={() => handleLogOut()}>Log Out</Button></div>
      </div>
    )
  }

  return (
    <Container className="d-flex justify-content-center align-items-center">
      <Card className="p-4 shadow-lg" style={{ width: '350px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">{isSignUp ? "Sign Up" : "Sign In"}</h2>
          <Form onSubmit={handleAuth}>
            {/* Email Input */}
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            {/* Password Input */}
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            {/* Buttons */}
            <div className="d-grid gap-2">
              <Button variant="success" type="submit" onClick={() => setIsSignUp(isSignUp)}>
                {isSignUp ? "Sign Up" : "Sign In"}
              </Button>
            </div>

            <div className='text-center mt-3'>
              <p>
              {isSignUp ? "Already have an account? " : "No account? "}
              <Button variant='light' onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? "Sign In" : "Sign Up"}
              </Button>
              </p>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </div>

            <div className='text-center mt-3'>
              <Button variant="dark" onClick={handleGoogleSignIn}>
                Login with Google
              </Button>
            </div>

          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default SignUp;
