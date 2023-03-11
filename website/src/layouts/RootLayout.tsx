import FooterComponent from 'components/FooterComponent'
import HeaderComponent from 'components/HeaderComponent'
import React from 'react'
import { Outlet } from 'react-router'

const RootLayout = () => {
    return (
        <>
            <HeaderComponent />
            <div className="bg-tan font-sans-serif mt-20 h-screen">
                <Outlet />
            </div>
            <FooterComponent />
        </>
    )
}

export default RootLayout
