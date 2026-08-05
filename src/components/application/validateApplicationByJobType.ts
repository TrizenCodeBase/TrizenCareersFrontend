import type { JobFormType } from './jobTypes';
import { isEngineeringInternJob, isMernFullTimeJob, isMernInternJob, requiresYearOfPassingOut } from './jobTypes';
import type { MarketingApplicationFields, GenAiApplicationFields, FieldErrors } from './types';

type ApplicationValues = MarketingApplicationFields & GenAiApplicationFields & {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedinProfile: string;
  resumeLink: string;
  portfolioUrl?: string;
  educationStatus?: string;
  degreeDiscipline?: string;
  yearOfPassingOut?: string;
  internshipExperience?: string;
  duration?: string;
  aiMlProjects?: string;
  motivation?: string;
  expectedStipend?: string;
};

const isBlank = (value?: string) => !value || value.trim() === '';

const isValidUrl = (value: string) => /^https?:\/\/.+/.test(value);

const requireString = (errors: FieldErrors, field: string, value: string | undefined, message: string) => {
  if (isBlank(value)) errors[field] = message;
};

const requireUrl = (errors: FieldErrors, field: string, value: string | undefined, message: string) => {
  if (isBlank(value)) {
    errors[field] = message;
    return;
  }
  if (!isValidUrl(value!.trim())) {
    errors[field] = 'Please enter a valid URL (must start with http:// or https://)';
  }
};

