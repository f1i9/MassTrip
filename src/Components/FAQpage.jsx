/*
* Author: Evan Kuczynski 3/18/25
* This page is the react code for the FAQ page
* This page is mainly for answering questions about MassTrip
* */


import { useState } from 'react';
import { Container, Accordion, Card, Button, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaInstagram } from 'react-icons/fa'; // Importing the icons

function FAQ() {
    // FAQ questions and answers
    const faqData = [
        {
            question: 'Is there a paid subscription for MassTrip?',
            answer: 'No, there is none!'
        },
        {
            question: 'How to delete old itineraries?',
            answer: 'There is currently no option to delete.'
        },
        {
            question: 'How to support MassTrip?',
            answer: 'Use our website!'
        },
        {
            question: 'How to change user picture? ',
            answer: 'You change your google account picture.'
        }
    ];

    // State for active accordion item
    const [activeKey, setActiveKey] = useState('0');

    // Handle selection of accordion item
    const handleSelect = (key) => {
        setActiveKey(key);
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Frequently Asked Questions</h1>
            {/*this is the documentation*/}
            {/*https://react-bootstrap.netlify.app/docs/components/accordion*/}
            <Accordion activeKey={activeKey} onSelect={handleSelect}>
                {faqData.map((faq, index) => (
                    <Card key={index}>
                        <Accordion.Header>
                            <Button variant="link" eventKey={String(index)}>
                                {faq.question}
                            </Button>
                        </Accordion.Header>
                        <Accordion.Body eventKey={String(index)}>
                            {faq.answer}
                        </Accordion.Body>
                    </Card>
                ))}
            </Accordion>

            {/* Footer Section */}
            <footer className="mt-5 bg-white text-dark py-3">
                {/*documetation for the row in react*/}
                {/*https://react-bootstrap.netlify.app/docs/layout/grid/*/}
                <Row>
                    {/* Left most column for spacing */}
                    <Col xs={4} className="d-flex justify-content-start">
                        <div className="ml-3">
                            {/* Social Media Links */}
                            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"
                               className="mx-2">
                                <FaFacebook size={24}/>
                            </a>
                            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"
                               className="mx-2">
                                <FaInstagram size={24}/>
                            </a>
                        </div>
                    </Col>

                    {/* Middle Column for Contact Us */}
                    <Col xs={4} className="text-center">
                        <h4>Contact Us</h4>
                    </Col>

                    {/* Right Column for Copyright and Social Media */}
                    <Col xs={4} className="d-flex justify-content-end align-items-center">
                        <div>
                            <p>&copy; {new Date().getFullYear()} MassTrip</p>
                        </div>
                    </Col>
                </Row>
            </footer>
        </Container>
    );
}

export default FAQ;
