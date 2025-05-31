
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Building } from 'lucide-react';

const locations = [
  {
    id: 1,
    city: "San Francisco",
    country: "United States",
    region: "North America",
    employees: "5,000+",
    offices: 3,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    description: "Our global headquarters and main engineering hub",
    highlights: ["Global HQ", "Engineering Center", "AI Research"]
  },
  {
    id: 2,
    city: "New York",
    country: "United States",
    region: "North America",
    employees: "2,500+",
    offices: 2,
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop",
    description: "Sales, marketing, and business development center",
    highlights: ["Sales Hub", "Marketing", "Business Development"]
  },
  {
    id: 3,
    city: "London",
    country: "United Kingdom",
    region: "Europe",
    employees: "1,800+",
    offices: 2,
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop",
    description: "European headquarters and EMEA operations center",
    highlights: ["EMEA HQ", "International Sales", "Product Localization"]
  },
  {
    id: 4,
    city: "Singapore",
    country: "Singapore",
    region: "Asia Pacific",
    employees: "1,200+",
    offices: 1,
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop",
    description: "Asia Pacific headquarters and regional operations",
    highlights: ["APAC HQ", "Regional Operations", "Mobile Engineering"]
  },
  {
    id: 5,
    city: "Toronto",
    country: "Canada",
    region: "North America",
    employees: "800+",
    offices: 1,
    image: "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400&h=300&fit=crop",
    description: "AI research and machine learning center of excellence",
    highlights: ["AI Research", "ML Engineering", "Data Science"]
  },
  {
    id: 6,
    city: "Tel Aviv",
    country: "Israel",
    region: "Middle East",
    employees: "600+",
    offices: 1,
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop",
    description: "Innovation lab and cybersecurity research center",
    highlights: ["Security Research", "Innovation Lab", "Startup Partnerships"]
  }
];

const GlobalLocations = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">We're Global</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            With offices around the world, we're building diverse teams that reflect the communities we serve. 
            Explore opportunities in our global locations.
          </p>
        </div>
        
        {/* Global Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center bg-white rounded-lg p-6 shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-gray-600 text-sm">Countries</div>
          </div>
          <div className="text-center bg-white rounded-lg p-6 shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">12</div>
            <div className="text-gray-600 text-sm">Offices</div>
          </div>
          <div className="text-center bg-white rounded-lg p-6 shadow-sm">
            <div className="text-3xl font-bold text-purple-600 mb-2">10,000+</div>
            <div className="text-gray-600 text-sm">Employees</div>
          </div>
          <div className="text-center bg-white rounded-lg p-6 shadow-sm">
            <div className="text-3xl font-bold text-orange-600 mb-2">100+</div>
            <div className="text-gray-600 text-sm">Languages</div>
          </div>
        </div>
        
        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {locations.map((location) => (
            <Card key={location.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="relative">
                <img
                  src={location.image}
                  alt={`${location.city} office`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-gray-900 hover:bg-white/90">
                    {location.region}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    {location.city}
                  </h3>
                  <div className="flex items-center text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{location.country}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm">{location.description}</p>
                
                <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{location.employees} employees</span>
                  </div>
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-1" />
                    <span>{location.offices} office{location.offices > 1 ? 's' : ''}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 text-sm">Focus Areas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {location.highlights.map((highlight, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Interactive Map Placeholder */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Explore Our Global Presence
          </h3>
          <div className="relative bg-gray-100 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-12 h-12 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Interactive Map</h4>
              <p className="text-gray-600 max-w-md">
                Click on any location to explore job opportunities, office photos, and team information in that region.
              </p>
            </div>
          </div>
        </div>
        
        {/* Remote Work Section */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4">Work From Anywhere</h3>
            <p className="text-lg text-green-100 mb-6 max-w-3xl mx-auto">
              Many of our roles offer remote work options, allowing you to contribute to our global mission 
              from wherever you're most productive and happy.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">50%</div>
                <div className="text-green-100 text-sm">Remote workforce</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">40+</div>
                <div className="text-green-100 text-sm">Remote-friendly countries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">24/7</div>
                <div className="text-green-100 text-sm">Global collaboration</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalLocations;
