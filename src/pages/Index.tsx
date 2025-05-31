
import { useState } from 'react';
import HeroSection from '../components/HeroSection';
import JobSearch from '../components/JobSearch';
import LifeAtCompany from '../components/LifeAtCompany';
import ApplicationProcess from '../components/ApplicationProcess';
import TalentCommunity from '../components/TalentCommunity';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <JobSearch />
      <LifeAtCompany />
      <ApplicationProcess />
      <TalentCommunity />
      <Footer />
    </div>
  );
};

export default Index;
