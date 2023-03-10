import React from 'react'

const LandingWelcomeComponent: React.FC = () => {
    return (
        <div
            className="bg-banner-image flex h-screen w-screen flex-col bg-contain bg-right-top bg-no-repeat"
            id="welcome"
        >
            <div className="ml-4 mt-[20%] w-1/3">
                <h1 className="mb-8  text-5xl font-black">STEM POTD</h1>
                <p className="mb-10 text-lg">
                    An organization dedicated to writing, teaching, and
                    challenging the next generation of curious learners.
                </p>
                <a
                    href="#about"
                    className="bg-nav-yellow rounded-full py-3 px-4 font-bold hover:bg-white hover:text-slate-800"
                >
                    <button type="button">Latest News</button>
                </a>
            </div>
        </div>
    )
}

export default LandingWelcomeComponent
