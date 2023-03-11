import React, { useEffect, useRef, useState } from 'react'
import image from '/images/features-icon-1.png'
import { Link } from 'react-router-dom'
import { Carousel } from 'utils/Carousel'

const LandingNewsComponent = () => {
    const newsItems = [
        {
            title: 'STEM POTD',
            date: '11/12/22',
            description:
                'STEM POTD is proud to announce our first math competition! Expect cash-prizes, challenging problems, and a great time.',
        },
        {
            title: 'STEM POTD 2',
            date: '11/12/22',
            description:
                'STEM POTD is proud to announce our first math competition! Expect cash-prizes, challenging problems, and a great time.',
        },
        {
            title: 'STEM POTD 3',
            date: '11/12/22',
            description:
                'STEM POTD is proud to announce our first math competition! Expect cash-prizes, challenging problems, and a great time.',
        },
    ]

    return (
        <>
            <section className="flex h-screen items-center justify-center p-0">
                <Carousel className="bg-tan h-fit w-1/3 rounded-2xl p-10 drop-shadow-2xl">
                    {newsItems.map((item, index) => (
                        <CarouselItem key={index} item={item} />
                    ))}
                </Carousel>
            </section>
        </>
    )
}

const CarouselItem: React.FC<{
    item: { title: string; description: string; date: string }
}> = ({ item }) => {
    return (
        <>
            <img src={image} alt="" />
            <div className="my-2 py-4">
                <h4 className=" text-2xl font-black">{item.title}</h4>
                <p>{item.description}</p>
                <p>Takes place: {item.date}</p>
            </div>
            <Link
                to="/news"
                className="bg-nav-yellow rounded-full py-3 px-4 font-bold hover:bg-white hover:text-slate-800"
                replace
            >
                Read More
            </Link>
        </>
    )
}

export default LandingNewsComponent
