import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const testimonials = [
    {
        quote: 'LTS saved our firm from missing 3 critical Lahore High Court hearings in one month. The automated alerts are a game changer for our entire team.',
        name: 'Advocate Khalid Mahmood',
        title: 'Senior Partner',
        firm: 'Mahmood & Associates, Lahore',
        initials: 'KM',
        color: '#2563EB',
    },
    {
        quote: 'We manage over 200 active cases across 4 courts. LTS gives us complete visibility in one dashboard. Best investment our firm has made.',
        name: 'Barrister Fatima Khan',
        title: 'Principal Advocate',
        firm: 'Karachi High Court Bar',
        initials: 'FK',
        color: '#D4A843',
    },
    {
        quote: 'As a legal department of a government ministry, LTS helped us organize 10 years of case backlog and generate compliance reports effortlessly.',
        name: 'Ahmad Raza',
        title: 'Legal Manager',
        firm: 'Ministry of Commerce, Islamabad',
        initials: 'AR',
        color: '#16A34A',
    },
]

const Testimonials = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-80px' })

    return (
        <section id="testimonials" className="lts-testimonials">
            <div className="lts-testimonials__container">

                {/* Header */}
                <motion.div
                    ref={ref}
                    className="lts-testimonials__header"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <span className="lts-testimonials__label">Testimonials</span>
                    <h2 className="lts-testimonials__title">
                        What Pakistani Legal Professionals Say
                    </h2>
                    <p className="lts-testimonials__subtitle">
                        Trusted by advocates, barristers and legal departments across Pakistan.
                    </p>
                </motion.div>

                {/* Cards */}
                <div className="lts-testimonials__grid">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={t.name}
                            className="lts-testimonials__card"
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                            whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(0,0,0,0.1)' }}
                        >
                            {/* Stars */}
                            <div className="lts-testimonials__stars">
                                {'★★★★★'}
                            </div>

                            {/* Quote */}
                            <div className="lts-testimonials__quote-icon">"</div>
                            <p className="lts-testimonials__quote">{t.quote}</p>

                            {/* Author */}
                            <div className="lts-testimonials__author">
                                <div
                                    className="lts-testimonials__avatar"
                                    style={{ backgroundColor: t.color }}
                                >
                                    {t.initials}
                                </div>
                                <div className="lts-testimonials__author-info">
                                    <div className="lts-testimonials__author-name">{t.name}</div>
                                    <div className="lts-testimonials__author-title">{t.title}</div>
                                    <div className="lts-testimonials__author-firm">{t.firm}</div>
                                </div>
                            </div>

                            {/* Bottom border accent */}
                            <div
                                className="lts-testimonials__accent"
                                style={{ backgroundColor: t.color }}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Stats Strip */}
                <motion.div
                    className="lts-testimonials__stats"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    {[
                        { value: '500+', label: 'Law Firms' },
                        { value: '50,000+', label: 'Cases Managed' },
                        { value: '99.9%', label: 'Uptime' },
                        { value: '3 Days', label: 'Advance Alerts' },
                    ].map((stat) => (
                        <div key={stat.label} className="lts-testimonials__stat">
                            <div className="lts-testimonials__stat-value">{stat.value}</div>
                            <div className="lts-testimonials__stat-label">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>

            </div>
        </section>
    )
}

export default Testimonials