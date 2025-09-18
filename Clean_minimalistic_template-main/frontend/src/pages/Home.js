/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
import React from 'react';
import Navbar from '../components/common/Navbar';
import FooterLinks from '../components/common/FooterLinks';
import HeroSection from '../components/hero/HeroSection';
import FeaturedArtworks from '../components/featured/FeaturedArtworks';
import FeaturedExhibitions from '../components/featured/FeaturedExhibitions';
import NewsletterSignup from '../components/newsletter/NewsletterSignup';
import HowItWorks from '../components/highlights/HowItWorks';
import Testimonials from '../components/highlights/Testimonials';

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
