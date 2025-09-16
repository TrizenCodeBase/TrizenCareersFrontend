import { useState, useEffect, useCallback } from "react";
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
  ArrowLeft,
  X
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
  resumeLink: string;
  educationStatus: string;
  degreeDiscipline: string;
  researchPapers: string;
  internshipExperience: string;
  duration: string;
  aiMlProjects: string;
  motivation: string;
}

interface ValidationError {
  field: string;
  message: string;
}

interface ExpressValidatorError {
  path: string;
  msg: string;
  location?: string;
  value?: string | number | boolean;
}

interface FieldErrors {
  [key: string]: string;
}

const ApplicationForm = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, token } = useAuth();
  const { markJobAsApplied } = useApplication();
  
  const [job, setJob] = useState<{
    id: string;
    title: string;
    slug: string;
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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  
  const [application, setApplication] = useState<JobApplication>({
    jobId: jobId || "",
    fullName: "",
    email: "",
    phone: "",
    location: "",
    portfolioUrl: "",
    linkedinProfile: "",
    resumeLink: "",
    educationStatus: "",
    degreeDiscipline: "",
    researchPapers: "",
    internshipExperience: "",
    duration: "",
    aiMlProjects: "",
    motivation: ""
  });

  useEffect(() => {
    // Extract jobId from URL format: TV-WEB-MERN-2025-002-mern-stack-developer-intern
    const actualJobId = jobId?.split('-').slice(0, 5).join('-'); // Get TV-WEB-MERN-2025-002
    const foundJob = jobsData.jobs.find(j => j.id === actualJobId);
    if (foundJob) {
      setJob(foundJob);
      setApplication(prev => ({ ...prev, jobId: actualJobId || "" }));
    } else {
      toast({
        title: "Job Not Found",
        description: "The job you're looking for doesn't exist.",
        variant: "destructive"
      });
      navigate(`/jobs/${jobId}`);
    }
  }, [jobId, toast, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setApplication(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Helper function to get field display name
  const getFieldDisplayName = (fieldName: string): string => {
    const fieldNames: { [key: string]: string } = {
      fullName: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      location: "Location",
      portfolioUrl: "Portfolio/GitHub/Website URL",
      linkedinProfile: "LinkedIn Profile URL",
      resumeLink: "Resume Link (Google Drive/Dropbox)",
      educationStatus: "Current Education Status",
      degreeDiscipline: "Degree/Discipline",
      researchPapers: "Research Papers/Publications",
      internshipExperience: "Previous Internship/Work Experience",
      duration: "Preferred Duration",
      aiMlProjects: "AI/ML Projects & Experience",
      motivation: "Motivation to Join"
    };
    return fieldNames[fieldName] || fieldName;
  };

  // Helper function to get field guidance
  const getFieldGuidance = (fieldName: string): string => {
    const guidance: { [key: string]: string } = {
      fullName: "Enter your complete name as it appears on official documents",
      email: "Enter a valid email address (e.g., your.email@example.com)",
      phone: "Enter your phone number with country code (e.g., +1 555 123 4567)",
      location: "Enter your city and country (e.g., New York, NY or Remote)",
      portfolioUrl: "Enter a valid URL to your portfolio, GitHub profile, or website",
      linkedinProfile: "Enter your complete LinkedIn profile URL",
      resumeLink: "Upload your resume to Google Drive/Dropbox and share with 'Anyone with the link' access. Paste the shareable link here.",
      educationStatus: "Select your current education level",
      degreeDiscipline: "Enter your field of study or degree discipline",
      researchPapers: "List any research papers, publications, or academic projects (if none, write 'None')",
      internshipExperience: "Describe your previous work experience (if none, write 'None')",
      duration: "Select your preferred internship duration",
      aiMlProjects: "Describe your AI/ML projects and experience (if none, write 'None')",
      motivation: "Explain why you're interested in this position and what you hope to learn"
    };
    return guidance[fieldName] || "Please provide valid information for this field";
  };

  // Helper component for form fields with error display
  const FormField = useCallback(({ 
    fieldName, 
    label, 
    children, 
    required = false 
  }: { 
    fieldName: string; 
    label: string; 
    children: React.ReactNode; 
    required?: boolean;
  }) => {
    const hasError = fieldErrors[fieldName];
    
    return (
      <div>
        <Label htmlFor={fieldName} className="text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <div className="mt-1">
          {children}
        </div>
        {hasError && (
          <div className="mt-2 space-y-1">
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {fieldErrors[fieldName]}
            </p>
            <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded border-l-2 border-gray-300">
              💡 <strong>Tip:</strong> {getFieldGuidance(fieldName)}
            </p>
          </div>
        )}
      </div>
    );
  }, [fieldErrors]);

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

    // Clear previous errors
    setFieldErrors({});
    setShowValidationErrors(false);
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
        
        // Handle validation errors
        if (errorData.error === 'Validation failed' && errorData.details) {
          const newFieldErrors: FieldErrors = {};
          
          console.log('Validation error details:', errorData.details);
          
          errorData.details.forEach((error: ExpressValidatorError) => {
            // express-validator returns objects with 'path' and 'msg' properties
            const fieldName = error.path;
            const errorMessage = error.msg;
            console.log('Processing error:', { fieldName, errorMessage, originalError: error });
            
            if (fieldName && errorMessage) {
              newFieldErrors[fieldName] = errorMessage;
            }
          });
          
          console.log('Processed field errors:', newFieldErrors);
          
          setFieldErrors(newFieldErrors);
          setShowValidationErrors(true);
          
          toast({
            title: "Validation Failed",
            description: "Please fix the highlighted fields below and try again.",
            variant: "destructive"
          });
        } else {
          // Handle other errors
          toast({
            title: "Submission Failed",
            description: errorData.error || errorData.message || "Failed to submit application. Please try again.",
            variant: "destructive"
          });
        }
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
                onClick={() => navigate(`/jobs/${jobId}`)}
                className="w-full bg-brand-primary hover:bg-brand-primary/90"
              >
                Back to Job Details
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
            onClick={() => navigate(`/jobs/${jobId}`)}
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
              <div className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please log in to submit your application.
                  </AlertDescription>
                </Alert>
                <div className="flex justify-center">
                  <Button
                    onClick={() => navigate('/auth')}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-12 py-4 text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 border-2 border-blue-700 hover:border-blue-800"
                  >
                    🔐 Log In to Apply
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-6">
                {/* Validation Errors Banner */}
                {showValidationErrors && Object.keys(fieldErrors).length > 0 && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-semibold">Please fix the following errors:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {Object.entries(fieldErrors).map(([field, message]) => (
                            <li key={field}>
                              <strong>{getFieldDisplayName(field)}:</strong> {message}
                            </li>
                          ))}
                        </ul>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowValidationErrors(false)}
                          className="mt-2 h-6 px-2 text-xs"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField fieldName="fullName" label="Full Name" required>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={application.fullName}
                        onChange={handleInputChange}
                        required
                        className={fieldErrors.fullName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                        placeholder="Enter your full name"
                      />
                    </FormField>

                    <FormField fieldName="email" label="Email Address" required>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={application.email}
                        onChange={handleInputChange}
                        required
                        className={fieldErrors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                        placeholder="your.email@example.com"
                      />
                    </FormField>

                    <FormField fieldName="phone" label="Phone Number" required>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={application.phone}
                        onChange={handleInputChange}
                        required
                        className={fieldErrors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                        placeholder="+1 (555) 123-4567"
                      />
                    </FormField>

                    <FormField fieldName="location" label="Location" required>
                      <Input
                        id="location"
                        name="location"
                        value={application.location}
                        onChange={handleInputChange}
                        placeholder="e.g., New York, NY or Remote"
                        required
                        className={fieldErrors.location ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                      />
                    </FormField>
                  </div>
                </div>

                {/* Professional Links */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Professional Links</h3>
                  
                  <div className="space-y-4">
                    <FormField fieldName="portfolioUrl" label="Portfolio/GitHub/Website URL" required>
                      <Input
                        id="portfolioUrl"
                        name="portfolioUrl"
                        value={application.portfolioUrl}
                        onChange={handleInputChange}
                        placeholder="https://github.com/yourusername or https://yourwebsite.com"
                        required
                        className={fieldErrors.portfolioUrl ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                      />
                    </FormField>

                    <FormField fieldName="linkedinProfile" label="LinkedIn Profile URL" required>
                      <Input
                        id="linkedinProfile"
                        name="linkedinProfile"
                        value={application.linkedinProfile}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/in/yourprofile"
                        required
                        className={fieldErrors.linkedinProfile ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                      />
                    </FormField>

                    <FormField fieldName="resumeLink" label="Resume Link (Google Drive/Dropbox)" required>
                      <Input
                        id="resumeLink"
                        name="resumeLink"
                        value={application.resumeLink}
                        onChange={handleInputChange}
                        placeholder="https://drive.google.com/file/d/your-file-id/view?usp=sharing"
                        required
                        className={fieldErrors.resumeLink ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                      />
                    </FormField>
                  </div>
                </div>

                {/* Education */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Education</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField fieldName="educationStatus" label="Current Education Status" required>
                      <select
                        id="educationStatus"
                        name="educationStatus"
                        value={application.educationStatus}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent ${
                          fieldErrors.educationStatus ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300"
                        }`}
                      >
                        <option value="">Select your education status</option>
                        <option value="high-school">High School</option>
                        <option value="bachelor">Bachelor's Degree</option>
                        <option value="master">Master's Degree</option>
                        <option value="phd">PhD</option>
                        <option value="other">Other</option>
                      </select>
                    </FormField>

                    <FormField fieldName="degreeDiscipline" label="Degree/Discipline" required>
                      <Input
                        id="degreeDiscipline"
                        name="degreeDiscipline"
                        value={application.degreeDiscipline}
                        onChange={handleInputChange}
                        placeholder="e.g., Computer Science, Data Science, etc."
                        required
                        className={fieldErrors.degreeDiscipline ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                      />
                    </FormField>
                  </div>

                  <FormField fieldName="researchPapers" label="Research Papers/Publications" required>
                    <Textarea
                      id="researchPapers"
                      name="researchPapers"
                      value={application.researchPapers}
                      onChange={handleInputChange}
                      placeholder="List any research papers, publications, or academic projects..."
                      required
                      className={fieldErrors.researchPapers ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                      rows={3}
                    />
                  </FormField>
                </div>

                {/* Experience */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Experience</h3>
                  
                  <FormField fieldName="internshipExperience" label="Previous Internship/Work Experience" required>
                    <Textarea
                      id="internshipExperience"
                      name="internshipExperience"
                      value={application.internshipExperience}
                      onChange={handleInputChange}
                      placeholder="Describe your previous internship or work experience..."
                      required
                      className={fieldErrors.internshipExperience ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                      rows={3}
                    />
                  </FormField>

                  <FormField fieldName="aiMlProjects" label="AI/ML Projects & Experience" required>
                    <Textarea
                      id="aiMlProjects"
                      name="aiMlProjects"
                      value={application.aiMlProjects}
                      onChange={handleInputChange}
                      placeholder="Describe any AI/ML projects, coursework, or experience you have..."
                      required
                      className={fieldErrors.aiMlProjects ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                      rows={4}
                    />
                  </FormField>
                </div>

                {/* Preferences */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Preferences</h3>
                  
                  <FormField fieldName="duration" label="Preferred Duration" required>
                    <select
                      id="duration"
                      name="duration"
                      value={application.duration}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent ${
                        fieldErrors.duration ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select preferred duration</option>
                      <option value="2-months">2 months</option>
                      <option value="3-months">3 months</option>
                      <option value="6-months">6 months</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </FormField>
                </div>

                {/* Motivation */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Motivation</h3>
                  
                  <FormField fieldName="motivation" label="Why are you interested in this internship?" required>
                    <Textarea
                      id="motivation"
                      name="motivation"
                      value={application.motivation}
                      onChange={handleInputChange}
                      placeholder="Tell us why you're interested in this position and what you hope to learn..."
                      required
                      className={fieldErrors.motivation ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                      rows={4}
                    />
                  </FormField>
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
