
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { name: "Research", href: "#" },
    { name: "Consulting", href: "#" },
    { name: "Training", href: "#" },
    { name: "Insights", href: "#" },
    { name: "Careers", href: "/", current: true },
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/profile.png" 
              alt="Trizen Logo" 
              className="h-16 sm:h-20 w-auto filter brightness-0 invert"
            />
            {/* <img 
              src="/lovable-uploads/94622359-d2cd-4c87-aafa-6764c7f0d73d.png" 
              alt="TRIZEN" 
              className="h-6 sm:h-8 w-auto filter brightness-0 invert"
            /> */}
          </div>
          
          {/* Desktop Navigation Items */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-white hover:text-white/80 transition-colors duration-200 relative font-inter font-medium ${
                  item.current ? 'font-semibold' : ''
                }`}
              >
                {item.name}
                {item.current && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white"></div>
                )}
              </a>
            ))}
          </div>
          
          {/* Desktop Login and Signup buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10 hover:text-white font-inter font-medium"
            >
              Login
            </Button>
            <Button 
              variant="outline" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand-primary transition-all duration-300 font-inter font-medium"
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-6 bg-white/5 backdrop-blur-md rounded-lg p-6">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`text-white hover:text-white/80 transition-colors duration-200 relative font-inter ${
                    item.current ? 'font-semibold' : 'font-medium'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                  {item.current && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white"></div>
                  )}
                </a>
              ))}
              <div className="flex flex-col space-y-3 pt-4 border-t border-white/20">
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white/10 hover:text-white justify-start font-inter"
                >
                  Login
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand-primary transition-all duration-300 justify-start font-inter"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
