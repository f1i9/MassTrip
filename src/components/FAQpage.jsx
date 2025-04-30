import { useState } from 'react';
import { Container, Accordion, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

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

    return (
        <>
            {/* Desktop version with shadow */}
            <div className="d-none d-md-block">
                <Container className="mt-4 px-3" style={{
                    boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
                    borderRadius: '0.5rem',
                    backgroundColor: 'white',
                    padding: '1.5rem'
                }}>
                    <h1 className="text-center mb-4 fs-3">Frequently Asked Questions</h1>

                    <Accordion className="mb-5" defaultActiveKey="0">
                        {faqData.map((faq, index) => (
                            <Accordion.Item key={index} eventKey={String(index)} className="mb-3 border rounded-3">
                                <Accordion.Header className="py-2">
                                    {faq.question}
                                </Accordion.Header>
                                <Accordion.Body className="py-3">
                                    {faq.answer}
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>

                    <footer className="mt-5 bg-white text-dark py-3">
                        <Row className="align-items-center">
                            <Col xs={12} md={4} className="d-flex justify-content-center justify-content-md-start mb-3 mb-md-0">
                                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="me-3" style={{ color: "#3b5998" }}>
                                    <FaFacebook size={24}/>
                                </a>
                                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "#e1306c" }}>
                                    <FaInstagram size={24}/>
                                </a>
                            </Col>
                            <Col xs={12} md={4} className="text-center mb-3 mb-md-0">
                                <h4 className="m-0">FAQs</h4>
                            </Col>
                        </Row>
                    </footer>
                </Container>
            </div>

            {/* Mobile version without shadow */}
            <div className="d-block d-md-none">
                <Container className="mt-4 px-3">
                    <h1 className="text-center mb-4 fs-3">Frequently Asked Questions</h1>

                    <Accordion className="mb-5" defaultActiveKey="0">
                        {faqData.map((faq, index) => (
                            <Accordion.Item key={index} eventKey={String(index)} className="mb-3 border rounded-3">
                                <Accordion.Header className="py-2">
                                    {faq.question}
                                </Accordion.Header>
                                <Accordion.Body className="py-3">
                                    {faq.answer}
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>

                    <footer className="mt-5 bg-white text-dark py-3">
                        <Row className="align-items-center">
                            <Col xs={12} md={4} className="d-flex justify-content-center justify-content-md-start mb-3 mb-md-0">
                                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="me-3" style={{ color: "#3b5998" }}>
                                    <FaFacebook size={24}/>
                                </a>
                                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "#e1306c" }}>
                                    <FaInstagram size={24}/>
                                </a>
                            </Col>
                            <Col xs={12} md={4} className="text-center mb-3 mb-md-0">
                                <h4 className="m-0">FAQs</h4>
                            </Col>
                        </Row>
                    </footer>
                </Container>
            </div>
        </>
    );
}

export default FAQ;