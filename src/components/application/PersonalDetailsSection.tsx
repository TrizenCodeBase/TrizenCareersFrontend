import { Input } from '@/components/ui/input';
import { FileText } from 'lucide-react';
import type { FormFieldComponent, MarketingFormSectionProps } from './types';

type PersonalDetailsSectionProps = Pick<
  MarketingFormSectionProps,
  | 'application'
  | 'fieldErrors'
  | 'resumeFile'
  | 'setResumeFile'
  | 'resumeUploadError'
  | 'setResumeUploadError'
  | 'setApplication'
  | 'setFieldErrors'
  | 'handleInputChange'
  | 'handleInputBlur'
> & {
  FormField: FormFieldComponent;
};

export function PersonalDetailsSection({
  application,
  fieldErrors,
  FormField,
  handleInputChange,
  handleInputBlur,
  resumeFile,
  setResumeFile,
  resumeUploadError,
  setResumeUploadError,
  setApplication,
  setFieldErrors
}: PersonalDetailsSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField fieldName="fullName" label="Full Name" required>
          <Input
            id="fullName"
            name="fullName"
            value={application.fullName}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            required
            className={fieldErrors.fullName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
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
            className={fieldErrors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            placeholder="+91 98765 43210"
          />
        </FormField>

        <FormField fieldName="location" label="Location / City" required>
          <Input
            id="location"
            name="location"
            value={application.location}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="e.g., Hyderabad or Remote"
            required
            className={fieldErrors.location ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
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
            className={fieldErrors.linkedinProfile ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          />
        </FormField>

        <FormField fieldName="resumeLink" label="Resume" required>
          <div className="space-y-2">
            <div
              className={`flex items-center gap-3 p-3 border rounded-md bg-gray-50 ${
                fieldErrors.resumeLink ? 'border-red-500' : 'border-gray-300'
              }`}
            >
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
                    setApplication((prev) => ({ ...prev, resumeLink: '' }));
                    setFieldErrors((prev) => {
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
  );
}
