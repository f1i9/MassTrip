/*
* Author: Evan Kuczynski 3/18/25
* This page is the react code for the contact us page
* This page is mainly for contacting the users of MassTrip
* */

import {useState} from 'react';
// import { Container, Form, Button, Alert } from 'react-bootstrap';
import {Container, Row, Col, Form, Button, Alert} from 'react-bootstrap';
// import icons
import {FaFacebook, FaInstagram} from 'react-icons/fa';
import '../Styles/ContactUs.css'; // Import the specific CSS file for ContactUs


function ContactUs() {
    // create a state for form input fields and form submission status
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    // these are the allerts that show when the inputs are incorrect or successful
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('success');


    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        // prevents default html
        e.preventDefault();


        // if the name, email, or message are not filled out in the contact us fields
        // then we are going to set a alert
        if (!formData.name || !formData.email || !formData.message) {
            setAlertMessage('Please fill out all fields.');
            setAlertVariant('danger');
            setShowAlert(true);
            return;
        }

        // alerts if the message is successful
        setAlertMessage('Thank you for contacting us! We will get back to you soon.');
        setAlertVariant('success');
        setShowAlert(true);

        // clear the fields for the forms
        setFormData({
            name: '',
            email: '',
            message: ''
        });
    };

    return (
        // this is the classic container we include
        <Container className="mt-5">

            {showAlert && (
                <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
                    {alertMessage}
                </Alert>
            )}
            {/**/}
            <Row>
                {/*socials and misc text*/}
                <Col md={6} className="d-flex flex-column justify-content-lg-start align-items-start">
                    <h3>Get in Touch</h3>
                    <p></p>
                    <p>Have questions, feedback, or suggestions? We’d love to hear from you!</p>
                    <p>Let us know how we can improve your road trip experience.</p>
                    <p>Please check out the FAQ link below before you add any questions. </p>
                    <p></p>
                    <a href="/faq" >Common FAQs</a>
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
                    {/*https://react-bootstrap.netlify.app/docs/forms/form-control/*/}
                    <Form onSubmit={handleSubmit} className="d-flex flex-column justify-content-end">
                        <Form.Group controlId="formName" className="mb-3">
                            {/*<Form.Label>Name</Form.Label>*/}
                            <Form.Control
                                type="text"
                                placeholder="Enter your name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-100"  // Ensures the input takes up the full width of the column
                            />
                        </Form.Group>

                        {/* Form for email */}
                        <Form.Group controlId="formEmail" className="mb-3">
                            {/*<Form.Label>Email address</Form.Label>*/}
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-100 custom-background"
                            />
                        </Form.Group>

                        <Form.Group controlId="formMessage" className="mb-3">
                            {/*<Form.Label>Message</Form.Label>*/}
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
