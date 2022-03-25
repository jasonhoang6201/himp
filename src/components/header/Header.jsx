import React, { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

import './Header.scss'

const headerNavItem = [
    {
        display: 'Home',
        path: '/'
    },
    {
        display: 'Movie',
        path: '/movie'
    }, {
        display: 'TV Series',
        path: '/tv'
    },
]

const Header = () => {
    const { pathname } = useLocation()
    const headerRef = useRef()

    const active = headerNavItem.findIndex(item => item.path === pathname)

    useEffect(() => {
        const shrinkHeader = () => {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                headerRef.current.classList.add('shrink')
            } else {
                headerRef.current.classList.remove('shrink')
            }
        }

        window.addEventListener('scroll', shrinkHeader)
        return () => {
            window.removeEventListener('scroll', shrinkHeader)
        }
    })

    return (
        <div ref={headerRef} className="header">
            <div className="header_wrap container">
                <Link to='/' className="header_logo">HIMP</Link>

                <ul className="header_list">
                    {
                        headerNavItem.map((item, index) => (
                            <li key={index} className={`header_item ${active === index ? 'active' : ''}`}>
                                <Link to={item.path}>{item.display}</Link>
                            </li>))
                    }
                </ul>

                <div className="header_login">
                    <button>Sign in</button>
                </div>
            </div>
        </div>
    )
}

export default Header