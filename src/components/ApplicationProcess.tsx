
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Users, MessageCircle, ArrowRight } from 'lucide-react';

const steps = [
  {
    step: 1,
    title: "Application Review",
    description: "Our recruiting team reviews your application and resume to ensure alignment with the role.",
    duration: "1-2 days",
    icon: CheckCircle,
  },
  {
    step: 2,
    title: "Initial Screen",
    description: "Brief conversation with a recruiter to discuss your background and interest in the role.",
    duration: "30 minutes",
    icon: MessageCircle,
  },
  {
    step: 3,
    title: "Technical/Skills Assessment",
    description: "Role-specific evaluation of your technical skills, design portfolio, or relevant expertise.",
    duration: "1-2 hours",
    icon: Clock,
  },
  {
    step: 4,
    title: "Team Interviews",
    description: "Meet with team members and hiring manager to discuss experience, culture fit, and role expectations.",
    duration: "2-3 hours",
    icon: Users,
  }
];

const faqs = [
  {
    question: "How long does the interview process take?",
    answer: "Our typical interview process takes 1-2 weeks from application to decision, depending on role complexity and scheduling."
  },
  {
    question: "What should I expect in technical interviews?",
    answer: "Technical interviews are tailored to your role and may include coding challenges, system design, portfolio reviews, or case studies."
  },
  {
    question: "Can I apply to multiple positions?",
    answer: "Absolutely! We encourage you to apply to all roles that interest you. Our team will help identify the best fit."
  },
  {
    question: "Do you sponsor work visas?",
    answer: "Yes, we sponsor H-1B, O-1, and other work visas for qualified candidates in eligible positions."
  }
];

const ApplicationProcess = () => {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-primary mb-4 font-inter">Our Interview Process</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto font-inter">
            We've designed our interview process to be transparent, fair, and focused on finding the right mutual fit.
          </p>
        </div>
        
        {/* Timeline Process */}
        <div className="mb-20 max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical Line */}
            <div className="hidden sm:block absolute left-8 top-0 bottom-0 w-0.5 bg-brand-primary/20"></div>
            
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col sm:flex-row items-start mb-12 last:mb-0">
                {/* Timeline Node */}
                <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-lg bg-brand-primary text-white mx-auto sm:mx-0 mb-4 sm:mb-0 border-4 border-white shadow-lg">
                  <step.icon className="w-7 h-7" />
                  {/* Step Number Badge */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-brand-primary rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-brand-primary">{step.step}</span>
                  </div>
                </div>
                
                {/* Content Card */}
                <div className="sm:ml-8 flex-1 w-full">
                  <div className="relative bg-brand-accent/30 rounded-lg border border-gray-200 hover:border-brand-primary hover:shadow-lg transition-all duration-300 p-6">
                    {/* Arrow pointing from timeline */}
                    <div className="hidden sm:block absolute left-0 top-6 w-0 h-0 border-t-[8px] border-b-[8px] border-r-[12px] border-t-transparent border-b-transparent border-r-brand-accent/30 -translate-x-3"></div>
                    
                    <div className="flex flex-col sm:flex-row items-start justify-between mb-3 gap-2">
                      <h3 className="text-xl font-bold text-brand-primary font-inter">{step.title}</h3>
                      <div className="px-3 py-1 rounded-full text-sm font-medium bg-brand-primary text-white">
                        {step.duration}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed font-inter">{step.description}</p>
                    
                    {/* Progress Indicator */}
                    <div className="mt-4 flex items-center text-sm text-gray-600">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-brand-primary mr-2"></div>
                        <span className="font-inter">Step {step.step} of {steps.length}</span>
                      </div>
                      {index < steps.length - 1 && (
                        <ArrowRight className="w-4 h-4 ml-4 text-brand-primary hidden sm:block" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Completion Badge */}
          <div className="relative flex flex-col items-center justify-center mt-8">
            <div className="w-20 h-20 bg-brand-primary rounded-lg flex items-center justify-center shadow-lg mb-4">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-brand-primary font-inter">Process Complete!</p>
              <p className="text-sm text-gray-600 font-inter">Welcome to the team</p>
            </div>
          </div>
        </div>
        
        {/* FAQs */}
        <div className="bg-brand-accent/30 rounded-lg p-8 md:p-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-center text-brand-primary mb-12 font-inter">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 bg-white border border-gray-200 hover:border-brand-primary">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg text-brand-primary leading-tight font-inter font-semibold">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed font-inter">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplicationProcess;
