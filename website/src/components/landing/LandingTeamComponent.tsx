import React from 'react'

import { testimonials } from './testimonials'

import Carousel from 'utils/Carousel'

const LandingTeamComponent: React.FC = () => {
    return (
        <section className="mt-24 h-screen" id="testimonials">
            <div className="center-heading">
                <h2>
                    Meet the <em>Team</em>
                </h2>
                <p>Our staff</p>
            </div>
            <Carousel className="bg-tan h-fit w-1/2 rounded-2xl bg-gradient-to-br p-10 drop-shadow-2xl">
                {testimonials.map((testimonial, index) => (
                    <Testimonial key={index} testimonial={testimonial} />
                ))}
            </Carousel>
        </section>
    )
}

const Testimonial: React.FC<{
    testimonial: (typeof testimonials)[number]
}> = ({ testimonial }) => {
    return (
        <>
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2">
                <i>
                    <img src={testimonial.image} alt={testimonial.altText} />
                </i>
            </div>
            <div className="testimonial-content">
                <ul className="flex flex-row items-center justify-center text-white">
                    {Array.from(Array(testimonial.stars).keys()).map((star) => {
                        return (
                            <li key={star}>
                                <i className="fa fa-star" />
                            </li>
                        )
                    })}
                </ul>
                <h4>{testimonial.name}</h4>
                <p>{testimonial.description}</p>
                <span>{testimonial.title}</span>
            </div>
        </>
    )
}

export default LandingTeamComponent
