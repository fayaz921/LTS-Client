import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useRef } from 'react'
import { useInView } from 'framer-motion'

const Footer = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-50px' })

    return (
        <footer id="contact" className="lts-footer" role="contentinfo">

            {/* CTA Banner */}
            <div className="lts-footer__cta">
                <motion.div
                    ref={ref}
                    className="lts-footer__cta-content"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="lts-footer__cta-title">
                        Your Next Hearing Is Coming. Are You Ready?
                    </h2>
                    <p className="lts-footer__cta-subtitle">
                        Join 500+ Pakistani law firms already using LTS to never miss a court date.
                    </p>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <Link to="/register" className="lts-footer__cta-btn">
                            Start Your Free Trial Today
                        </Link>
                    </motion.div>
                    <p className="lts-footer__cta-note">
                        Free plan available forever · Upgrade anytime · Cancel anytime
                    </p>
                </motion.div>
            </div>

            {/* Main Footer */}
            <div className="lts-footer__main">
                <div className="lts-footer__container">

                    {/* Brand */}
                    <div className="lts-footer__brand">
                        <div className="lts-footer__logo">
                            <div className="lts-footer__logo-icon">⚖</div>
                            <div>
                                <div className="lts-footer__logo-title">LTS</div>
                                <div className="lts-footer__logo-sub">Litigation Tracking System</div>
                            </div>
                        </div>
                        <p className="lts-footer__brand-desc">
                            Pakistan's leading legal case management SaaS platform.
                            Built for advocates, law firms and legal departments.
                        </p>
                        <div className="lts-footer__socials">
                            <a href="https://github.com/fayaz921" target="_blank" rel="noreferrer" aria-label="GitHub">
                                GitHub
                            </a>
                            <a href="https://www.linkedin.com/in/muhammad-fayaz-10b73434b" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                                LinkedIn
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="lts-footer__links-group">
                        <h4 className="lts-footer__links-title">Product</h4>
                        <ul className="lts-footer__links-list">
                            <li><a href="#features">Features</a></li>
                            <li><a href="#pricing">Pricing</a></li>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/register">Register</Link></li>
                        </ul>
                    </div>

                    <div className="lts-footer__links-group">
                        <h4 className="lts-footer__links-title">Courts</h4>
                        <ul className="lts-footer__links-list">
                            <li><a href="#features">Supreme Court</a></li>
                            <li><a href="#features">Lahore High Court</a></li>
                            <li><a href="#features">Sindh High Court</a></li>
                            <li><a href="#features">District Courts</a></li>
                        </ul>
                    </div>

                    <div className="lts-footer__links-group">
                        <h4 className="lts-footer__links-title">Legal</h4>
                        <ul className="lts-footer__links-list">
                            <li><a href="#contact">Privacy Policy</a></li>
                            <li><a href="#contact">Terms of Service</a></li>
                            <li><a href="#contact">Contact Us</a></li>
                            <li><a href="mailto:mfayaz21703@gmail.com">Support</a></li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* Bottom Bar */}
            <div className="lts-footer__bottom">
                <div className="lts-footer__bottom-container">
                    <span>© 2026 LTS — Litigation Tracking System. All Rights Reserved.</span>
                    <span>🇵🇰 Built for Pakistani Legal Professionals</span>
                </div>
            </div>

        </footer>
    )
}

export default Footer