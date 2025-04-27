import {useState} from 'react';
import {Container, Row, Col, Form, Button, Alert} from 'react-bootstrap';
import {FaFacebook, FaInstagram} from 'react-icons/fa';
import '../styles/Contact_Us.css'; 


function ContactUs() {
    // create a state for form input fields and form submission status
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    // these are the alerts that show when the inputs are incorrect or successful
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('success');


    // update form data whenever user types in a field
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // handle form submission and validation
    const handleSubmit = (e) => {
        // prevents default html form behavior
        e.preventDefault();

        // check if any fields are empty before submitting
        if (!formData.name || !formData.email || !formData.message) {
            setAlertMessage('Please fill out all fields.');
            setAlertVariant('danger');
            setShowAlert(true);
            return;
        }

        // if everything looks good, show success message
        setAlertMessage('Thank you for contacting us! We will get back to you soon.');
        setAlertVariant('success');
        setShowAlert(true);

        // reset form fields after successful submission
        setFormData({
            name: '',
            email: '',
            message: ''
        });
    };

    return (
        // main container with some top margin
        <Container className="mt-5">

            {/* show alert messages when form is submitted */}
            {showAlert && (
                <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
                    {alertMessage}
                </Alert>
            )}
            
            <Row>
                {/* left column with contact info and faq link */}
                <Col md={6} className="d-flex flex-column justify-content-lg-start align-items-start">
                    <h3>Get in Touch</h3>
                    <p></p>
                    <p>Have questions, feedback, or suggestions? We'd love to hear from you!</p>
                    <p>Let us know how we can improve your road trip experience.</p>
                    
                    {/* faq section with prominent button for easy access */}
                    <div className="faq-link-container my-4 p-3 bg-light rounded">
                        <h5 className="mb-2">Looking for answers?</h5>
                        <p className="mb-2">check our frequently asked questions before submitting a query.</p>
                        <Button 
                            as="a" 
                            href="/faq" 
                            className="fw-bold text-white"
                            style={{
                                backgroundColor: '#009766', // match the navbar green color
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                transition: 'background-color 0.2s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#00704d'} // darker on hover
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#009766'} // back to original
                        >
                            View Frequently Asked Questions
                        </Button>
                    </div>
                    
                    <p>Follow us on social media for updates and more information.</p>
                </Col>

                {/* right column with contact form */}
                <Col md={5}>
                    <Form onSubmit={handleSubmit} className="d-flex flex-column justify-content-end">
                        {/* name input field */}
                        <Form.Group controlId="formName" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Enter your name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-100"  // makes input take full width
                            />
                        </Form.Group>

                        {/* email input field */}
                        <Form.Group controlId="formEmail" className="mb-3">
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-100 custom-background"
                            />
                        </Form.Group>

                        {/* message textarea */}
                        <Form.Group controlId="formMessage" className="mb-3">
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Write your message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                className="w-100"
                            />
                        </Form.Group>

                        {/* submit button */}
                        <Button variant="primary" type="submit" className="w-100">Submit</Button>
                    </Form>
                </Col>
            </Row>

            {/* footer section with social links and copyright */}
            <footer className="mt-5 bg-white text-dark py-3">
                <Row>
                    {/* social media icons on the left */}
                    <Col xs={4} className="d-flex justify-content-start align-items-center">
                        <div>
                            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="me-2">
                                <FaFacebook size={24}/>
                            </a>
                            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="me-2">
                                <FaInstagram size={24}/>
                            </a>
                        </div>
                    </Col>

                    {/* contact us text in the middle */}
                    <Col xs={4} className="text-center">
                        <h4>Contact Us</h4>
                    </Col>

                    {/* copyright info on the right */}
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