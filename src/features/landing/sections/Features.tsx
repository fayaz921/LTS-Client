import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const features = [
    {
        icon: '⚖',
        title: 'Smart Case Management',
        description: 'Create and track all litigation cases with full details — court, DAG, petitioners, status and complete hearing history.',
        color: '#2563EB',
    },
    {
        icon: '🔔',
        title: 'Automated Hearing Alerts',
        description: 'Get email alerts 3 days before every hearing automatically. System runs every morning at 8 AM so you never miss court.',
        color: '#DC2626',
    },
    {
        icon: '📄',
        title: 'Document Management',
        description: 'Attach PDFs, images and documents to cases securely. Access and download them from anywhere, anytime.',
        color: '#16A34A',
    },
    {
        icon: '👥',
        title: 'Petitioner Tracking',
        description: 'Manage multiple petitioners per case with full contact details. One petitioner can be linked to many cases.',
        color: '#D4A843',
    },
    {
        icon: '📊',
        title: 'Reports & Analytics',
        description: 'Department-wise and court-wise case reports. See your firm\'s full performance and case status at a glance.',
        color: '#7C3AED',
    },
    {
        icon: '🏛',
        title: 'Multi-Firm SaaS',
        description: 'Each law firm gets their own secure isolated workspace. Your data is completely private and never shared.',
        color: '#0369A1',
    },
]

const FeatureCard = ({ feature, index }: { feature: typeof features[0], index: number }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-50px' })

    return (
        <motion.div
            ref={ref}
            className="lts-features__card"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}
        >
            <div
                className="lts-features__card-icon"
                style={{ backgroundColor: `${feature.color}15`, color: feature.color }}
            >
                {feature.icon}
            </div>
            <h3 className="lts-features__card-title">{feature.title}</h3>
            <p className="lts-features__card-desc">{feature.description}</p>
            <div className="lts-features__card-line" style={{ backgroundColor: feature.color }} />
        </motion.div>
    )
}

const Features = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-80px' })

    return (
        <section id="features" className="lts-features">
            <div className="lts-features__container">

                {/* Section Header */}
                <motion.div
                    ref={ref}
                    className="lts-features__header"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <span className="lts-features__label">Why Choose LTS</span>
                    <h2 className="lts-features__title">
                        Everything Your Law Firm Needs
                    </h2>
                    <p className="lts-features__subtitle">
                        Built specifically for Pakistani law firms and legal departments.
                        One platform to manage your entire litigation process.
                    </p>
                </motion.div>

                {/* Cards Grid */}
                <div className="lts-features__grid">
                    {features.map((feature, i) => (
                        <FeatureCard key={feature.title} feature={feature} index={i} />
                    ))}
                </div>

            </div>
        </section>
    )
}

export default Features