import React, { useEffect, useRef, useState } from 'react'
import image from '@assets/images/features-icon-1.png'
import { Link } from 'react-router-dom'

const LandingAboutComponent = () => {
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
        }
    }, [])

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
    ]

    const [currentSlide, setCurrentSlide] = useState(0)

    const [slide, setSlide] = useState(false)

    const handleLeft = () => {
        setSlide(true)
        timerRef.current = setTimeout(
            () =>
                setCurrentSlide(
                    (prev) => Math.abs(prev - 1) % newsItems.length
                ),
            1000
        )
        timerRef.current = setTimeout(() => setSlide(false), 1000)
    }

    const handleRight = () => {
        setSlide(true)
        timerRef.current = setTimeout(
            () =>
                setCurrentSlide(
                    (prev) => Math.abs(prev - 1) % newsItems.length
                ),
            1000
        )
        timerRef.current = setTimeout(() => setSlide(false), 1000)
    }

    return (
        <>
            <section className="mt-24 flex h-screen flex-row items-center justify-center space-x-4 p-0">
                <CarouselItem
                    item={newsItems[currentSlide]}
                    slide={slide}
                    previous={handleLeft}
                    next={handleRight}
                />
            </section>
        </>
    )
}

const CarouselItem: React.FC<{
    item: { title: string; description: string; date: string }
    slide: boolean
    previous: () => void
    next: () => void
}> = ({ item, slide, previous: left, next: right }) => {
    return (
        <>
            <button
                type="button"
                className="text-7xl font-medium text-white focus:outline-none"
                onClick={left}
            >
                {'<'}
            </button>
            <div
                className={`bg-tan h-fit w-1/3 rounded-2xl p-10 outline drop-shadow-2xl transition-all duration-1000 ease-in-out ${
                    slide ? 'opacity-50' : 'opacity-100'
                }`}
            >
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
            </div>
            <button
                type="button"
                className="bg-inherit text-7xl font-medium text-white focus:outline-none"
                onClick={right}
            >
                {'>'}
            </button>
        </>
    )
}

export default LandingAboutComponent
