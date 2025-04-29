import {useState, useEffect} from 'react';
import {Container, Row, Col, Form, Button, Alert} from 'react-bootstrap';
import {FaFacebook, FaInstagram} from 'react-icons/fa';
import '../styles/Contact_Us.css';

function ContactUs() {
    // Form data and validation states
    const [formData, setFormData] = useState({name: '', email: '', message: ''});
    const [formErrors, setFormErrors] = useState({name: '', email: '', message: ''});
    const [touched, setTouched] = useState({name: false, email: false, message: false});
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Handle window resize for responsive design
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Validate fields when they change
    useEffect(() => {
        for (const field in touched) {
            if (touched[field]) validateField(field, formData[field]);
        }
    }, [formData, touched]);

    // Field validation logic
    const validateField = (field, value) => {
        let error = '';
        
        switch(field) {
            case 'name':
                error = !value.trim() ? 'Name is required' : '';
                break;
                
            case 'email':
                if (!value.trim()) {
                    error = 'Email is required';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = 'Please enter a valid email address';
                }
                break;
                
            case 'message':
                if (!value.trim()) {
                    error = 'Message is required';
                } else if (value.trim().length < 10) {
                    error = 'Message should be at least 10 characters';
                }
                break;
        }
        
        setFormErrors(prev => ({...prev, [field]: error}));
        return !error;
    };

    // Handle input changes
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };
    
    // Handle field blur
    const handleBlur = (e) => {
        const {name} = e.target;
        setTouched(prev => ({...prev, [name]: true}));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Mark all fields as touched
        setTouched({name: true, email: true, message: true});
        
        // Validate all fields
        const isValid = ['name', 'email', 'message'].every(
            field => validateField(field, formData[field])
        );
        
        if (isValid) {
            setFormSubmitted(true);
            setFormData({name: '', email: '', message: ''});
            setTouched({name: false, email: false, message: false});
            
            setTimeout(() => setFormSubmitted(false), 5000);
        }
    };

    // Common styles
    const styles = {
        input: {
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #e1e1e1',
            backgroundColor: '#f9f9f9',
            width: '100%',
            marginBottom: '6px'
        },
        error: {
            color: '#dc3545',
            fontSize: '0.875rem',
            marginBottom: '16px',
            display: 'block'
        },
        footer: {
            marginTop: isMobile ? '20px' : '40px',
            borderTop: '1px solid #f0f0f0',
            paddingTop: isMobile ? '15px' : '25px'
        },
        alert: {
            marginBottom: '25px',
            borderRadius: '8px'
        },
        submitBtn: {
            padding: '12px',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: '500',
            width: '100%'
        }
    };

    // Render the contact form
    const renderForm = () => (
        <Form noValidate onSubmit={handleSubmit}>
            {formSubmitted && (
                <Alert variant="success" style={styles.alert}>
                    Thank you for contacting us! We will get back to you soon.
                </Alert>
            )}
            
            <Form.Group className="mb-3">
                <Form.Label style={{fontWeight: '500', marginBottom: '8px'}}>Your Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={styles.input}
                />
                {touched.name && formErrors.name && (
                    <span style={styles.error}>{formErrors.name}</span>
                )}
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label style={{fontWeight: '500', marginBottom: '8px'}}>Your Email</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={styles.input}
                />
                {touched.email && formErrors.email && (
                    <span style={styles.error}>{formErrors.email}</span>
                )}
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label style={{fontWeight: '500', marginBottom: '8px'}}>Your Message</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Write your message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={styles.input}
                />
                {touched.message && formErrors.message && (
                    <span style={styles.error}>{formErrors.message}</span>
                )}
            </Form.Group>

            <Button variant="primary" type="submit" style={styles.submitBtn}>
                Submit
            </Button>
        </Form>
    );

    // Render contact info section
    const renderContactInfo = () => (
        <>
            <h3 className="mb-3">Get in Touch</h3>
            <p className="mb-3">Have questions, feedback, or suggestions? We'd love to hear from you!</p>
            <p className="mb-3">Let us know how we can improve your road trip experience.</p>
            <p className="mb-3">Please check out the FAQ link below before you add any questions.</p>
            <a href="/faq" className="mb-3 d-inline-block" style={{fontSize: '1.1rem', textDecoration: 'none'}}>
                Common FAQs
            </a>
            <p className="mb-3">Follow us on social media for updates and more information.</p>
        </>
    );

    // Render footer with social media links
    const renderFooter = () => (
        <footer style={styles.footer}>
            <Row className="align-items-center">
                <Col xs={4} className="d-flex justify-content-start">
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="me-3" style={{color: "#3b5998"}}>
                        <FaFacebook size={isMobile ? 24 : 28}/>
                    </a>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" style={{color: "#e1306c"}}>
                        <FaInstagram size={isMobile ? 24 : 28}/>
                    </a>
                </Col>
                <Col xs={4} className="text-center">
                    <h5 className="m-0">Contact Us</h5>
                </Col>
                <Col xs={4}></Col>
            </Row>
        </footer>
    );

    return (
        <Container fluid className="px-0">
            {/* Desktop version with shadow box */}
            <div className="d-none d-md-block">
                <div style={{
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    backgroundColor: 'white',
                    padding: '40px',
                    margin: '40px auto',
                    maxWidth: '1200px'
                }}>
                    <Row className="align-items-start">
                        <Col md={6} className="pe-md-5 mb-4 mb-md-0">
                            {renderContactInfo()}
                        </Col>
                        <Col md={6}>
                            {renderForm()}
                        </Col>
                    </Row>
                    {renderFooter()}
                </div>
            </div>

            {/* Mobile version without shadow box */}
            <div className="d-block d-md-none">
                <Container className="py-3">
                    <Row className="align-items-start">
                        <Col xs={12} className="mb-4">
                            {renderContactInfo()}
                        </Col>
                        <Col xs={12}>
                            {renderForm()}
                        </Col>
                    </Row>
                    {renderFooter()}
                </Container>
            </div>
        </Container>
    );
}

export default ContactUs;