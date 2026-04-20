import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header role="banner">
            <nav
                className={`lts-navbar ${scrolled ? 'lts-navbar--scrolled' : ''}`}
                aria-label="Main navigation"
            >
                <div className="lts-navbar__container">

                    {/* Logo */}
                    <Link to="/" className="lts-navbar__logo" aria-label="LTS - Litigation Tracking System Home">
                        <div className="lts-navbar__logo-icon" aria-hidden="true">⚖</div>
                        <div className="lts-navbar__logo-text">
                            <span className="lts-navbar__logo-title">LTS</span>
                            <span className="lts-navbar__logo-subtitle">Litigation Tracking System</span>
                        </div>
                    </Link>

                    {/* Desktop Nav Links */}
                    <ul className="lts-navbar__links" role="list">
                        <li><a href="#features" aria-label="View Features">Features</a></li>
                        <li><a href="#pricing" aria-label="View Pricing">Pricing</a></li>
                        <li><a href="#testimonials" aria-label="View Testimonials">Testimonials</a></li>
                        <li><a href="#contact" aria-label="Contact Us">Contact</a></li>
                    </ul>

                    {/* Action Buttons */}
                    <div className="lts-navbar__actions">
                        <Link
                            to="/login"
                            className="lts-navbar__btn-login"
                            aria-label="Login to your account"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="lts-navbar__btn-register"
                            aria-label="Get started for free"
                        >
                            Get Started Free
                        </Link>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        className="lts-navbar__hamburger"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-menu"
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    >
                        <span className={menuOpen ? 'open' : ''}></span>
                        <span className={menuOpen ? 'open' : ''}></span>
                        <span className={menuOpen ? 'open' : ''}></span>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div
                    id="mobile-menu"
                    className={`lts-navbar__mobile-menu ${menuOpen ? 'lts-navbar__mobile-menu--open' : ''}`}
                    aria-hidden={!menuOpen}
                >
                    <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
                    <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
                    <a href="#testimonials" onClick={() => setMenuOpen(false)}>Testimonials</a>
                    <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
                    <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                    <Link
                        to="/register"
                        className="lts-navbar__mobile-cta"
                        onClick={() => setMenuOpen(false)}
                    >
                        Get Started Free
                    </Link>
                </div>
            </nav>
        </header>
    )
}

export default Navbar