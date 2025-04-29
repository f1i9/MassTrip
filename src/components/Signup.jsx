import { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
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
      <Container className="d-flex flex-column justify-content-center align-items-center mt-4">
        <div className="text-center mb-3">You are logged in as {currentUser.email}!</div>
        <Button onClick={() => handleLogOut()}>Log Out</Button>
      </Container>
    )
  }

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ padding: '0 15px' }}>
      <div className="w-100" style={{ maxWidth: '400px' }}>
        {/* Desktop version (with card) */}
        <div className="d-none d-md-block">
          <Card className="p-4 shadow-lg">
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
                  <Button variant="dark" onClick={handleGoogleSignIn} className="w-100">
                    Login with Google
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>

        {/* Mobile version (no card) */}
        <div className="d-block d-md-none">
          <h2 className="text-center mt-4 mb-4">{isSignUp ? "Sign Up" : "Sign In"}</h2>
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
                style={{ backgroundColor: '#f7f7f7', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}
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
                style={{ backgroundColor: '#f7f7f7', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}
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
              <Button variant="dark" onClick={handleGoogleSignIn} className="w-100">
                Login with Google
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Container>
  );
}

export default SignUp;