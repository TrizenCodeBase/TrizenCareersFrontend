
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const EarlyCareers = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">
            Early Careers
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Start Your Journey With Us</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're a student looking for an internship or a recent graduate starting your career, 
            we have programs designed to help you succeed.
          </p>
        </div>
        
        {/* Hero Image Section */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=1200&h=600&fit=crop"
            alt="Young professionals collaborating"
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80"></div>
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div className="text-white">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Launch Your Career in Tech
              </h3>
              <p className="text-lg md:text-xl mb-6 max-w-2xl">
                Join thousands of students and new graduates who have started their careers with us
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
                  Apply for Internships
                </Button>
                <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
                  Graduate Programs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </section>
  );
};

export default EarlyCareers;
