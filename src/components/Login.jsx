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
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4 shadow-lg" style={{ width: '350px' }}>
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
    </Container>
  );
}

export default Login;
