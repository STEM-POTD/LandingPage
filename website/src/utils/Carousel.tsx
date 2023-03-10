import React, { useState } from 'react'
import { useRef, useEffect } from 'react'

export const Carousel: React.FC<{
    children: React.ReactNode[]
    className: string
}> = ({ children, className }) => {
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
        }
    }, [])

    const [currentSlide, setCurrentSlide] = useState(0)

    const [slide, setSlide] = useState(false)

    const handleLeft = () => {
        setSlide(true)
        timerRef.current = setTimeout(
            () =>
                setCurrentSlide((prev) => Math.abs(prev - 1) % children.length),
            1000
        )
        timerRef.current = setTimeout(() => setSlide(false), 1000)
    }

    const handleRight = () => {
        setSlide(true)
        timerRef.current = setTimeout(
            () =>
                setCurrentSlide((prev) => Math.abs(prev + 1) % children.length),
            1000
        )
        timerRef.current = setTimeout(() => setSlide(false), 1000)
    }

    return (
        <>
            <button
                type="button"
                className="text-7xl font-medium text-white focus:outline-none"
                onClick={handleLeft}
            >
                {'<'}
            </button>
            <div
                className={`${className} transition-all duration-1000 ease-in-out ${
                    slide ? 'opacity-50' : 'opacity-100'
                }`}
            >
                {children[currentSlide]}
            </div>
            <button
                type="button"
                className="bg-inherit text-7xl font-medium text-white focus:outline-none"
                onClick={handleRight}
            >
                {'>'}
            </button>
        </>
    )
}
