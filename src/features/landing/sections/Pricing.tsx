import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'

const plans = [
    {
        name: 'Free',
        price: '0',
        period: 'forever',
        description: 'Perfect for small firms getting started',
        color: '#64748B',
        features: [
            '2 Users maximum',
            'Basic case management',
            'Email hearing alerts',
            '1GB document storage',
            'Court & department tracking',
        ],
        button: 'Get Started Free',
        buttonLink: '/register',
        highlighted: false,
    },
    {
        name: 'Basic',
        price: '2,999',
        period: 'per month',
        description: 'For growing law firms',
        color: '#2563EB',
        features: [
            '5 Users maximum',
            'Everything in Free',
            'Document management',
            'Court & department reports',
            'Priority email support',
        ],
        button: 'Start Basic',
        buttonLink: '/register',
        highlighted: false,
    },
    {
        name: 'Pro',
        price: '7,999',
        period: 'per month',
        description: 'Most popular for established firms',
        color: '#FFFFFF',
        features: [
            '20 Users maximum',
            'Everything in Basic',
            'Advanced analytics',
            'Bulk document upload',
            'Dedicated support',
            'API access',
        ],
        button: 'Start Pro',
        buttonLink: '/register',
        highlighted: true,
        badge: 'Most Popular',
    },
    {
        name: 'Enterprise',
        price: '19,999',
        period: 'per month',
        description: 'For large firms and ministries',
        color: '#D4A843',
        features: [
            '100 Users maximum',
            'Everything in Pro',
            'Custom integrations',
            'SLA guarantee',
            'Onboarding training',
            'Custom reports',
        ],
        button: 'Contact Sales',
        buttonLink: '/contact',
        highlighted: false,
        dark: true,
    },
]

const Pricing = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-80px' })

    return (
        <section id="pricing" className="lts-pricing">
            <div className="lts-pricing__container">

                {/* Header */}
                <motion.div
                    ref={ref}
                    className="lts-pricing__header"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <span className="lts-pricing__label">Pricing Plans</span>
                    <h2 className="lts-pricing__title">Simple, Transparent Pricing</h2>
                    <p className="lts-pricing__subtitle">
                        Start free. Upgrade when your firm grows. Cancel anytime.
                    </p>
                </motion.div>

                {/* Cards */}
                <div className="lts-pricing__grid">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            className={`lts-pricing__card ${plan.highlighted ? 'lts-pricing__card--highlighted' : ''} ${plan.dark ? 'lts-pricing__card--dark' : ''}`}
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            whileHover={{ y: -8, transition: { duration: 0.25 } }}
                        >
                            {/* Badge */}
                            {plan.badge && (
                                <div className="lts-pricing__badge">{plan.badge}</div>
                            )}

                            {/* Plan Name */}
                            <div className="lts-pricing__plan-name">{plan.name}</div>
                            <p className="lts-pricing__plan-desc">{plan.description}</p>

                            {/* Price */}
                            <div className="lts-pricing__price">
                                <span className="lts-pricing__currency">PKR</span>
                                <span className="lts-pricing__amount">{plan.price}</span>
                            </div>
                            <div className="lts-pricing__period">/ {plan.period}</div>

                            <div className="lts-pricing__divider" />

                            {/* Features */}
                            <ul className="lts-pricing__features">
                                {plan.features.map((f) => (
                                    <li key={f} className="lts-pricing__feature-item">
                                        <span className="lts-pricing__check">✓</span>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            {/* Button */}
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <Link
                                    to={plan.buttonLink}
                                    className={`lts-pricing__btn ${plan.highlighted ? 'lts-pricing__btn--white' : plan.dark ? 'lts-pricing__btn--gold' : 'lts-pricing__btn--default'}`}
                                >
                                    {plan.button}
                                </Link>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Pricing