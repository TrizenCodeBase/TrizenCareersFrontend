
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Lightbulb, TrendingUp, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Senior Product Manager",
    quote: "The innovation and collaboration here is unmatched. Every day brings new challenges and opportunities to grow.",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Lead Software Engineer",
    quote: "Working here has accelerated my career beyond what I thought possible. The mentorship and learning opportunities are incredible.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "UX Designer",
    quote: "The creative freedom and support for innovative thinking makes this the perfect place for designers to thrive.",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=400&fit=crop&crop=face"
  }
];

const values = [
  {
    title: "Innovation First",
    description: "We're constantly pushing boundaries and exploring new possibilities to solve complex problems.",
    icon: Lightbulb
  },
  {
    title: "Inclusive Culture",
    description: "We believe diverse perspectives drive better solutions and create a stronger community where everyone belongs.",
    icon: Users
  },
  {
    title: "Growth Mindset",
    description: "We invest in our people's development and encourage continuous learning and experimentation.",
    icon: TrendingUp
  },
  {
    title: "Global Impact",
    description: "Our work touches lives around the world, creating positive change at unprecedented scale.",
    icon: Heart
  }
];

const LifeAtCompany = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  const goToSlide = (index: number) => setCurrentIndex(index);

  return (
    <section className="py-16 lg:py-24 bg-brand-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-primary mb-4 font-inter">Life at Trizen</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto font-inter">
            Join a community of innovators, dreamers, and builders who are passionate about creating technology that makes a difference.
          </p>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h3 className="text-2xl sm:text-3xl font-bold text-center text-brand-primary mb-12 font-inter">Our Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden bg-white border border-gray-200 hover:border-brand-primary hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6 text-center flex flex-col items-center">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-accent border border-brand-primary/20 group-hover:scale-110 transition-transform">
                    <value.icon className="w-6 h-6 text-brand-primary" />
                  </div>
                  <h4 className="text-lg font-semibold text-brand-primary mb-3 font-inter">{value.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed font-inter">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Employee Testimonials */}
        <div className="mb-16">
          <h3 className="text-2xl sm:text-3xl font-bold text-center text-brand-primary mb-12 font-inter">Hear from Our Team</h3>
          <div className="relative max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-lg">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0">
                    <Card className="mx-4 bg-white border border-gray-200 shadow-lg">
                      <CardContent className="p-8 md:p-12">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                          <div className="relative">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-brand-primary/20">
                              <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          <div className="flex-1 text-center md:text-left">
                            <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6 font-inter">
                              "{testimonial.quote}"
                            </blockquote>
                            <div>
                              <h4 className="text-lg font-semibold text-brand-primary font-inter">{testimonial.name}</h4>
                              <p className="text-gray-600 font-inter">{testimonial.role}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full border border-gray-300 flex items-center justify-center text-brand-primary hover:border-brand-primary hover:shadow-lg transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full border border-gray-300 flex items-center justify-center text-brand-primary hover:border-brand-primary hover:shadow-lg transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? 'bg-brand-primary scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Diversity & Inclusion */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-brand-primary mb-6 font-inter">Diversity & Inclusion at Our Core</h3>
              <p className="text-lg text-gray-700 mb-8 font-inter leading-relaxed">
                We're committed to building a workforce that reflects the diversity of the communities we serve. 
                Our inclusive culture empowers everyone to bring their authentic selves to work.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-primary font-inter">50%</div>
                  <div className="text-sm text-gray-600 font-inter">Women in Leadership</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-primary font-inter">80+</div>
                  <div className="text-sm text-gray-600 font-inter">Countries Represented</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-primary font-inter">95%</div>
                  <div className="text-sm text-gray-600 font-inter">Employee Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-primary font-inter">40%</div>
                  <div className="text-sm text-gray-600 font-inter">Underrepresented Groups</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop"
                alt="Diverse team collaboration"
                className="rounded-lg w-full h-80 object-cover border border-gray-200"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LifeAtCompany;