export function validateApplicationByJobType(
  jobFormType: JobFormType,
  values: ApplicationValues,
  options: { hasResumeFile: boolean; hasPortfolioFile: boolean; isIntern: boolean; jobId?: string }
): FieldErrors {
  const errors: FieldErrors = {};

  requireString(errors, 'fullName', values.fullName, 'Full name is required');
  requireString(errors, 'email', values.email, 'Email is required');
  requireString(errors, 'phone', values.phone, 'Phone number is required');
  requireString(errors, 'location', values.location, 'Location is required');
  requireString(errors, 'linkedinProfile', values.linkedinProfile, 'LinkedIn profile is required');

  if (jobFormType === 'genai') {
    if (!options.hasResumeFile && isBlank(values.resumeLink)) {
      errors.resumeLink = 'Resume is required. Please upload your resume (PDF, DOC or DOCX).';
    }

    requireUrl(errors, 'portfolioUrl', values.portfolioUrl, 'GitHub or portfolio link is required');
    requireString(errors, 'totalAiExperience', values.totalAiExperience, 'Total AI/ML experience is required');
    requireString(errors, 'agenticExperience', values.agenticExperience, 'Agentic systems experience is required');
    requireString(errors, 'currentTitle', values.currentTitle, 'Current job title is required');
    requireString(errors, 'highestDegree', values.highestDegree, 'Highest qualification is required');
    requireString(errors, 'availabilityToStart', values.availabilityToStart, 'Start availability is required');
    requireString(errors, 'cloudPlatform', values.cloudPlatform, 'Cloud platform is required');
    requireString(errors, 'devopsProficiency', values.devopsProficiency, 'Docker/Kubernetes/CI-CD level is required');
    requireString(errors, 'systemExperience', values.systemExperience, 'Please describe a RAG or multi-agent system you built');
    requireString(errors, 'timezone', values.timezone, 'Working timezone is required');
    requireString(errors, 'contractCommitment', values.contractCommitment, 'Please confirm your availability for the 3-month contract');
    requireString(errors, 'expectedMonthlyRate', values.expectedMonthlyRate, 'Expected rate per month is required');

    if (!isBlank(values.expectedMonthlyRate) && !/^\d+$/.test(values.expectedMonthlyRate!.trim())) {
      errors.expectedMonthlyRate = 'Enter the monthly amount in digits only (e.g., 150000)';
    }

    if (!values.agentFrameworks?.length) {
      errors.agentFrameworks = 'Select at least one agent framework';
    }
    if (!values.llmPlatforms?.length) {
      errors.llmPlatforms = 'Select at least one LLM platform';
    }

    return errors;
  }

  requireString(errors, 'motivation', values.motivation, 'Motivation is required');
  requireString(errors, 'expectedStipend', values.expectedStipend, 'Expected amount is required');
  requireString(errors, 'preferredStartDate', values.preferredStartDate, 'Preferred start date is required');
  requireString(errors, 'workPreference', values.workPreference, 'Work preference is required');

  if (!options.hasResumeFile && isBlank(values.resumeLink)) {
    errors.resumeLink = 'Resume is required. Please upload your resume (PDF, DOC or DOCX).';
  }

  if (jobFormType === 'growth-marketing') {
    requireString(errors, 'marketingToolsUsed', values.marketingToolsUsed, 'Marketing tools used is required');

    if (options.isIntern) {
      requireString(errors, 'projectsOrActivities', values.projectsOrActivities, 'Projects or activities is required');
      requireString(errors, 'growthMarketingInterest', values.growthMarketingInterest, 'Please share why you are interested in growth marketing');
      requireString(errors, 'campaignOrEventOrganized', values.campaignOrEventOrganized, 'Please describe a campaign, event, or initiative you helped organize');
    } else {
      requireString(errors, 'campaignsWorkedOn', values.campaignsWorkedOn, 'Campaigns worked on is required');
      requireString(errors, 'resultsAchieved', values.resultsAchieved, 'Results achieved is required');
    }

    if (!isBlank(values.portfolioUrl)) requireUrl(errors, 'portfolioUrl', values.portfolioUrl, 'Portfolio URL is required');
    if (!options.hasPortfolioFile && !isBlank(values.portfolioWorkSamples)) {
      requireUrl(errors, 'portfolioWorkSamples', values.portfolioWorkSamples, 'Portfolio link is required');
    }

    return errors;
  }

  if (jobFormType === 'content-social') {
    requireUrl(errors, 'socialMediaPageUrl', values.socialMediaPageUrl, 'Social media page URL is required');

    if (!options.hasPortfolioFile) {
      requireUrl(errors, 'portfolioWorkSamples', values.portfolioWorkSamples, 'Portfolio or work samples link is required');
    }

    if (!isBlank(values.contentSamplesLink)) {
      requireUrl(errors, 'contentSamplesLink', values.contentSamplesLink, 'Content samples link is required');
    }

    requireString(errors, 'contentCreated', values.contentCreated, 'Please describe content you have created');
    requireString(errors, 'proudContentOrCampaign', values.proudContentOrCampaign, 'This field is required');

    if (!values.socialMediaPlatforms?.length) {
      errors.socialMediaPlatforms = 'Select at least one social media platform';
    }
    if (!values.contentCreationSkills?.length) {
      errors.contentCreationSkills = 'Select at least one content creation skill';
    }

    if (options.isIntern) {
      requireString(errors, 'currentQualification', values.currentQualification, 'Current qualification is required');
      requireString(errors, 'collegeUniversity', values.collegeUniversity, 'College or university is required');
    } else {
      requireString(errors, 'managedPages', values.managedPages, 'Please list social media pages you have managed');
    }

    return errors;
  }

  if (jobFormType === 'legacy-smm') {
    requireString(errors, 'currentQualification', values.currentQualification, 'Current qualification is required');
    requireString(errors, 'collegeUniversity', values.collegeUniversity, 'College or university is required');
    requireUrl(errors, 'portfolioWorkSamples', values.portfolioWorkSamples, 'Portfolio or work samples link is required');
    requireString(errors, 'internshipExperience', values.internshipExperience, 'Internship experience is required');

    if (!values.socialMediaPlatforms?.length) {
      errors.socialMediaPlatforms = 'Select at least one social media platform';
    }
    if (!values.contentCreationSkills?.length) {
      errors.contentCreationSkills = 'Select at least one content creation skill';
    }

    return errors;
  }

  requireUrl(errors, 'portfolioUrl', values.portfolioUrl, 'Portfolio URL is required');
  requireString(errors, 'educationStatus', values.educationStatus, 'Education status is required');
  requireString(errors, 'degreeDiscipline', values.degreeDiscipline, 'Degree discipline is required');
  requireString(errors, 'internshipExperience', values.internshipExperience, 'Experience information is required');
  requireString(
    errors,
    'aiMlProjects',
    values.aiMlProjects,
    isMernInternJob(options.jobId) || isMernFullTimeJob(options.jobId)
      ? 'MERN / React Native projects information is required'
      : 'AI/ML projects information is required'
  );

  if (requiresYearOfPassingOut(options.jobId)) {
    requireString(errors, 'yearOfPassingOut', values.yearOfPassingOut, 'Year of passing out is required');
  }

  if (isEngineeringInternJob(options.jobId)) {
    requireString(errors, 'duration', values.duration, 'Duration is required');
  }

  return errors;
}
