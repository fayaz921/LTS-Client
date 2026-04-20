import Navbar from '../sections/Navbar'
import Hero from '../sections/Hero'
import Features from '../sections/Features'
import Pricing from '../sections/Pricing'
import Testimonials from '../sections/Testimonials'
import Footer from '../sections/Footer'
import '../styles/landing.css'

const LandingPage = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <Features />
            <Pricing />
            <Testimonials />
            <Footer />
        </>
    )
}

export default LandingPage