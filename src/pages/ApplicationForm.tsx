import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useApplication } from "@/contexts/ApplicationContext";
import { API_CONFIG } from "@/config/api";
import { emailService } from "@/services/emailService";
import { 
  Calendar, 
  Clock, 
  AlertCircle,
  Loader2,
  CheckCircle,
  ArrowLeft
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

const ApplicationForm = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, token } = useAuth();
  const { markJobAsApplied } = useApplication();
  
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
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
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
      window.close();
    }
  }, [jobId, toast]);

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

    setIsSubmitting(true);

    try {
      console.log('Submitting application:', application);
      const response = await fetch(`${API_CONFIG.ENDPOINTS.APPLICATIONS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(application)
      });

      if (response.ok) {
        // Mark this job as applied
        if (jobId) {
          markJobAsApplied(jobId);
        }

        // Send confirmation email
        console.log('📧 Attempting to send confirmation email...');
        console.log('📧 Applicant details:', {
          name: application.fullName,
          email: application.email,
          job: job.title,
          jobId: jobId
        });
        
        try {
          const emailResult = await emailService.sendJobApplicationConfirmation({
            applicantName: application.fullName,
            applicantEmail: application.email,
            jobTitle: job.title,
            jobId: jobId || '',
            companyName: 'Trizen Ventures'
          }, token || '');

          if (emailResult.success) {
            console.log('✅ Confirmation email sent successfully:', emailResult.data);
          } else {
            console.warn('❌ Failed to send confirmation email:', emailResult.message);
            console.warn('❌ Email error details:', emailResult.error);
            // Don't fail the application submission if email fails
          }
        } catch (emailError) {
          console.error('❌ Error sending confirmation email:', emailError);
          // Don't fail the application submission if email fails
        }

        setIsSubmitted(true);
        toast({
          title: "Application Submitted!",
          description: "Thank you for your application. We'll review it and get back to you soon. A confirmation email has been sent to your inbox.",
        });
      } else {
        const errorData = await response.json();
        console.error('Application submission error:', errorData);
        toast({
          title: "Submission Failed",
          description: errorData.error || errorData.message || "Failed to submit application. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Network Error",
        description: "Failed to submit application. Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading application form...</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for applying to <strong>{job.title}</strong>. We'll review your application and get back to you soon. A confirmation email has been sent to your inbox.
              </p>
              <Button 
                onClick={() => window.close()}
                className="w-full bg-brand-primary hover:bg-brand-primary/90"
              >
                Close Window
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => window.close()}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Job Details
          </Button>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Apply for this Position</h1>
            
            <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Duration: {job.duration}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Start Date: {job.startDate}
              </div>
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                Deadline: {job.applicationDeadline}
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">{job.title}</h3>
              <p className="text-blue-800 text-sm">{job.location} • {job.type}</p>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <Card>
          <CardContent className="p-8">
            {!isAuthenticated ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please log in to submit your application.
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fullName" className="text-sm font-medium">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={application.fullName}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={application.email}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={application.phone}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <Label htmlFor="location" className="text-sm font-medium">Location *</Label>
                      <Input
                        id="location"
                        name="location"
                        value={application.location}
                        onChange={handleInputChange}
                        placeholder="e.g., New York, NY or Remote"
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Links */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Professional Links</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="portfolioUrl" className="text-sm font-medium">Portfolio/GitHub/Website URL *</Label>
                      <Input
                        id="portfolioUrl"
                        name="portfolioUrl"
                        value={application.portfolioUrl}
                        onChange={handleInputChange}
                        placeholder="https://github.com/yourusername or https://yourwebsite.com"
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="linkedinProfile" className="text-sm font-medium">LinkedIn Profile URL *</Label>
                      <Input
                        id="linkedinProfile"
                        name="linkedinProfile"
                        value={application.linkedinProfile}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/in/yourprofile"
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Education */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Education</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="educationStatus" className="text-sm font-medium">Current Education Status *</Label>
                      <select
                        id="educationStatus"
                        name="educationStatus"
                        value={application.educationStatus}
                        onChange={handleInputChange}
                        required
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                      >
                        <option value="">Select your education status</option>
                        <option value="high-school">High School</option>
                        <option value="bachelor">Bachelor's Degree</option>
                        <option value="master">Master's Degree</option>
                        <option value="phd">PhD</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="degreeDiscipline" className="text-sm font-medium">Degree/Discipline (if applicable)</Label>
                      <Input
                        id="degreeDiscipline"
                        name="degreeDiscipline"
                        value={application.degreeDiscipline}
                        onChange={handleInputChange}
                        placeholder="e.g., Computer Science, Data Science, etc."
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="researchPapers" className="text-sm font-medium">Research Papers/Publications (if any)</Label>
                    <Textarea
                      id="researchPapers"
                      name="researchPapers"
                      value={application.researchPapers}
                      onChange={handleInputChange}
                      placeholder="List any research papers, publications, or academic projects..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Experience */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Experience</h3>
                  
                  <div>
                    <Label htmlFor="internshipExperience" className="text-sm font-medium">Previous Internship/Work Experience</Label>
                    <Textarea
                      id="internshipExperience"
                      name="internshipExperience"
                      value={application.internshipExperience}
                      onChange={handleInputChange}
                      placeholder="Describe your previous internship or work experience..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="aiMlProjects" className="text-sm font-medium">AI/ML Projects & Experience</Label>
                    <Textarea
                      id="aiMlProjects"
                      name="aiMlProjects"
                      value={application.aiMlProjects}
                      onChange={handleInputChange}
                      placeholder="Describe any AI/ML projects, coursework, or experience you have..."
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                </div>

                {/* Preferences */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Preferences</h3>
                  
                  <div>
                    <Label htmlFor="duration" className="text-sm font-medium">Preferred Duration *</Label>
                    <select
                      id="duration"
                      name="duration"
                      value={application.duration}
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    >
                      <option value="">Select preferred duration</option>
                      <option value="2-months">2 months</option>
                      <option value="3-months">3 months</option>
                      <option value="6-months">6 months</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                {/* Motivation */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Motivation</h3>
                  
                  <div>
                    <Label htmlFor="motivation" className="text-sm font-medium">Why are you interested in this internship? *</Label>
                    <Textarea
                      id="motivation"
                      name="motivation"
                      value={application.motivation}
                      onChange={handleInputChange}
                      placeholder="Tell us why you're interested in this position and what you hope to learn..."
                      required
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-primary hover:bg-brand-primary/90 py-3 text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting Application...
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
  );
};

export default ApplicationForm;
