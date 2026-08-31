import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
  X,
  Upload,
  FileText
} from "lucide-react";
import jobsData from "@/data/jobs.json";
import { ACTIVE_JOB_IDS, getJobFormType, isEngineeringFullTimeJob, isEngineeringInternJob, isMarketingIntern, isMernJob, isMernInternJob, normalizeJobId, requiresYearOfPassingOut } from "@/components/application/jobTypes";
import { validateApplicationByJobType } from "@/components/application/validateApplicationByJobType";
import { uploadApplicationFile } from "@/components/application/uploadApplicationFile";
import { GrowthMarketingFormSection } from "@/components/application/GrowthMarketingFormSection";
import { ContentSocialMediaFormSection } from "@/components/application/ContentSocialMediaFormSection";
import { GenAiFormSection } from "@/components/application/GenAiFormSection";

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
  yearOfPassingOut?: string;
  internshipExperience: string;
  duration: string;
  aiMlProjects: string;
  motivation: string;
  expectedStipend: string;
  // Social Media Management Intern specific fields
  currentQualification?: string;
  collegeUniversity?: string;
  relevantCourses?: string;
  socialMediaPlatforms?: string[];
  contentCreationSkills?: string[];
  portfolioWorkSamples?: string;
  preferredStartDate?: string;
  hoursPerWeek?: string;
  workPreference?: string;
  expectations?: string;
  // Growth marketing fields
  campaignsWorkedOn?: string;
  marketingToolsUsed?: string;
  resultsAchieved?: string;
  projectsOrActivities?: string;
  growthMarketingInterest?: string;
  campaignOrEventOrganized?: string;
  // Content & social media fields
  socialMediaPageUrl?: string;
  contentSamplesLink?: string;
  contentCreated?: string;
  proudContentOrCampaign?: string;
  managedPages?: string;
  // GenAI & multi-agent contract role fields
  totalAiExperience?: string;
  agenticExperience?: string;
  currentTitle?: string;
  currentCompany?: string;
  highestDegree?: string;
  availabilityToStart?: string;
  agentFrameworks?: string[];
  llmPlatforms?: string[];
  vectorDatabases?: string[];
  planningApproaches?: string[];
  cloudPlatform?: string;
  devopsProficiency?: string;
  systemExperience?: string;
  timezone?: string;
  contractCommitment?: string;
  expectedMonthlyRate?: string;
  applicationSource?: string;
  coverNote?: string;
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
  const { isAuthenticated, token, user } = useAuth();
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
    status?: string;
  } | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUploadError, setResumeUploadError] = useState<string | null>(null);
  const [portfolioSampleFile, setPortfolioSampleFile] = useState<File | null>(null);
  const [portfolioUploadError, setPortfolioUploadError] = useState<string | null>(null);
  
  const [application, setApplication] = useState<JobApplication>({
    jobId: jobId || "",
    fullName: "",
    email: user ? user.email || '' : "",
    phone: "",
    location: "",
    portfolioUrl: "",
    linkedinProfile: "",
    resumeLink: "",
    educationStatus: "",
    degreeDiscipline: "",
    yearOfPassingOut: "",
    internshipExperience: "",
    duration: "",
    aiMlProjects: "",
    motivation: "",
    expectedStipend: "",
    // Social Media Management Intern specific fields
    currentQualification: "",
    collegeUniversity: "",
    relevantCourses: "",
    socialMediaPlatforms: [],
    contentCreationSkills: [],
    portfolioWorkSamples: "",
    preferredStartDate: "",
    hoursPerWeek: "",
    workPreference: "",
    expectations: "",
    campaignsWorkedOn: "",
    marketingToolsUsed: "",
    resultsAchieved: "",
    projectsOrActivities: "",
    growthMarketingInterest: "",
    campaignOrEventOrganized: "",
    socialMediaPageUrl: "",
    contentSamplesLink: "",
    contentCreated: "",
    proudContentOrCampaign: "",
    managedPages: "",
    totalAiExperience: "",
    agenticExperience: "",
    currentTitle: "",
    currentCompany: "",
    highestDegree: "",
    availabilityToStart: "",
    agentFrameworks: [],
    llmPlatforms: [],
    vectorDatabases: [],
    planningApproaches: [],
    cloudPlatform: "",
    devopsProficiency: "",
    systemExperience: "",
    timezone: "",
    contractCommitment: "",
    expectedMonthlyRate: "",
    applicationSource: "",
    coverNote: ""
  });

  const resolvedJobId = normalizeJobId(job?.id || jobId);
  const jobFormType = getJobFormType(resolvedJobId);

  // Update application state when user data changes
  useEffect(() => {
    if (user) {
      setApplication(prev => ({
        ...prev,
        email: user.email || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    // Extract jobId from URL format: TV-WEB-MERN-2025-002-mern-stack-developer-intern
    const actualJobId = normalizeJobId(jobId) || "";
    const allJobs = [...jobsData.jobs, ...(jobsData.archivedJobs || [])];
    const foundJob = allJobs.find(j => j.id === actualJobId);
    if (foundJob) {
      if (foundJob.status === 'closed') {
        toast({
          title: "Applications Closed",
          description: "This position is no longer accepting applications.",
          variant: "destructive"
        });
        navigate(`/jobs/${jobId}`);
        return;
      }
      setJob(foundJob);
      setApplication(prev => ({ ...prev, jobId: actualJobId }));
    } else {
      toast({
        title: "Job Not Found",
        description: "The job you're looking for doesn't exist.",
        variant: "destructive"
      });
      navigate(`/jobs/${jobId}`);
    }
  }, [jobId, toast, navigate]);

  // Real-time validation functions
  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Full name must be at least 2 characters';
        break;
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        break;
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        if (!/^[+]?[0-9\s\-()]{10,}$/.test(value)) return 'Please enter a valid phone number';
        break;
      case 'location':
        if (!value.trim()) return 'Location is required';
        break;
      case 'linkedinProfile':
        if (!value.trim()) return 'LinkedIn profile is required';
        if (!/^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/.test(value)) {
          return 'Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourprofile)';
        }
        break;
      case 'resumeLink':
        // Validated separately: either resumeFile or resumeLink (after upload)
        if (!value.trim()) return 'Resume is required. Please upload your resume (PDF, DOC or DOCX).';
        if (value.trim() && !/^https?:\/\/.+/.test(value)) return 'Please enter a valid URL (must start with http:// or https://)';
        break;
      case 'portfolioWorkSamples':
        if (portfolioSampleFile) return null;
        if (jobFormType === 'growth-marketing' && !value.trim()) return null;
        if (!value.trim()) return 'Portfolio/work samples link is required';
        if (!/^https?:\/\/.+/.test(value)) return 'Please enter a valid URL (must start with http:// or https://)';
        break;
      case 'socialMediaPageUrl':
        if (!value.trim()) return 'Social media page URL is required';
        if (!/^https?:\/\/.+/.test(value)) return 'Please enter a valid URL (must start with http:// or https://)';
        break;
      case 'contentSamplesLink':
        if (value.trim() && !/^https?:\/\/.+/.test(value)) return 'Please enter a valid URL (must start with http:// or https://)';
        break;
      case 'campaignsWorkedOn':
        if (!value.trim()) return 'Campaigns worked on is required';
        break;
      case 'marketingToolsUsed':
        if (!value.trim()) return 'Marketing tools used is required';
        break;
      case 'resultsAchieved':
        if (!value.trim()) return 'Results achieved is required';
        break;
      case 'projectsOrActivities':
        if (!value.trim()) return 'Projects or activities is required';
        break;
      case 'growthMarketingInterest':
        if (!value.trim()) return 'Please share why you are interested in growth marketing';
        break;
      case 'campaignOrEventOrganized':
        if (!value.trim()) return 'Please describe a campaign, event, or initiative you helped organize';
        break;
      case 'contentCreated':
        if (!value.trim()) return 'Please describe content you have created';
        break;
      case 'proudContentOrCampaign':
        if (!value.trim()) return 'This field is required';
        if (value.trim().length < 10) return 'Please provide a more detailed response (at least 10 characters)';
        break;
      case 'managedPages':
        if (!value.trim()) return 'Please list social media pages you have managed';
        break;
      case 'portfolioUrl':
        if (jobFormType === 'growth-marketing' && !value.trim()) return null;
        if (jobFormType === 'genai' && !value.trim()) return 'GitHub or portfolio link is required';
        if (!value.trim()) return 'Portfolio URL is required';
        if (!/^https?:\/\/.+/.test(value)) return 'Please enter a valid URL (must start with http:// or https://)';
        break;
      case 'currentQualification':
        if (!value.trim()) return 'Current qualification is required';
        break;
      case 'collegeUniversity':
        if (!value.trim()) return 'College/University is required';
        break;
      case 'educationStatus':
        if (!value.trim()) return 'Education status is required';
        break;
      case 'degreeDiscipline':
        if (!value.trim()) return 'Degree discipline is required';
        break;
      case 'yearOfPassingOut':
        if (!requiresYearOfPassingOut(resolvedJobId)) return null;
        if (!value.trim()) return 'Year of passing out is required';
        if (!['2024', '2025', '2026'].includes(value)) return 'Please select a valid year (2024, 2025, or 2026)';
        break;
      case 'internshipExperience':
        if (!value.trim()) return 'Internship experience is required';
        break;
      case 'duration':
        if (!isEngineeringInternJob(resolvedJobId)) return null;
        if (!value.trim()) return 'Duration is required';
        break;
      case 'aiMlProjects':
        if (!value.trim()) return 'AI/ML projects information is required';
        break;
      case 'motivation':
        if (!value.trim()) return 'Motivation is required';
        if (value.trim().length < 10) return 'Please provide a more detailed response (at least 10 characters)';
        break;
      case 'expectedStipend':
        if (!value.trim()) return 'Expected stipend amount is required';
        if (!/^\d+$/.test(value.trim())) return 'Please enter a valid number (digits only)';
        {
          const amount = parseInt(value.trim());
          if (amount < 0) return 'Stipend amount cannot be negative';
          if (amount > 100000) return 'Please enter a realistic stipend amount';
        }
        break;
      case 'workPreference':
        if (!value.trim()) return 'Work preference is required';
        if (!['Hybrid', 'Remote', 'Office'].includes(value)) return 'Please select a valid work preference';
        break;
      case 'preferredStartDate':
        if (!value.trim()) return 'Preferred start date is required';
        break;
      case 'hoursPerWeek':
        if (!value.trim()) return 'Hours per week is required';
        break;
      case 'expectedMonthlyRate':
        if (!value.trim()) return 'Expected rate per month is required';
        if (!/^\d+$/.test(value.trim())) return 'Enter the monthly amount in digits only (e.g., 150000)';
        break;
      case 'systemExperience':
        if (!value.trim()) return 'Please describe a RAG or multi-agent system you built';
        if (value.trim().length < 20) return 'Please provide a more detailed response (at least 20 characters)';
        break;
      case 'totalAiExperience':
        if (!value.trim()) return 'Total AI/ML experience is required';
        break;
      case 'agenticExperience':
        if (!value.trim()) return 'Agentic systems experience is required';
        break;
      case 'currentTitle':
        if (!value.trim()) return 'Current job title is required';
        break;
      case 'highestDegree':
        if (!value.trim()) return 'Highest qualification is required';
        break;
      case 'availabilityToStart':
        if (!value.trim()) return 'Start availability is required';
        break;
      case 'cloudPlatform':
        if (!value.trim()) return 'Cloud platform is required';
        break;
      case 'devopsProficiency':
        if (!value.trim()) return 'Docker/Kubernetes/CI-CD level is required';
        break;
      case 'timezone':
        if (!value.trim()) return 'Working timezone is required';
        break;
      case 'contractCommitment':
        if (!value.trim()) return 'Please confirm your availability for the 3-month contract';
        break;
      default:
        return null;
    }
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setApplication(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Only clear errors when user starts typing, don't validate on every keystroke
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Validate on blur for immediate feedback when user leaves field
    const error = validateField(name, value);
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[name] = error;
      } else {
        delete newErrors[name];
      }
      return newErrors;
    });
  };

  const handleCheckboxChange = (fieldName: string, value: string, checked: boolean) => {
    setApplication(prev => {
      const currentArray = (prev[fieldName as keyof JobApplication] as string[]) || [];
      if (checked) {
        return {
          ...prev,
          [fieldName]: [...currentArray, value]
        };
      } else {
        return {
          ...prev,
          [fieldName]: currentArray.filter(item => item !== value)
        };
      }
    });
    
    // Clear field error when user makes selection
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // Validate resume: either a file is selected or a link is already set (after upload)
  const validateResume = useCallback((): string | null => {
    if (resumeFile) return null;
    if (application.resumeLink?.trim()) return null;
    return 'Resume is required. Please upload your resume (PDF, DOC or DOCX, max 5MB).';
  }, [resumeFile, application.resumeLink]);

  // Helper function to get field display name
  const getFieldDisplayName = (fieldName: string): string => {
    const fieldNames: { [key: string]: string } = {
      fullName: "Full Name",
      email: "Email Address",
      phone: "Contact Number",
      location: "Location / City",
      portfolioUrl: "Portfolio/GitHub/Website URL",
      linkedinProfile: "LinkedIn Profile",
      resumeLink: "Resume",
      educationStatus: "Current Education Status",
      degreeDiscipline: "Degree/Discipline",
      yearOfPassingOut: "Year of Passing Out",
      internshipExperience: "Previous Internship/Work Experience",
      duration: "Preferred Duration",
      aiMlProjects: "AI/ML Projects & Experience",
      motivation: "Motivation to Join",
      expectedStipend: "Expected Stipend Amount (₹)",
      // Social Media Management Intern specific fields
      currentQualification: "Current Qualification / Year of Study",
      collegeUniversity: "College / University Name",
      relevantCourses: "Relevant Courses or Certifications",
      socialMediaPlatforms: "Social Media Platforms Familiar With",
      contentCreationSkills: "Content Creation Skills",
      portfolioWorkSamples: "Portfolio or Work Samples",
      socialMediaPageUrl: "Social Media Page URL",
      contentSamplesLink: "Additional Content Samples Link",
      contentCreated: "Content Created",
      proudContentOrCampaign: "Proud Content / Admired Creator",
      managedPages: "Managed Social Media Pages",
      campaignsWorkedOn: "Campaigns Worked On",
      marketingToolsUsed: "Marketing Tools Used",
      resultsAchieved: "Results Achieved",
      projectsOrActivities: "Projects or Activities",
      growthMarketingInterest: "Interest in Growth Marketing",
      campaignOrEventOrganized: "Campaign or Event Organized",
      preferredStartDate: "Preferred Start Date",
      hoursPerWeek: "Duration / Hours Per Week",
      workPreference: "Work Preference",
      expectations: "Expectations or Questions",
      totalAiExperience: "Total AI / ML Experience",
      agenticExperience: "Experience with Agentic Systems",
      currentTitle: "Current Job Title",
      currentCompany: "Current Company",
      highestDegree: "Highest Qualification",
      availabilityToStart: "Available to Start From",
      agentFrameworks: "Agent Frameworks",
      llmPlatforms: "LLM Platforms",
      vectorDatabases: "Vector Databases",
      planningApproaches: "Agent Planning Approaches",
      cloudPlatform: "Primary Cloud Platform",
      devopsProficiency: "Docker / Kubernetes / CI-CD Level",
      systemExperience: "RAG or Multi-Agent System Built",
      timezone: "Working Timezone",
      contractCommitment: "3-Month Contract Availability",
      expectedMonthlyRate: "Expected Rate per Month (₹)",
      applicationSource: "How You Heard About the Role",
      coverNote: "Why You Are a Fit"
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
      resumeLink: "Upload your resume (PDF, DOC or DOCX, max 5MB).",
      educationStatus: "Select your current education level",
      degreeDiscipline: "Enter your field of study or degree discipline",
      yearOfPassingOut: "Select the year you expect to or have completed your degree",
      internshipExperience: "Describe your previous work experience (if none, write 'None')",
      duration: "Select your preferred internship duration",
      aiMlProjects: "Describe your AI/ML projects and experience (if none, write 'None')",
      motivation: "Explain why you're interested in this position and what you hope to learn",
      expectedStipend: "Enter your expected monthly stipend amount in rupees (e.g., 5000, 10000)",
      // Social Media Management Intern specific fields
      currentQualification: "Enter your current qualification and year of study (e.g., B.Tech 3rd Year, MBA 1st Year)",
      collegeUniversity: "Enter the name of your college or university",
      relevantCourses: "List any relevant courses or certifications you have completed (optional)",
      socialMediaPlatforms: "Select all social media platforms you are familiar with",
      contentCreationSkills: "Select all content creation skills you possess",
      portfolioWorkSamples: "Upload your portfolio or work samples to Google Drive/Dropbox and share with 'Anyone with the link' access. Paste the shareable link here.",
      preferredStartDate: "Select your preferred start date for the internship",
      hoursPerWeek: "Enter how many hours per week you can commit (optional)",
      workPreference: "Select your preferred work arrangement",
      expectations: "Share any expectations or questions you have about this internship (optional)",
      expectedMonthlyRate: "Enter the amount you expect per month in rupees (e.g., 150000). Do not enter hourly or weekly rates.",
      systemExperience: "Describe the approach, tools, and outcome of a RAG or multi-agent system you built",
      agentFrameworks: "Select every agent framework you have hands-on experience with",
      llmPlatforms: "Select every LLM platform you have worked with",
      contractCommitment: "Confirm whether you are available for the full 3-month contract",
      timezone: "Select the timezone you normally work in",
      availabilityToStart: "Select the earliest date you can start the contract"
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

  const isLegacySocialMediaJob = () => jobFormType === 'legacy-smm';

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
    setResumeUploadError(null);
    setPortfolioUploadError(null);
    setIsSubmitting(true);

    try {
      // Validate resume: must have either uploaded file or existing link
      const resumeError = validateResume();
      if (resumeError) {
        setFieldErrors(prev => ({ ...prev, resumeLink: resumeError }));
        setShowValidationErrors(true);
        setIsSubmitting(false);
        toast({
          title: "Resume required",
          description: resumeError,
          variant: "destructive"
        });
        return;
      }

      let resumeLinkToSubmit = application.resumeLink;
      let portfolioWorkSamplesToSubmit = application.portfolioWorkSamples;

      if (resumeFile) {
        try {
          resumeLinkToSubmit = await uploadApplicationFile(resumeFile, token || '');
        } catch (uploadError) {
          const errMsg = uploadError instanceof Error ? uploadError.message : 'Failed to upload resume. Please try again.';
          setResumeUploadError(errMsg);
          setFieldErrors(prev => ({ ...prev, resumeLink: errMsg }));
          setIsSubmitting(false);
          toast({ title: "Upload failed", description: errMsg, variant: "destructive" });
          return;
        }
      }

      if (portfolioSampleFile) {
        try {
          portfolioWorkSamplesToSubmit = await uploadApplicationFile(portfolioSampleFile, token || '');
        } catch (uploadError) {
          const errMsg = uploadError instanceof Error ? uploadError.message : 'Failed to upload portfolio sample. Please try again.';
          setPortfolioUploadError(errMsg);
          setFieldErrors(prev => ({ ...prev, portfolioWorkSamples: errMsg }));
          setIsSubmitting(false);
          toast({ title: "Upload failed", description: errMsg, variant: "destructive" });
          return;
        }
      }

      const submissionJobId = normalizeJobId(job?.id || application.jobId || jobId) || application.jobId;

      if (!(ACTIVE_JOB_IDS as readonly string[]).includes(submissionJobId)) {
        setIsSubmitting(false);
        toast({
          title: "Unsupported Position",
          description: "This job is not accepting applications. Please choose an open role from the careers page.",
          variant: "destructive"
        });
        return;
      }

      const submissionValues = {
        ...application,
        jobId: submissionJobId,
        resumeLink: resumeLinkToSubmit,
        portfolioWorkSamples: portfolioWorkSamplesToSubmit
      };

      const clientValidationErrors = validateApplicationByJobType(
        getJobFormType(submissionJobId),
        submissionValues,
        {
          hasResumeFile: Boolean(resumeFile),
          hasPortfolioFile: Boolean(portfolioSampleFile),
          isIntern: isMarketingIntern(submissionJobId),
          jobId: submissionJobId
        }
      );

      if (Object.keys(clientValidationErrors).length > 0) {
        setFieldErrors(clientValidationErrors);
        setShowValidationErrors(true);
        setIsSubmitting(false);
        toast({
          title: "Validation Failed",
          description: "Please fix the highlighted fields below and try again.",
          variant: "destructive"
        });
        return;
      }

      const payload = submissionValues;
      console.log('Submitting application:', payload);
      const response = await fetch(`${API_CONFIG.ENDPOINTS.APPLICATIONS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
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
        let errorData: { error?: string; message?: string; details?: unknown } = {};
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: `Server error (${response.status}). Please try again later.` };
        }
        console.error('Application submission error:', errorData);
        
        // Handle validation errors
        if (errorData.error === 'Validation failed' && errorData.details) {
          const newFieldErrors: FieldErrors = {};
          
          console.log('Validation error details:', errorData.details);
          
          errorData.details.forEach((error: ExpressValidatorError & { field?: string; message?: string }) => {
            // express-validator uses 'path' and 'msg'; custom validation may use 'field' and 'message'
            const fieldName = error.path ?? error.field;
            const errorMessage = error.msg ?? error.message;
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
      const isNetworkOrCors =
        error instanceof TypeError &&
        (error.message === 'Failed to fetch' || (error as Error).message?.toLowerCase().includes('network'));
      const description = isNetworkOrCors
        ? 'Unable to reach the server. Please check your connection, try again in a moment, or use a different network.'
        : (error as Error).message || 'Failed to submit application. Please check your connection and try again.';
      toast({
        title: 'Network Error',
        description,
        variant: 'destructive'
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

                {jobFormType === 'genai' ? (
                  <GenAiFormSection
                    application={application}
                    fieldErrors={fieldErrors}
                    FormField={FormField}
                    handleInputChange={handleInputChange}
                    handleInputBlur={handleInputBlur}
                    handleCheckboxChange={handleCheckboxChange}
                    resumeFile={resumeFile}
                    setResumeFile={setResumeFile}
                    resumeUploadError={resumeUploadError}
                    setResumeUploadError={setResumeUploadError}
                    setApplication={setApplication}
                    setFieldErrors={setFieldErrors}
                  />
                ) : jobFormType === 'growth-marketing' ? (
                  <GrowthMarketingFormSection
                    application={application}
                    fieldErrors={fieldErrors}
                    FormField={FormField}
                    handleInputChange={handleInputChange}
                    handleInputBlur={handleInputBlur}
                    handleCheckboxChange={handleCheckboxChange}
                    resumeFile={resumeFile}
                    setResumeFile={setResumeFile}
                    resumeUploadError={resumeUploadError}
                    setResumeUploadError={setResumeUploadError}
                    portfolioSampleFile={portfolioSampleFile}
                    setPortfolioSampleFile={setPortfolioSampleFile}
                    portfolioUploadError={portfolioUploadError}
                    setPortfolioUploadError={setPortfolioUploadError}
                    setApplication={setApplication}
                    setFieldErrors={setFieldErrors}
                    isIntern={isMarketingIntern(resolvedJobId)}
                    isBusinessDevelopment={resolvedJobId === 'TV-SLS-BDE-2026-009'}
                    isTelecallingOutreach={resolvedJobId === 'TV-SLS-HOT-2026-010'}
                  />
                ) : jobFormType === 'content-social' ? (
                  <ContentSocialMediaFormSection
                    application={application}
                    fieldErrors={fieldErrors}
                    FormField={FormField}
                    handleInputChange={handleInputChange}
                    handleInputBlur={handleInputBlur}
                    handleCheckboxChange={handleCheckboxChange}
                    resumeFile={resumeFile}
                    setResumeFile={setResumeFile}
                    resumeUploadError={resumeUploadError}
                    setResumeUploadError={setResumeUploadError}
                    portfolioSampleFile={portfolioSampleFile}
                    setPortfolioSampleFile={setPortfolioSampleFile}
                    portfolioUploadError={portfolioUploadError}
                    setPortfolioUploadError={setPortfolioUploadError}
                    setApplication={setApplication}
                    setFieldErrors={setFieldErrors}
                    isIntern={isMarketingIntern(resolvedJobId)}
                    isHealthcareMarketing={resolvedJobId === 'TV-MKT-SDMH-2026-011'}
                  />
                ) : isLegacySocialMediaJob() ? (
                  // Legacy Social Media Management Intern Form
                  <>
                    {/* Step 1: Personal Details */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Step 1: Add Personal Details</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField fieldName="fullName" label="Full Name" required>
                          <Input
                            id="fullName"
                            name="fullName"
                            value={application.fullName}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
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
                            readOnly
                            required
                            className="bg-gray-100 cursor-not-allowed"
                            placeholder="Auto-filled from your profile"
                          />
                        </FormField>

                        <FormField fieldName="phone" label="Contact Number" required>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={application.phone}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            required
                            className={fieldErrors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                            placeholder="+1 (555) 123-4567"
                          />
                        </FormField>

                        <FormField fieldName="location" label="Location / City" required>
                          <Input
                            id="location"
                            name="location"
                            value={application.location}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            placeholder="e.g., New York, NY or Remote"
                            required
                            className={fieldErrors.location ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                          />
                        </FormField>

                        <FormField fieldName="linkedinProfile" label="LinkedIn Profile" required>
                          <Input
                            id="linkedinProfile"
                            name="linkedinProfile"
                            value={application.linkedinProfile}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            placeholder="https://linkedin.com/in/yourprofile"
                            required
                            className={fieldErrors.linkedinProfile ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                          />
                        </FormField>

                        <FormField fieldName="resumeLink" label="Resume" required>
                          <div className="space-y-2">
                            <div className={`flex items-center gap-3 p-3 border rounded-md bg-gray-50 ${fieldErrors.resumeLink ? "border-red-500" : "border-gray-300"}`}>
                              <input
                                id="resumeLink"
                                name="resumeLink"
                                type="file"
                                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-brand-primary file:text-white file:cursor-pointer hover:file:opacity-90"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  setResumeFile(file || null);
                                  setResumeUploadError(null);
                                  if (file) {
                                    setApplication(prev => ({ ...prev, resumeLink: "" }));
                                    setFieldErrors(prev => {
                                      const next = { ...prev };
                                      delete next.resumeLink;
                                      return next;
                                    });
                                  }
                                }}
                              />
                              {resumeFile && (
                                <span className="text-sm text-gray-600 flex items-center gap-1">
                                  <FileText className="h-4 w-4" />
                                  {resumeFile.name}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">PDF, DOC or DOCX. Max 5MB.</p>
                            {resumeUploadError && <p className="text-sm text-red-600">{resumeUploadError}</p>}
                          </div>
                        </FormField>
                      </div>
                    </div>

                    {/* Step 2: Education */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Step 2: Education</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField fieldName="currentQualification" label="Current Qualification / Year of Study" required>
                          <Input
                            id="currentQualification"
                            name="currentQualification"
                            value={application.currentQualification}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            placeholder="e.g., B.Tech 3rd Year, MBA 1st Year"
                            required
                            className={fieldErrors.currentQualification ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                          />
                        </FormField>

                        <FormField fieldName="collegeUniversity" label="College / University Name" required>
                          <Input
                            id="collegeUniversity"
                            name="collegeUniversity"
                            value={application.collegeUniversity}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            placeholder="Enter your college or university name"
                            required
                            className={fieldErrors.collegeUniversity ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                          />
                        </FormField>
                      </div>

                      <FormField fieldName="relevantCourses" label="Relevant Courses or Certifications">
                        <Textarea
                          id="relevantCourses"
                          name="relevantCourses"
                          value={application.relevantCourses}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          placeholder="List any relevant courses or certifications you have completed (optional)"
                          className={fieldErrors.relevantCourses ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                          rows={3}
                        />
                      </FormField>
                    </div>

                    {/* Step 3: Skills & Experience */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Step 3: Skills & Experience</h3>
                      
                      <FormField fieldName="internshipExperience" label="Prior Internships or Work Experience" required>
                        <Textarea
                          id="internshipExperience"
                          name="internshipExperience"
                          value={application.internshipExperience}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          placeholder="Describe your previous internship or work experience..."
                          required
                          className={fieldErrors.internshipExperience ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                          rows={3}
                        />
                      </FormField>

                      <FormField fieldName="socialMediaPlatforms" label="Social Media Platforms Familiar With" required>
                        <div className="space-y-2">
                          {["LinkedIn", "Instagram", "Facebook", "Twitter", "Other"].map((platform) => (
                            <div key={platform} className="flex items-center space-x-2">
                              <Checkbox
                                id={`social-${platform}`}
                                checked={application.socialMediaPlatforms?.includes(platform) || false}
                                onCheckedChange={(checked) => handleCheckboxChange("socialMediaPlatforms", platform, checked as boolean)}
                              />
                              <Label htmlFor={`social-${platform}`} className="text-sm font-normal">
                                {platform}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </FormField>

                      <FormField fieldName="contentCreationSkills" label="Content Creation Skills" required>
                        <div className="space-y-2">
                          {["Writing", "Graphics", "Video", "Canva", "Adobe Suite", "Other"].map((skill) => (
                            <div key={skill} className="flex items-center space-x-2">
                              <Checkbox
                                id={`content-${skill}`}
                                checked={application.contentCreationSkills?.includes(skill) || false}
                                onCheckedChange={(checked) => handleCheckboxChange("contentCreationSkills", skill, checked as boolean)}
                              />
                              <Label htmlFor={`content-${skill}`} className="text-sm font-normal">
                                {skill}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </FormField>

                      <FormField fieldName="portfolioWorkSamples" label="Portfolio or Work Samples" required>
                        <Input
                          id="portfolioWorkSamples"
                          name="portfolioWorkSamples"
                          value={application.portfolioWorkSamples}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          placeholder="https://drive.google.com/file/d/your-file-id/view?usp=sharing"
                          required
                          className={fieldErrors.portfolioWorkSamples ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                        />
                      </FormField>
                    </div>

                    {/* Step 4: Availability */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Step 4: Availability</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField fieldName="preferredStartDate" label="Preferred Start Date" required>
                          <Input
                            id="preferredStartDate"
                            name="preferredStartDate"
                            type="date"
                            value={application.preferredStartDate}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            required
                            className={fieldErrors.preferredStartDate ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                          />
                        </FormField>

                        <FormField fieldName="hoursPerWeek" label="Duration / Hours Per Week">
                          <Input
                            id="hoursPerWeek"
                            name="hoursPerWeek"
                            value={application.hoursPerWeek}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            placeholder="e.g., 20-30 hours per week"
                            className={fieldErrors.hoursPerWeek ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                          />
                        </FormField>
                      </div>

                      <FormField fieldName="workPreference" label="Work Preference" required>
                        <select
                          id="workPreference"
                          name="workPreference"
                          value={application.workPreference}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          required
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent ${
                            fieldErrors.workPreference ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300"
                          }`}
                        >
                          <option value="">Select your work preference</option>
                          <option value="Hybrid">Hybrid</option>
                          <option value="Remote">Remote</option>
                          <option value="Office">Office</option>
                        </select>
                      </FormField>
                    </div>

                    {/* Step 5: Additional Information */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Step 5: Additional Information</h3>
                      
                      <FormField fieldName="motivation" label="Why are you interested in this internship?" required>
                        <Textarea
                          id="motivation"
                          name="motivation"
                          value={application.motivation}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          placeholder="Tell us why you're interested in this position and what you hope to learn..."
                          required
                          className={fieldErrors.motivation ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                          rows={4}
                        />
                      </FormField>

                      <FormField fieldName="expectedStipend" label="Expected Stipend Amount (₹)" required>
                        <Input
                          id="expectedStipend"
                          name="expectedStipend"
                          type="number"
                          value={application.expectedStipend}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          placeholder="Enter your expected monthly stipend amount (e.g., 5000)"
                          required
                          className={fieldErrors.expectedStipend ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                        />
                      </FormField>

                      <FormField fieldName="expectations" label="Expectations or Questions">
                        <Textarea
                          id="expectations"
                          name="expectations"
                          value={application.expectations}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          placeholder="Share any expectations or questions you have about this internship (optional)"
                          className={fieldErrors.expectations ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                          rows={3}
                        />
                      </FormField>
                    </div>
                  </>
                ) : (
                  // Original form for other jobs
                  <>
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
                            onBlur={handleInputBlur}
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
                            readOnly
                            required
                            className="bg-gray-100 cursor-not-allowed"
                            placeholder="Auto-filled from your profile"
                          />
                        </FormField>

                        <FormField fieldName="phone" label="Phone Number" required>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={application.phone}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
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
                            onBlur={handleInputBlur}
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
                            onBlur={handleInputBlur}
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
                            onBlur={handleInputBlur}
                            placeholder="https://linkedin.com/in/yourprofile"
                            required
                            className={fieldErrors.linkedinProfile ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                          />
                        </FormField>

                        <FormField fieldName="resumeLink" label="Resume" required>
                          <div className="space-y-2">
                            <div className={`flex items-center gap-3 p-3 border rounded-md bg-gray-50 ${fieldErrors.resumeLink ? "border-red-500" : "border-gray-300"}`}>
                              <input
                                id="resumeLink-default"
                                name="resumeLink"
                                type="file"
                                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-brand-primary file:text-white file:cursor-pointer hover:file:opacity-90"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  setResumeFile(file || null);
                                  setResumeUploadError(null);
                                  if (file) {
                                    setApplication(prev => ({ ...prev, resumeLink: "" }));
                                    setFieldErrors(prev => {
                                      const next = { ...prev };
                                      delete next.resumeLink;
                                      return next;
                                    });
                                  }
                                }}
                              />
                              {resumeFile && (
                                <span className="text-sm text-gray-600 flex items-center gap-1">
                                  <FileText className="h-4 w-4" />
                                  {resumeFile.name}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">PDF, DOC or DOCX. Max 5MB.</p>
                            {resumeUploadError && <p className="text-sm text-red-600">{resumeUploadError}</p>}
                          </div>
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
                            onBlur={handleInputBlur}
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
                            onBlur={handleInputBlur}
                            placeholder="e.g., Computer Science, Data Science, etc."
                            required
                            className={fieldErrors.degreeDiscipline ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                          />
                        </FormField>

                        {requiresYearOfPassingOut(resolvedJobId) && (
                          <FormField fieldName="yearOfPassingOut" label="Year of Passing Out" required>
                            <select
                              id="yearOfPassingOut"
                              name="yearOfPassingOut"
                              value={application.yearOfPassingOut || ""}
                              onChange={handleInputChange}
                              onBlur={handleInputBlur}
                              required
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent ${
                                fieldErrors.yearOfPassingOut ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300"
                              }`}
                            >
                              <option value="">Select year of passing out</option>
                              <option value="2024">2024</option>
                              <option value="2025">2025</option>
                              <option value="2026">2026</option>
                            </select>
                          </FormField>
                        )}
                      </div>

                    </div>

                    {/* Experience */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Experience</h3>
                      
                      <FormField
                        fieldName="internshipExperience"
                        label={isEngineeringFullTimeJob(resolvedJobId) ? "Previous Work Experience" : "Previous Internship/Work Experience"}
                        required
                      >
                        <Textarea
                          id="internshipExperience"
                          name="internshipExperience"
                          value={application.internshipExperience}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          placeholder="Describe your previous internship or work experience..."
                          required
                          className={fieldErrors.internshipExperience ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                          rows={3}
                        />
                      </FormField>

                      <FormField
                        fieldName="aiMlProjects"
                        label={isMernJob(resolvedJobId) ? "MERN / React Native Projects & Experience" : "AI/ML Projects & Experience"}
                        required
                      >
                        <Textarea
                          id="aiMlProjects"
                          name="aiMlProjects"
                          value={application.aiMlProjects}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          placeholder={isMernJob(resolvedJobId) ? "Describe your MERN stack, React Native, or mobile projects and your contributions..." : "Describe any AI/ML projects, coursework, or experience you have..."}
                          required
                          className={fieldErrors.aiMlProjects ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                          rows={4}
                        />
                      </FormField>
                    </div>

                    {/* Preferences */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Preferences</h3>
                      
                      {isEngineeringInternJob(resolvedJobId) && (
                        <FormField fieldName="duration" label="Preferred Duration" required>
                          <select
                            id="duration"
                            name="duration"
                            value={application.duration}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
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
                      )}

                      <FormField fieldName="workPreference" label="Work Preference" required>
                        <select
                          id="workPreference"
                          name="workPreference"
                          value={application.workPreference}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          required
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent ${
                            fieldErrors.workPreference ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300"
                          }`}
                        >
                          <option value="">Select your work preference</option>
                          <option value="Hybrid">Hybrid</option>
                          <option value="Remote">Remote</option>
                          <option value="Office">Office</option>
                        </select>
                      </FormField>

                      <FormField fieldName="preferredStartDate" label="Preferred Start Date" required>
                        <Input
                          id="preferredStartDate"
                          name="preferredStartDate"
                          type="date"
                          value={application.preferredStartDate}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          required
                          className={fieldErrors.preferredStartDate ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                        />
                      </FormField>
                    </div>

                    {/* Motivation */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Motivation</h3>
                      
                      <FormField
                        fieldName="motivation"
                        label={isEngineeringFullTimeJob(resolvedJobId) ? "Why are you interested in this role?" : "Why are you interested in this internship?"}
                        required
                      >
                        <Textarea
                          id="motivation"
                          name="motivation"
                          value={application.motivation}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          placeholder="Tell us why you're interested in this position and what you hope to learn..."
                          required
                          className={fieldErrors.motivation ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                          rows={4}
                        />
                      </FormField>

                      <FormField
                        fieldName="expectedStipend"
                        label={isEngineeringFullTimeJob(resolvedJobId) ? "Expected Compensation (₹/month)" : "Expected Stipend Amount (₹)"}
                        required
                      >
                        <Input
                          id="expectedStipend"
                          name="expectedStipend"
                          type="number"
                          value={application.expectedStipend}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          placeholder="Enter your expected monthly stipend amount (e.g., 5000)"
                          required
                          className={fieldErrors.expectedStipend ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                        />
                      </FormField>
                    </div>
                  </>
                )}

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
