import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = ['Features', 'Pricing', 'Testimonials', 'Contact']

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header role="banner">
            <motion.nav
                className={`lts-navbar ${scrolled ? 'lts-navbar--scrolled' : ''}`}
                aria-label="Main navigation"
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <div className="lts-navbar__container">

                    {/* Logo */}
                    <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.2 }}>
                        <Link to="/" className="lts-navbar__logo" aria-label="LTS Home">
                            <div className="lts-navbar__logo-icon" aria-hidden="true">⚖</div>
                            <div className="lts-navbar__logo-text">
                                <span className="lts-navbar__logo-title">LTS</span>
                                <span className="lts-navbar__logo-subtitle">Litigation Tracking System</span>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Desktop Nav Links */}
                    <ul className="lts-navbar__links" role="list">
                        {navLinks.map((item, i) => (
                            <motion.li
                                key={item}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 + 0.2, duration: 0.4 }}
                            >
                                <a href={`#${item.toLowerCase()}`} aria-label={`View ${item}`}>
                                    {item}
                                </a>
                            </motion.li>
                        ))}
                    </ul>

                    {/* Action Buttons */}
                    <div className="lts-navbar__actions">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                        >
                            <Link to="/login" className="lts-navbar__btn-login" aria-label="Login">
                                Login
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6, duration: 0.4 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <Link to="/register" className="lts-navbar__btn-register" aria-label="Get started">
                                Get Started Free
                            </Link>
                        </motion.div>
                    </div>

                    {/* Hamburger */}
                    <motion.button
                        className="lts-navbar__hamburger"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-menu"
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        whileTap={{ scale: 0.9 }}
                    >
                        <span className={menuOpen ? 'open' : ''}></span>
                        <span className={menuOpen ? 'open' : ''}></span>
                        <span className={menuOpen ? 'open' : ''}></span>
                    </motion.button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            id="mobile-menu"
                            className="lts-navbar__mobile-menu lts-navbar__mobile-menu--open"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                            {navLinks.map((item) => (
                                <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}>
                                    {item}
                                </a>
                            ))}
                            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                            <Link to="/register" className="lts-navbar__mobile-cta" onClick={() => setMenuOpen(false)}>
                                Get Started Free
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </header>
    )
}

export default Navbar