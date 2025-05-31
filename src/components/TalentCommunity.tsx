
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell } from 'lucide-react';

const interests = [
  "Software Engineering",
  "Product Design",
  "Data Science",
  "Product Management",
  "Marketing",
  "Sales",
  "Operations",
  "People & Culture"
];

const TalentCommunity = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleInterestChange = (interest: string, checked: boolean) => {
    if (checked) {
      setSelectedInterests([...selectedInterests, interest]);
    } else {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribed(true);
  };

  if (isSubscribed) {
    return (
      <section className="py-16 lg:py-20 bg-brand-accent/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-lg">
            <div className="w-16 h-16 bg-brand-accent rounded-lg flex items-center justify-center mx-auto mb-6 border border-brand-primary/20">
              <Bell className="w-8 h-8 text-brand-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-primary mb-4 font-inter">Welcome to Our Talent Community!</h2>
            <p className="text-lg text-gray-700 mb-6 font-inter">
              Thank you for joining! You'll start receiving updates about opportunities that match your interests.
            </p>
            <Button 
              onClick={() => setIsSubscribed(false)} 
              variant="outline"
              className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-inter"
            >
              Update Preferences
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-20 bg-brand-accent/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-brand-primary text-white hover:bg-brand-primary/90 font-inter">
            Talent Community
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-primary mb-4 font-inter">Stay Connected</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto font-inter">
            Join our talent community to stay updated on new opportunities, company news, and exclusive events. 
            We'll keep you informed about roles that match your interests.
          </p>
        </div>
        
        {/* Signup Form */}
        <div className="max-w-4xl mx-auto">
          <Card className="border border-gray-200 bg-white shadow-lg">
            <CardHeader className="text-center border-b border-gray-100">
              <CardTitle className="text-2xl text-brand-primary font-inter">Join Our Talent Community</CardTitle>
              <p className="text-gray-600 font-inter">
                Tell us about your interests and we'll keep you updated on relevant opportunities.
              </p>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-brand-primary mb-2 font-inter">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="border-gray-300 focus:border-brand-primary focus:ring-brand-primary font-inter"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-brand-primary mb-2 font-inter">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="border-gray-300 focus:border-brand-primary focus:ring-brand-primary font-inter"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-brand-primary mb-4 font-inter">
                    Areas of Interest (select all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {interests.map((interest) => (
                      <div key={interest} className="flex items-center space-x-2">
                        <Checkbox
                          id={interest}
                          checked={selectedInterests.includes(interest)}
                          onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                          className="border-brand-primary data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary"
                        />
                        <label
                          htmlFor={interest}
                          className="text-sm text-gray-700 cursor-pointer font-inter"
                        >
                          {interest}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="newsletter" 
                    className="border-brand-primary data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary"
                  />
                  <label htmlFor="newsletter" className="text-sm text-gray-600 font-inter">
                    I'd also like to receive company updates, industry insights, and career tips via email.
                  </label>
                </div>
                
                <Button type="submit" className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white py-3 font-inter font-medium">
                  Join Talent Community
                </Button>
                
                <p className="text-xs text-gray-500 text-center font-inter">
                  By joining, you agree to receive email communications from us. You can unsubscribe at any time.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TalentCommunity;
