import type { ChangeEvent, Dispatch, FocusEvent, ReactNode, SetStateAction } from 'react';

export interface MarketingApplicationFields {
  socialMediaPageUrl?: string;
  contentSamplesLink?: string;
  contentCreated?: string;
  proudContentOrCampaign?: string;
  managedPages?: string;
  campaignsWorkedOn?: string;
  marketingToolsUsed?: string;
  resultsAchieved?: string;
  projectsOrActivities?: string;
  growthMarketingInterest?: string;
  campaignOrEventOrganized?: string;
  portfolioUrl?: string;
  portfolioWorkSamples?: string;
  currentQualification?: string;
  collegeUniversity?: string;
  socialMediaPlatforms?: string[];
  contentCreationSkills?: string[];
  preferredStartDate?: string;
  hoursPerWeek?: string;
  workPreference?: string;
  motivation?: string;
  expectedStipend?: string;
}

export interface GenAiApplicationFields {
  portfolioUrl?: string;
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

export interface FieldErrors {
  [key: string]: string;
}

export type FormFieldComponent = (props: {
  fieldName: string;
  label: string;
  children: ReactNode;
  required?: boolean;
}) => ReactNode;

export interface MarketingFormSectionProps {
  application: MarketingApplicationFields & {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedinProfile: string;
    resumeLink: string;
  };
  fieldErrors: FieldErrors;
  FormField: FormFieldComponent;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleInputBlur: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCheckboxChange: (fieldName: string, value: string, checked: boolean) => void;
  resumeFile: File | null;
  setResumeFile: (file: File | null) => void;
  resumeUploadError: string | null;
  setResumeUploadError: (error: string | null) => void;
  portfolioSampleFile: File | null;
  setPortfolioSampleFile: (file: File | null) => void;
  portfolioUploadError: string | null;
  setPortfolioUploadError: (error: string | null) => void;
  setApplication: Dispatch<SetStateAction<MarketingApplicationFields & Record<string, unknown>>>;
  setFieldErrors: Dispatch<SetStateAction<FieldErrors>>;
  isIntern: boolean;
  isBusinessDevelopment?: boolean;
  isTelecallingOutreach?: boolean;
  isHealthcareMarketing?: boolean;
}

export interface GenAiFormSectionProps {
  application: GenAiApplicationFields & {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedinProfile: string;
    resumeLink: string;
  };
  fieldErrors: FieldErrors;
  FormField: FormFieldComponent;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleInputBlur: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCheckboxChange: (fieldName: string, value: string, checked: boolean) => void;
  resumeFile: File | null;
  setResumeFile: (file: File | null) => void;
  resumeUploadError: string | null;
  setResumeUploadError: (error: string | null) => void;
  setApplication: Dispatch<SetStateAction<GenAiApplicationFields & Record<string, unknown>>>;
  setFieldErrors: Dispatch<SetStateAction<FieldErrors>>;
}
