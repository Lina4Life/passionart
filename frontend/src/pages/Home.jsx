
import React from 'react';
import Navbar from '../components/common/Navbar.jsx';
import FooterLinks from '../components/common/FooterLinks.jsx';
import HeroSection from '../components/hero/HeroSection.jsx';
import FeaturedArtworks from '../components/featured/FeaturedArtworks.jsx';
import FeaturedExhibitions from '../components/featured/FeaturedExhibitions.jsx';
import NewsletterSignup from '../components/newsletter/NewsletterSignup.jsx';
import HowItWorks from '../components/highlights/HowItWorks.jsx';
import Testimonials from '../components/highlights/Testimonials.jsx';

const Home = () => (
	<>
		<Navbar />
		<HeroSection />
		<FeaturedArtworks />
		<FeaturedExhibitions />
		<HowItWorks />
		<Testimonials />
		<NewsletterSignup />
		<FooterLinks />
	</>
);

export default Home;
