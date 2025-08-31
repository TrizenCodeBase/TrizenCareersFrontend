import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG } from "@/config/api";
import { 
  MapPin, 
  Clock, 
  Brain, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Calendar,
  Users,
  Award,
  FileText
} from "lucide-react";
import jobsData from "@/data/jobs.json";

interface JobApplication {
  jobId: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  portfolioUrl: string;
  linkedinProfile: string;
  educationStatus: string;
  degreeDiscipline: string;
  researchPapers: string;
  internshipExperience: string;
  duration: string;
  aiMlProjects: string;
  motivation: string;
}

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, token } = useAuth();
  
  const [job, setJob] = useState<{
    id: number;
    title: string;
    location: string;
    type: string;
    category: string;
    description: string;
    tags: string[];
    requirements: string[];
    responsibilities: string[];
    benefits: string[];
    duration: string;
    startDate: string;
    applicationDeadline: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  
  const [application, setApplication] = useState<JobApplication>({
    jobId: jobId || "",
    fullName: "",
    email: "",
    phone: "",
    location: "",
    portfolioUrl: "",
    linkedinProfile: "",
    educationStatus: "",
    degreeDiscipline: "",
    researchPapers: "",
    internshipExperience: "",
    duration: "",
    aiMlProjects: "",
    motivation: ""
  });

  useEffect(() => {
    const foundJob = jobsData.jobs.find(j => j.id.toString() === jobId);
    if (foundJob) {
      setJob(foundJob);
      setApplication(prev => ({ ...prev, jobId: jobId || "" }));
    } else {
      toast({
        title: "Job Not Found",
        description: "The job you're looking for doesn't exist.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [jobId, navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setApplication(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit your application.",
        variant: "destructive"
      });
      return;
    }

    // Basic validation
    const requiredFields = ['fullName', 'email', 'phone', 'location', 'portfolioUrl', 'linkedinProfile', 'educationStatus', 'degreeDiscipline', 'researchPapers', 'internshipExperience', 'duration', 'aiMlProjects', 'motivation'];
    const missingFields = requiredFields.filter(field => !application[field as keyof JobApplication]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Debug: Log the application data being sent
      console.log('Submitting application data:', application);
      
      const response = await fetch(API_CONFIG.ENDPOINTS.APPLICATIONS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(application),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Application Submitted Successfully!",
          description: "Thank you for your application. We'll review it and get back to you soon.",
        });
        
        // Reset form
        setApplication({
          jobId: jobId || "",
          fullName: "",
          email: "",
          phone: "",
          location: "",
          portfolioUrl: "",
          linkedinProfile: "",
          educationStatus: "",
          degreeDiscipline: "",
          researchPapers: "",
          internshipExperience: "",
          duration: "",
          aiMlProjects: "",
          motivation: ""
        });
        
        setShowApplicationForm(false);
      } else {
        // Show detailed validation errors
        let errorMessage = data.error || "Failed to submit application. Please try again.";
        
        if (data.details && Array.isArray(data.details)) {
          const validationErrors = data.details.map((error: { path: string; msg: string }) => 
            `${error.path}: ${error.msg}`
          ).join(', ');
          errorMessage = `Validation failed: ${validationErrors}`;
        }
        
        toast({
          title: "Application Failed",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to submit application. Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-brand-primary hover:bg-brand-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-brand-primary font-inter">{job.title}</h1>
              <div className="flex items-center space-x-4 mt-2 text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span className="font-inter">{job.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span className="font-inter">{job.type}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Brain className="w-4 h-4" />
                  <span className="font-inter">{job.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Job Description</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed font-inter">{job.description}</p>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Requirements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 font-inter">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Responsibilities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.responsibilities.map((resp: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-brand-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 font-inter">{resp}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Benefits</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.benefits.map((benefit: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Award className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 font-inter">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag: string) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="bg-brand-accent text-brand-primary border-brand-primary/30 font-inter"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Apply for this Position</CardTitle>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Duration: {job.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Start Date: {job.startDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Deadline: {job.applicationDeadline}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!isAuthenticated ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Please <Link to="/auth" className="text-brand-primary hover:underline">log in</Link> to apply for this position.
                    </AlertDescription>
                  </Alert>
                ) : !showApplicationForm ? (
                  <Button 
                    onClick={() => setShowApplicationForm(true)}
                    className="w-full bg-brand-primary hover:bg-brand-primary/90"
                  >
                    Apply Now
                  </Button>
                ) : (
                                     <form onSubmit={handleSubmitApplication} className="space-y-4">
                     <div>
                       <Label htmlFor="fullName">Full Name *</Label>
                       <Input
                         id="fullName"
                         name="fullName"
                         value={application.fullName}
                         onChange={handleInputChange}
                         required
                         className="mt-1"
                       />
                     </div>

                     <div>
                       <Label htmlFor="email">Email Address *</Label>
                       <Input
                         id="email"
                         name="email"
                         type="email"
                         value={application.email}
                         onChange={handleInputChange}
                         required
                         className="mt-1"
                       />
                     </div>

                     <div>
                       <Label htmlFor="phone">Phone Number *</Label>
                       <Input
                         id="phone"
                         name="phone"
                         type="tel"
                         value={application.phone}
                         onChange={handleInputChange}
                         required
                         className="mt-1"
                       />
                     </div>

                     <div>
                       <Label htmlFor="location">Location *</Label>
                       <Input
                         id="location"
                         name="location"
                         placeholder="e.g., New York, NY or Remote"
                         value={application.location}
                         onChange={handleInputChange}
                         required
                         className="mt-1"
                       />
                     </div>

                     <div>
                       <Label htmlFor="portfolioUrl">Portfolio/GitHub/Website URL *</Label>
                       <Input
                         id="portfolioUrl"
                         name="portfolioUrl"
                         type="url"
                         placeholder="https://github.com/yourusername or https://yourportfolio.com"
                         value={application.portfolioUrl}
                         onChange={handleInputChange}
                         required
                         className="mt-1"
                       />
                     </div>

                     <div>
                       <Label htmlFor="linkedinProfile">LinkedIn Profile URL *</Label>
                       <Input
                         id="linkedinProfile"
                         name="linkedinProfile"
                         type="url"
                         placeholder="https://linkedin.com/in/yourprofile"
                         value={application.linkedinProfile}
                         onChange={handleInputChange}
                         required
                         className="mt-1"
                       />
                     </div>

                     <div>
                       <Label htmlFor="educationStatus">Current Education Status *</Label>
                       <select
                         id="educationStatus"
                         name="educationStatus"
                         value={application.educationStatus}
                         onChange={handleInputChange}
                         required
                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary"
                       >
                         <option value="">Select your education status</option>
                         <option value="Undergraduate (Pursuing)">Undergraduate (Pursuing)</option>
                         <option value="Undergraduate (Completed)">Undergraduate (Completed)</option>
                         <option value="Postgraduate (Pursuing)">Postgraduate (Pursuing)</option>
                         <option value="Postgraduate (Completed)">Postgraduate (Completed)</option>
                         <option value="Other">Other</option>
                       </select>
                     </div>

                     <div>
                       <Label htmlFor="degreeDiscipline">Degree/Discipline *</Label>
                       <Input
                         id="degreeDiscipline"
                         name="degreeDiscipline"
                         placeholder="E.g., B.Tech in Computer Science, M.Sc in Data Science"
                         value={application.degreeDiscipline}
                         onChange={handleInputChange}
                         required
                         className="mt-1"
                       />
                     </div>

                     <div>
                       <Label htmlFor="researchPapers">List Any Research Papers You've Published *</Label>
                       <Textarea
                         id="researchPapers"
                         name="researchPapers"
                         placeholder="List your published research papers, if any. If none, write 'None'"
                         value={application.researchPapers}
                         onChange={handleInputChange}
                         required
                         className="mt-1"
                         rows={3}
                       />
                     </div>

                     <div>
                       <Label htmlFor="internshipExperience">Please describe your previous internship experience, if any. (If not write N/A) *</Label>
                       <Textarea
                         id="internshipExperience"
                         name="internshipExperience"
                         placeholder="Describe your previous internship experience or write N/A if none"
                         value={application.internshipExperience}
                         onChange={handleInputChange}
                         required
                         className="mt-1"
                         rows={3}
                       />
                     </div>

                     <div>
                       <Label htmlFor="duration">Duration in months *</Label>
                       <Input
                         id="duration"
                         name="duration"
                         placeholder="e.g., 3 months, 6 months"
                         value={application.duration}
                         onChange={handleInputChange}
                         required
                         className="mt-1"
                       />
                     </div>

                     <div>
                       <Label htmlFor="aiMlProjects">Highlight Any AI/ML Projects You've Worked On *</Label>
                       <Textarea
                         id="aiMlProjects"
                         name="aiMlProjects"
                         placeholder="Describe the AI/ML projects you've worked on, including technologies used and outcomes"
                         value={application.aiMlProjects}
                         onChange={handleInputChange}
                         required
                         className="mt-1"
                         rows={4}
                       />
                     </div>

                     <div>
                       <Label htmlFor="motivation">What motivates you to join Trizen Ventures LLP? *</Label>
                       <Textarea
                         id="motivation"
                         name="motivation"
                         placeholder="Tell us why you want to join our team and what excites you about this opportunity"
                         value={application.motivation}
                         onChange={handleInputChange}
                         required
                         className="mt-1"
                         rows={4}
                       />
                     </div>

                     <div className="flex space-x-2">
                       <Button
                         type="button"
                         variant="outline"
                         onClick={() => setShowApplicationForm(false)}
                         className="flex-1"
                       >
                         Cancel
                       </Button>
                       <Button
                         type="button"
                         variant="outline"
                         onClick={() => {
                           setApplication({
                             jobId: jobId || "",
                             fullName: "",
                             email: "",
                             phone: "",
                             location: "",
                             portfolioUrl: "",
                             linkedinProfile: "",
                             educationStatus: "",
                             degreeDiscipline: "",
                             researchPapers: "",
                             internshipExperience: "",
                             duration: "",
                             aiMlProjects: "",
                             motivation: ""
                           });
                         }}
                         className="flex-1"
                       >
                         Clear Form
                       </Button>
                       <Button
                         type="submit"
                         disabled={isSubmitting}
                         className="flex-1 bg-brand-primary hover:bg-brand-primary/90"
                       >
                         {isSubmitting ? (
                           <>
                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                             Submitting...
                           </>
                         ) : (
                           "Submit Application"
                         )}
                       </Button>
                     </div>
                   </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
