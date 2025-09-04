
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  
  const navItems = [
    { name: "Research", href: "https://www.trizenventures.com/research" },
    { name: "Consulting", href: "https://www.trizenventures.com/consulting" },
    { name: "Training", href: "https://www.lms.trizenventures.com" },
    { name: "Insights", href: "https://www.connect.trizenventures.com" },
    // { name: "Careers", href: "/", current: true },
  ];

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/">
              <img 
                src="/profile.png" 
                alt="Trizen Logo" 
                className="h-16 sm:h-20 w-auto filter brightness-0 invert"
              />
            </Link>
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
          
          {/* Desktop Auth buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-white/10 hover:text-white font-inter font-medium"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {user?.firstName}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-inter">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="font-inter">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="font-inter text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/auth">
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-white/10 hover:text-white font-inter font-medium"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button 
                    variant="outline" 
                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand-primary transition-all duration-300 font-inter font-medium"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
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
                {isAuthenticated ? (
                  <>
                    <div className="text-white font-inter text-sm">
                      <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                      <p className="text-white/70">{user?.email}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="text-white hover:bg-white/10 hover:text-white justify-start font-inter w-full"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="text-red-400 hover:bg-red-400/10 hover:text-red-300 justify-start font-inter w-full"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button 
                        variant="ghost" 
                        className="text-white hover:bg-white/10 hover:text-white justify-start font-inter w-full"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button 
                        variant="outline" 
                        className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand-primary transition-all duration-300 justify-start font-inter w-full"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
