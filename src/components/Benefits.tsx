
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, BookOpen, Home, Plane, Coffee, Shield } from 'lucide-react';

const benefitCategories = [
  {
    icon: Heart,
    title: "Health & Wellness",
    color: "text-red-500",
    bgColor: "bg-red-50",
    benefits: [
      "Premium health, dental, and vision insurance",
      "Mental health support and counseling",
      "On-site fitness centers and wellness programs",
      "Healthy meals and snacks provided",
      "Annual health and wellness stipend"
    ]
  },
  {
    icon: BookOpen,
    title: "Learning & Development",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    benefits: [
      "Annual learning and development budget",
      "Access to online courses and certifications",
      "Conference attendance and speaking opportunities",
      "Internal mentorship programs",
      "Tuition reimbursement for continued education"
    ]
  },
  {
    icon: Home,
    title: "Work-Life Balance",
    color: "text-green-500",
    bgColor: "bg-green-50",
    benefits: [
      "Flexible work arrangements and remote options",
      "Generous paid time off and sabbatical programs",
      "Parental leave for new parents",
      "Flexible hours and core collaboration time",
      "Work from anywhere program"
    ]
  },
  {
    icon: Plane,
    title: "Time Off & Travel",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    benefits: [
      "25+ days of paid vacation annually",
      "Company-wide holidays and mental health days",
      "Travel stipend for personal trips",
      "Sabbatical opportunities for long-term employees",
      "Volunteer time off for community service"
    ]
  },
  {
    icon: Coffee,
    title: "Workplace Perks",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    benefits: [
      "Free meals, snacks, and beverages",
      "Modern offices with collaborative spaces",
      "Transportation and commuter benefits",
      "On-site services like dry cleaning and massage",
      "Employee discount programs"
    ]
  },
  {
    icon: Shield,
    title: "Financial Security",
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
    benefits: [
      "Competitive salary and equity packages",
      "401(k) with company matching",
      "Life and disability insurance",
      "Employee stock purchase plan",
      "Financial planning and advisory services"
    ]
  }
];

const highlights = [
  { number: "100%", label: "Health insurance coverage", color: "text-red-500" },
  { number: "$5,000", label: "Annual learning budget", color: "text-blue-500" },
  { number: "Unlimited", label: "Paid time off", color: "text-green-500" },
  { number: "16 weeks", label: "Parental leave", color: "text-purple-500" }
];

const Benefits = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
            Benefits & Perks
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">More Than Just a Job</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We believe in taking care of our people with comprehensive benefits that support your health, 
            growth, and happiness both at work and at home.
          </p>
        </div>
        
        {/* Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {highlights.map((highlight, index) => (
            <div key={index} className="text-center bg-white rounded-lg p-6 shadow-sm">
              <div className={`text-3xl font-bold ${highlight.color} mb-2`}>
                {highlight.number}
              </div>
              <div className="text-gray-600 text-sm">{highlight.label}</div>
            </div>
          ))}
        </div>
        
        {/* Benefits Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefitCategories.map((category, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${category.bgColor} rounded-full mb-4 mx-auto`}>
                  <category.icon className={`w-8 h-8 ${category.color}`} />
                </div>
                <CardTitle className="text-xl text-gray-900">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {category.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-start text-sm text-gray-600">
                      <div className={`w-2 h-2 ${category.color.replace('text-', 'bg-')} rounded-full mr-3 mt-2 flex-shrink-0`}></div>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Featured Benefit */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">Employee Wellbeing Fund</h3>
              <p className="text-lg mb-6 text-blue-100">
                Each employee receives an annual $2,000 wellbeing fund to spend on anything that improves their 
                physical, mental, or emotional health – from gym memberships to therapy sessions to hobby classes.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  <span>Fitness and sports activities</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  <span>Mental health and therapy</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  <span>Hobbies and creative pursuits</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  <span>Family activities and childcare</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=600&h=400&fit=crop"
                alt="Employee wellbeing activities"
                className="rounded-lg shadow-lg w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
