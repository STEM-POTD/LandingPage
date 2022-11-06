import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { testimonials } from '../../assets/js/testimonials'

const LandingTestimonialComponent: React.FC = () => {
    return (
        <section className="section" id="testimonials">
            <Container>
                <Row>
                    <Col lg={{ span: 8, offset: 2 }}>
                        <div className="center-heading">
                            <h2>
                                Meet the <em>Team</em>
                            </h2>
                            <p>Our staff</p>
                        </div>
                    </Col>
                    <Col
                        lg={10}
                        md={12}
                        sm={12}
                        className="mobile-bottom-fix-big"
                        data-scroll-reveal="enter left move 30px over 0.6s after 0.4s"
                    >
                        <div className="owl-carousel owl-theme">
                            {testimonials.map((testimonial, index) => {
                                return (
                                    <Testimonial
                                        key={index}
                                        testimonial={testimonial}
                                    />
                                )
                            })}
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

const Testimonial: React.FC<{ testimonial: typeof testimonials[number] }> = ({
    testimonial,
}) => {
    return (
        <div className="item service-item">
            <div className="author">
                <i>
                    <img src={testimonial.image} alt={testimonial.altText} />
                </i>
            </div>
            <div className="testimonial-content">
                <ul className="stars">
                    {Array.from(Array(testimonial.stars).keys()).map(
                        (star) => {
                            return (
                                <li key={star}>
                                    <i className="fa fa-star" />
                                </li>
                            )
                        }
                    )}
                </ul>
                <h4>{testimonial.name}</h4>
                <p>{testimonial.description}</p>
                <span>{testimonial.title}</span>
            </div>
        </div>
    )
}

export default LandingTestimonialComponent
