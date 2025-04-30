import { useState, useEffect } from 'react';
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
  
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: ''
  });
  
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (touched.email) {
      validateField('email', email);
    }
    
    if (touched.password) {
      validateField('password', password);
    }
  }, [email, password, touched, isSignUp]);

  const validateField = (field, value) => {
    let error = '';
    
    switch(field) {
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
        
      case 'password':
        if (!value.trim()) {
          error = 'Password is required';
        } else if (isSignUp && value.length < 6) {
          error = 'Password must be at least 6 characters';
        }
        break;
        
      default:
        break;
    }
    
    setFormErrors(prev => ({
      ...prev,
      [field]: error
    }));
    
    return !error;
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError(""); 
  };
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(""); 
  };
  
  const handleBlur = (e) => {
    const { name } = e.target;
    
    setTouched({
      ...touched,
      [name]: true
    });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    
    setTouched({
      email: true,
      password: true
    });
    
    // Validate all fields
    const emailValid = validateField('email', email);
    const passwordValid = validateField('password', password);
    
    if (!emailValid || !passwordValid) {
      return; 
    }
    
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
        <div className="d-none d-md-block">
          <Card className="p-4 shadow-lg">
            <Card.Body>
              <h2 className="text-center mb-4">{isSignUp ? "Sign Up" : "Sign In"}</h2>
              <Form noValidate onSubmit={handleAuth}>
                <Form.Group className="mb-3 position-relative">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleBlur}
                    isInvalid={touched.email && !!formErrors.email}
                  />
                  <div className="error-message">
                    {touched.email && formErrors.email}
                  </div>
                </Form.Group>

                <Form.Group className="mb-3 position-relative">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={handleBlur}
                    isInvalid={touched.password && !!formErrors.password}
                  />
                  <div className="error-message">
                    {touched.password && formErrors.password}
                  </div>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="success" type="submit">
                    {isSignUp ? "Sign Up" : "Sign In"}
                  </Button>
                </div>

                <div className='text-center mt-3'>
                  <p>
                    {isSignUp ? "Already have an account? " : "No account? "}
                    <Button 
                      variant='light' 
                      onClick={() => {
                        setIsSignUp(!isSignUp);
                        setFormErrors({ email: '', password: '' });
                        setTouched({ email: false, password: false });
                        setError("");
                      }}
                    >
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

        <div className="d-block d-md-none">
          <h2 className="text-center mt-4 mb-4">{isSignUp ? "Sign Up" : "Sign In"}</h2>
          <Form noValidate onSubmit={handleAuth}>
            <Form.Group className="mb-3 position-relative">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleBlur}
                isInvalid={touched.email && !!formErrors.email}
                style={{ backgroundColor: '#f7f7f7', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}
              />
              <div className="error-message">
                {touched.email && formErrors.email}
              </div>
            </Form.Group>

            <Form.Group className="mb-3 position-relative">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={handleBlur}
                isInvalid={touched.password && !!formErrors.password}
                style={{ backgroundColor: '#f7f7f7', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}
              />
              <div className="error-message">
                {touched.password && formErrors.password}
              </div>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="success" type="submit">
                {isSignUp ? "Sign Up" : "Sign In"}
              </Button>
            </div>

            <div className='text-center mt-3'>
              <p>
                {isSignUp ? "Already have an account? " : "No account? "}
                <Button 
                  variant='light' 
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setFormErrors({ email: '', password: '' });
                    setTouched({ email: false, password: false });
                    setError("");
                  }}
                >
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