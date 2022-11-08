import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { testimonials } from '../../assets/js/testimonials'
import '@assets/css/owl-carousel.css'
import { Carousel } from 'react-bootstrap'

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
                        <Carousel fade interval={null} indicators={false}>
                            {testimonials.map(
                                (testimonial, index, remaining) => {
                                    return (
                                        <Carousel.Item key={index}>
                                            <Testimonial
                                                testimonial={testimonial}
                                                next={
                                                    index + 1 >
                                                    remaining.length - 1
                                                        ? remaining[0]
                                                        : remaining[index + 1]
                                                }
                                            />
                                        </Carousel.Item>
                                    )
                                }
                            )}
                        </Carousel>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

const Testimonial: React.FC<{
    testimonial: typeof testimonials[number]
    next: typeof testimonials[number]
}> = ({ testimonial, next }) => {
    return (
        <div className="flex flex-row">
            <div className="item service-item">
                <div className="author">
                    <i>
                        <img
                            src={testimonial.image}
                            alt={testimonial.altText}
                        />
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
            <div className="item service-item">
                <div className="author">
                    <i>
                        <img src={next.image} alt={next.altText} />
                    </i>
                </div>
                <div className="testimonial-content">
                    <ul className="stars">
                        {Array.from(Array(next.stars).keys()).map((star) => {
                            return (
                                <li key={star}>
                                    <i className="fa fa-star" />
                                </li>
                            )
                        })}
                    </ul>
                    <h4>{next.name}</h4>
                    <p>{next.description}</p>
                    <span>{next.title}</span>
                </div>
            </div>
        </div>
    )
}

export default LandingTestimonialComponent
