
import { Button } from "@/components/ui/button";
import { Linkedin, Twitter, Facebook, Instagram, Youtube, Mail } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/company/trizenventuresllp/", label: "LinkedIn" },
    { icon: Twitter, href: "https://x.com/TrizenVenture", label: "Twitter" },
    { icon: Facebook, href: "https://www.facebook.com/trizenventures/", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/trizenventures", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  const footerLinks = {
    careers: [
      { name: "Browse Jobs", href: "#" },
      { name: "Early Careers", href: "#" },
      { name: "Life at Company", href: "#" },
      { name: "Benefits", href: "#" },
    ],
    company: [
      { name: "About Us", href: "#" },
      { name: "Our Values", href: "#" },
      { name: "Leadership", href: "#" },
      { name: "News", href: "#" },
    ],
    resources: [
      { name: "Interview Tips", href: "#" },
      { name: "FAQs", href: "#" },
      { name: "Contact HR", href: "#" },
      { name: "Locations", href: "#" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "Accessibility", href: "#" },
    ],
  };

  return (
    <footer className="bg-brand-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="mb-6">
              <img 
                src="/lovable-uploads/fb0bf098-66b0-4eb3-8842-f916a419a3d9.png" 
                alt="Company Logo" 
                className="h-10 sm:h-12 w-auto mb-4 brightness-0 invert"
              />
              <h3 className="text-lg sm:text-xl font-bold mb-2 font-inter">Trizen Careers</h3>
              <p className="text-white/80 mb-4 text-sm sm:text-base font-inter leading-relaxed">
                Join us in building innovative solutions that impact millions of people worldwide. 
                Discover your next career opportunity with us.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-3 sm:space-x-4">
              {socialLinks.map((social, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="text-white/70 hover:text-white hover:bg-white/10 transition-colors h-8 w-8 sm:h-10 sm:w-10"
                  asChild
                >
                  <a href={social.href} aria-label={social.label}>
                    <social.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 col-span-1 sm:col-span-2 lg:col-span-4">
            {/* Careers Links */}
            <div>
              <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-white font-inter">Careers</h4>
              <ul className="space-y-2">
                {footerLinks.careers.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-white/70 hover:text-white transition-colors text-sm sm:text-base font-inter">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-white font-inter">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-white/70 hover:text-white transition-colors text-sm sm:text-base font-inter">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-white font-inter">Resources</h4>
              <ul className="space-y-2">
                {footerLinks.resources.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-white/70 hover:text-white transition-colors text-sm sm:text-base font-inter">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-white font-inter">Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-white/70 hover:text-white transition-colors text-sm sm:text-base font-inter">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-white/20 pt-6 sm:pt-8 mb-6 sm:mb-8">
          <div className="max-w-md">
            <h4 className="font-semibold text-base sm:text-lg mb-2 text-white font-inter">Stay Updated</h4>
            <p className="text-white/70 mb-4 text-sm sm:text-base font-inter">Get notified about new job opportunities and company updates.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 sm:px-4 py-2 bg-white/10 border border-white/30 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm sm:text-base font-inter"
              />
              <Button className="bg-white text-brand-primary hover:bg-white/90 text-sm sm:text-base px-4 py-2 font-inter font-medium">
                <Mail className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-white/70 text-xs sm:text-sm space-y-2 md:space-y-0">
            <p className="font-inter">&copy; 2024 Trizen. All rights reserved.</p>
            <p className="text-center md:text-right font-inter">
              Built with ❤️ for amazing candidates worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
