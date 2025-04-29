/*
* Author: Evan Kuczynski 3/18/25
* This page is the react code for the contact us page
* This page is mainly for contacting the users of MassTrip
* */

import {useState, useEffect} from 'react';
import {Container, Row, Col, Form, Button, Alert} from 'react-bootstrap';
// import icons
import {FaFacebook, FaInstagram} from 'react-icons/fa';
import '../styles/Contact_Us.css'; // Import the specific CSS file for ContactUs


function ContactUs() {
    // create a state for form input fields and form submission status
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    // State for form validation errors
    const [formErrors, setFormErrors] = useState({
        name: '',
        email: '',
        message: ''
    });

    // Track if fields have been touched
    const [touched, setTouched] = useState({
        name: false,
        email: false,
        message: false
    });

    // State for form submission success
    const [formSubmitted, setFormSubmitted] = useState(false);

    // Validate form fields whenever they change
    useEffect(() => {
        if (touched.name) {
            validateField('name', formData.name);
        }
        
        if (touched.email) {
            validateField('email', formData.email);
        }
        
        if (touched.message) {
            validateField('message', formData.message);
        }
    }, [formData, touched]);

    // Validate individual field
    const validateField = (field, value) => {
        let error = '';
        
        switch(field) {
            case 'name':
                if (!value.trim()) {
                    error = 'Name is required';
                }
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
                
            default:
                break;
        }
        
        setFormErrors(prev => ({
            ...prev,
            [field]: error
        }));
        
        return !error;
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        
        setFormData({
            ...formData,
            [name]: value
        });
    };
    
    const handleBlur = (e) => {
        const { name } = e.target;
        
        setTouched({
            ...touched,
            [name]: true
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        // prevents default html
        e.preventDefault();
        
        // Mark all fields as touched
        setTouched({
            name: true,
            email: true,
            message: true
        });
        
        // Validate all fields
        const nameValid = validateField('name', formData.name);
        const emailValid = validateField('email', formData.email);
        const messageValid = validateField('message', formData.message);
        
        // If all fields are valid, submit the form
        if (nameValid && emailValid && messageValid) {
            // Show success message
            setFormSubmitted(true);
            
            // Reset form and touched state
            setFormData({
                name: '',
                email: '',
                message: ''
            });
            
            setTouched({
                name: false,
                email: false,
                message: false
            });
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                setFormSubmitted(false);
            }, 5000);
        }
    };

    return (
        // this is the classic container we include
        <Container className="mt-5">
            <Row>
                {/*socials and misc text*/}
                <Col md={6} className="d-flex flex-column justify-content-lg-start align-items-start">
                    <h3>Get in Touch</h3>
                    <p></p>
                    <p>Have questions, feedback, or suggestions? We'd love to hear from you!</p>
                    <p>Let us know how we can improve your road trip experience.</p>
                    <p>Please check out the FAQ link below before you add any questions. </p>
                    <p></p>
                    <a href="/faq">Common FAQs</a>
                    <p></p>

                    <p>Follow us on social media for updates and more information.</p>
                    <p></p>
                    <div className="mb-3">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="mx-2">
                            <FaFacebook size={30}/>
                        </a>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="mx-2">
                            <FaInstagram size={30}/>
                        </a>
                    </div>
                </Col>

                {/* Right Column (Form) */}
                <Col md={5}>
                    {formSubmitted && (
                        <Alert variant="success" className="mb-3">
                            Thank you for contacting us! We will get back to you soon.
                        </Alert>
                    )}
                    
                    <Form noValidate onSubmit={handleSubmit} className="d-flex flex-column justify-content-end">
                        <Form.Group className="mb-3 position-relative">
                            <Form.Control
                                type="text"
                                placeholder="Enter your name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.name && !!formErrors.name}
                                className="w-100"
                            />
                            <div className="error-message">
                                {touched.name && formErrors.name}
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3 position-relative">
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.email && !!formErrors.email}
                                className="w-100 custom-background"
                            />
                            <div className="error-message">
                                {touched.email && formErrors.email}
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3 position-relative">
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Write your message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.message && !!formErrors.message}
                                className="w-100"
                            />
                            <div className="error-message">
                                {touched.message && formErrors.message}
                            </div>
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">Submit</Button>
                    </Form>
                </Col>
            </Row>

            {/*this footer shows the masstrip copyright and the name of the page*/}
            <footer className="mt-5 bg-white text-dark py-3">
                <Row>
                    {/* Left most column just for holding the space but nothing should be inside */}
                    <Col xs={4} className="d-flex justify-content-start"></Col>

                    {/* Middle Column just says the name of the current page (in this case "contact us") */}
                    <Col xs={4} className="text-center"><h4>Contact Us</h4></Col>

                    {/* Right Column (Copyright info) */}
                    <Col xs={4} className="d-flex justify-content-end">
                        <div>
                            <p>&copy; {new Date().getFullYear()} MassTrip</p>
                        </div>
                    </Col>
                </Row>
            </footer>
        </Container>
    );
}

export default ContactUs;