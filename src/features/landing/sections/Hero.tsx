import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import lawBackground from '../../../assets/lawbackground.png'

const rotatingTexts = [
    'Never Miss A Hearing.',
    'Track Every Case.',
    'Automate Your Alerts.',
    'Manage Your Firm.',
]

const Hero = () => {
    const [currentText, setCurrentText] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentText(prev => (prev + 1) % rotatingTexts.length)
        }, 2500)
        return () => clearInterval(interval)
    }, [])

    return (
        <section className="lts-hero" aria-label="Hero Section">

            {/* Background Image */}
            <div className="lts-hero__bg">
                <img src={lawBackground} alt="" aria-hidden="true" />
                <div className="lts-hero__overlay" />
            </div>

            {/* Content */}
            <div className="lts-hero__container">
                <div className="lts-hero__content">

                    {/* Badge */}
                    <motion.div
                        className="lts-hero__badge"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        ⚖ Trusted by 500+ Law Firms Across Pakistan
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        className="lts-hero__headline"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Pakistan's Smartest
                        <br />
                        Legal Case Platform
                    </motion.h1>

                    {/* Rotating Text */}
                    <motion.div
                        className="lts-hero__rotating"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <motion.span
                            key={currentText}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}
                        >
                            {rotatingTexts[currentText]}
                        </motion.span>
                    </motion.div>

                    {/* Subtitle */}
                    <motion.p
                        className="lts-hero__subtitle"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                    >
                        LTS automates case tracking, hearing alerts, and document
                        management for law firms across Pakistan — from Supreme Court
                        to District Courts.
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                        className="lts-hero__buttons"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.9 }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <Link to="/register" className="lts-hero__btn-primary">
                                Start Free Trial
                            </Link>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <a href="#features" className="lts-hero__btn-secondary">
                                See How It Works ↓
                            </a>
                        </motion.div>
                    </motion.div>

                    {/* Trust Text */}
                    <motion.div
                        className="lts-hero__trust"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1.1 }}
                    >
                        <span>✓ Free Plan Available</span>
                        <span>✓ No Credit Card</span>
                        <span>✓ Cancel Anytime</span>
                    </motion.div>
                </div>

                {/* Stats Card */}
                <motion.div
                    className="lts-hero__stats-card"
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                >
                    <div className="lts-hero__stats-title">Live Platform Stats</div>

                    {[
                        { label: 'Active Cases', value: '1,248', color: '#2563EB', icon: '⚖' },
                        { label: 'Upcoming Hearings', value: '12', color: '#DC2626', icon: '📅' },
                        { label: 'Alerts Sent Today', value: '38', color: '#16A34A', icon: '🔔' },
                        { label: 'Law Firms', value: '500+', color: '#D4A843', icon: '🏛' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            className="lts-hero__stat-item"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1 + i * 0.1, duration: 0.4 }}
                        >
                            <span className="lts-hero__stat-icon">{stat.icon}</span>
                            <div className="lts-hero__stat-info">
                                <span className="lts-hero__stat-label">{stat.label}</span>
                                <span className="lts-hero__stat-value" style={{ color: stat.color }}>
                                    {stat.value}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

export default Hero