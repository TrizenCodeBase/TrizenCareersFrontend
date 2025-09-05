
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
import { MapPin, Clock, Code, Palette, Database, Brain, Globe, Megaphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApplication } from "@/contexts/ApplicationContext";
import jobsData from "@/data/jobs.json";

// Import job data from JSON file
const jobListings = jobsData.jobs;

const getCategoryIcon = (category) => {
  switch (category) {
    case "Engineering":
      return <Code className="w-4 h-4" />;
    case "Design":
      return <Palette className="w-4 h-4" />;
    case "Data":
      return <Database className="w-4 h-4" />;
    case "AI/ML":
      return <Brain className="w-4 h-4" />;
    case "Web Development":
      return <Globe className="w-4 h-4" />;
    case "Marketing":
      return <Megaphone className="w-4 h-4" />;
    default:
      return null;
  }
};

const JobSearch = () => {
  const navigate = useNavigate();
  const { isJobApplied } = useApplication();
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

  // Get unique categories and locations from the data
  const categories = ["all", ...new Set(jobListings.map(job => job.category))];
  const locations = ["all", ...new Set(jobListings.map(job => job.location))];

  const handleViewJob = (jobId: number) => {
    navigate(`/job/${jobId}`);
  };

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
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="border-gray-300 focus:border-brand-primary focus:ring-brand-primary font-inter">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200">
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location === "all" ? "All Locations" : location}
                  </SelectItem>
                ))}
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
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <CardTitle className="text-lg font-semibold text-brand-primary leading-tight font-inter flex-1">
                      {job.title}
                    </CardTitle>
                    <div className="ml-2 p-1.5 bg-brand-accent/30 rounded-md">
                      {getCategoryIcon(job.category)}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-brand-primary" /> 
                      <span className="truncate font-inter">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 flex-shrink-0 text-brand-primary" />
                      <span className="text-brand-primary font-medium font-inter">{job.type}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 mb-4 font-inter leading-relaxed text-sm line-clamp-2">
                    {job.shortDescription || job.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {job.tags.slice(0, 4).map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs bg-brand-accent/50 text-brand-primary border-brand-primary/20 font-inter px-2 py-1"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {job.tags.length > 4 && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-gray-100 text-gray-600 border-gray-200 font-inter px-2 py-1"
                      >
                        +{job.tags.length - 4} more
                      </Badge>
                    )}
                  </div>
                  <Button 
                    onClick={() => handleViewJob(job.id)}
                    className={`w-full text-white font-medium font-inter text-sm py-2 ${
                      isJobApplied(job.id.toString()) 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-brand-primary hover:bg-brand-primary/90'
                    }`}
                    disabled={isJobApplied(job.id.toString())}
                  >
                    {isJobApplied(job.id.toString()) ? 'Applied' : 'View Details & Apply'}
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
