
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Code, Palette, Database } from "lucide-react";

const jobListings = [
  {
    id: 1,
    title: "Senior Software Engineer",
    location: "San Francisco, CA",
    type: "Full-time",
    category: "Engineering",
    description: "Build scalable systems that serve millions of users worldwide.",
    tags: ["React", "Node.js", "TypeScript"],
  },
  {
    id: 2,
    title: "Product Designer",
    location: "New York, NY",
    type: "Full-time",
    category: "Design",
    description: "Design beautiful and intuitive user experiences.",
    tags: ["Figma", "UI/UX", "Design Systems"],
  },
  {
    id: 3,
    title: "Data Scientist",
    location: "Seattle, WA",
    type: "Full-time",
    category: "Data",
    description: "Turn data into insights that drive business decisions.",
    tags: ["Python", "Machine Learning", "SQL"],
  },
];

const getCategoryIcon = (category) => {
  switch (category) {
    case "Engineering":
      return <Code className="w-4 h-4" />;
    case "Design":
      return <Palette className="w-4 h-4" />;
    case "Data":
      return <Database className="w-4 h-4" />;
    default:
      return null;
  }
};

const JobSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [filteredJobs, setFilteredJobs] = useState(jobListings);

  useEffect(() => {
    let filtered = jobListings;

    if (searchTerm) {
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((job) => job.category === selectedCategory);
    }

    if (selectedLocation !== "all") {
      filtered = filtered.filter((job) => job.location.includes(selectedLocation));
    }

    setFilteredJobs(filtered);
  }, [searchTerm, selectedCategory, selectedLocation]);

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-primary mb-4 font-inter">Open Positions</h2>
          <p className="text-gray-600 text-lg font-inter">Discover opportunities that match your passion and expertise</p>
        </div>

        <div className="bg-brand-accent/30 p-6 sm:p-8 rounded-lg border border-gray-200 mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Search positions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="sm:col-span-2 lg:col-span-2 border-gray-300 focus:border-brand-primary focus:ring-brand-primary font-inter"
            />

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="border-gray-300 focus:border-brand-primary focus:ring-brand-primary font-inter">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Data">Data</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="border-gray-300 focus:border-brand-primary focus:ring-brand-primary font-inter">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200">
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="San Francisco">San Francisco</SelectItem>
                <SelectItem value="New York">New York</SelectItem>
                <SelectItem value="Seattle">Seattle</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6 font-inter">No positions found matching your criteria.</p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedLocation("all");
                setFilteredJobs(jobListings);
              }}
              variant="outline"
              className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-inter"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="border border-gray-200 hover:border-brand-primary hover:shadow-lg transition-all duration-300 bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-brand-primary leading-tight font-inter">
                    {job.title}
                  </CardTitle>
                  <div className="mt-3 text-sm text-gray-600 flex flex-col sm:flex-row sm:flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0 text-brand-primary" /> 
                      <span className="truncate font-inter">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 flex-shrink-0 text-brand-primary" />
                      <span className="text-brand-primary font-medium font-inter">{job.type}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 mb-4 font-inter leading-relaxed">{job.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {job.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs bg-brand-accent text-brand-primary border-brand-primary/30 font-inter"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-medium font-inter">
                    View Details & Apply
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default JobSearch;
