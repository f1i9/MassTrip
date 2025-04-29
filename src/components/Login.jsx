import { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with", formData);
  };

  const handleCreateAccount = () => {
    navigate('/signup'); // Navigate to the signup page
  };

  return (
    // Use d-flex and justify-content-center to center on desktop and mobile
    <Container className="d-flex justify-content-center align-items-center min-vh-100" style={{ padding: '0 15px' }}>
      {/* For desktop version, show Card; for mobile, show no card */}
      <div className="w-100" style={{ maxWidth: '400px' }}>
        {/* Only show Card on desktop */}
        <div className="d-none d-md-block">
          <Card className="p-4 shadow-lg">
            <Card.Body>
              <h2 className="text-center mb-4">Login</h2>
              <Form onSubmit={handleLogin}>
                {/* Email Input */}
                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
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
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                {/* Buttons */}
                <div className="d-grid gap-2">
                  <Button variant="success" type="submit">
                    Log In
                  </Button>
                  <Button variant="dark" type="button" onClick={handleCreateAccount}>
                    Create Account
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>

        {/* Mobile version (no card) */}
        <div className="d-block d-md-none">
          <h2 className="text-center mt-4 mb-4">Login</h2>
          <Form onSubmit={handleLogin}>
            {/* Email Input */}
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
                // Get shaded background for text fields
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
                value={formData.password}
                onChange={handleChange}
                required
                // Get shaded background for text fields
                style={{ backgroundColor: '#f7f7f7', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}
              />
            </Form.Group>

            {/* Buttons */}
            <div className="d-grid gap-2">
              <Button variant="success" type="submit">
                Log In
              </Button>
              <Button variant="dark" type="button" onClick={handleCreateAccount}>
                Create Account
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Container>
  );
}

export default Login;
