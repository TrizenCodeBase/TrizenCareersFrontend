
import { Button } from "@/components/ui/button";
import Navbar from "./Navbar";

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center justify-center bg-brand-primary text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      
      {/* Navbar */}
      <Navbar />
      
      {/* Subtle geometric pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border border-white transform rotate-45"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 border border-white rounded-full"></div>
        <div className="absolute top-1/2 right-20 w-16 h-16 border border-white"></div>
      </div>
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-fade-in leading-tight font-inter">
          Innovate. Collaborate. Transform the World With Us.
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl mb-8 text-white/90 animate-fade-in delay-200 px-2 font-inter font-medium">
          Join a purpose-driven team shaping a smarter, more connected future.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 sm:space-y-0 sm:space-x-6 justify-center animate-fade-in delay-400 px-4">
          <Button 
            size="lg" 
            className="bg-white text-brand-primary hover:bg-gray-50 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 border-0 font-inter w-full sm:w-auto"
          >
            Explore Careers
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand-primary px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 font-inter w-full sm:w-auto"
          >
            View Internships
          </Button>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/70 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
