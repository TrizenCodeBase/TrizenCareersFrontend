import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';
import { PersonalDetailsSection } from './PersonalDetailsSection';
import type { MarketingFormSectionProps } from './types';

const SOCIAL_PLATFORMS = ['Instagram', 'LinkedIn', 'Facebook', 'YouTube', 'Twitter/X', 'Other'];
const CONTENT_SKILLS = ['Writing', 'Reels / Short Video', 'Graphics', 'Canva', 'CapCut', 'Photography', 'Other'];

export function ContentSocialMediaFormSection(props: MarketingFormSectionProps) {
  const {
    application,
    fieldErrors,
    FormField,
    handleInputChange,
    handleInputBlur,
    handleCheckboxChange,
    portfolioSampleFile,
    setPortfolioSampleFile,
    portfolioUploadError,
    setPortfolioUploadError,
    setApplication,
    setFieldErrors,
    isIntern
  } = props;

  return (
    <>
      <PersonalDetailsSection {...props} />

      {isIntern && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Education</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField fieldName="currentQualification" label="Current Qualification / Year of Study" required>
              <Input
                id="currentQualification"
                name="currentQualification"
                value={application.currentQualification || ''}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder="e.g., BBA 2nd Year"
                required
                className={fieldErrors.currentQualification ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
              />
            </FormField>

            <FormField fieldName="collegeUniversity" label="College / University" required>
              <Input
                id="collegeUniversity"
                name="collegeUniversity"
                value={application.collegeUniversity || ''}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder="Your college or university name"
                required
                className={fieldErrors.collegeUniversity ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
              />
            </FormField>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Social & Portfolio Links</h3>

        <FormField
          fieldName="socialMediaPageUrl"
          label={isIntern ? 'Your Portfolio or Social Media Page' : 'Primary Social Media Page / Handle'}
          required
        >
          <Input
            id="socialMediaPageUrl"
            name="socialMediaPageUrl"
            value={application.socialMediaPageUrl || ''}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="https://instagram.com/yourpage or https://linkedin.com/in/you"
            required
            className={fieldErrors.socialMediaPageUrl ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          />
        </FormField>

        {!isIntern && (
          <FormField fieldName="managedPages" label="Social Media Pages You've Managed" required>
            <Textarea
              id="managedPages"
              name="managedPages"
              value={application.managedPages || ''}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder="List pages/accounts you've managed with links and brief context"
              required
              className={fieldErrors.managedPages ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
              rows={3}
            />
          </FormField>
        )}

        <FormField fieldName="portfolioWorkSamples" label="Portfolio / Reels / Work Samples" required>
          <div className="space-y-3">
            <Input
              id="portfolioWorkSamples"
              name="portfolioWorkSamples"
              value={application.portfolioWorkSamples || ''}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder="https://drive.google.com/... or https://behance.net/..."
              required
              className={fieldErrors.portfolioWorkSamples ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            />
            <div className="flex items-center gap-3 p-3 border rounded-md bg-gray-50 border-gray-300">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-brand-primary file:text-white file:cursor-pointer hover:file:opacity-90"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setPortfolioSampleFile(file || null);
                  setPortfolioUploadError(null);
                  if (file) {
                    setApplication((prev) => ({ ...prev, portfolioWorkSamples: '' }));
                    setFieldErrors((prev) => {
                      const next = { ...prev };
                      delete next.portfolioWorkSamples;
                      return next;
                    });
                  }
                }}
              />
              {portfolioSampleFile && (
                <span className="text-sm text-gray-600 flex items-center gap-1 shrink-0">
                  <FileText className="h-4 w-4" />
                  {portfolioSampleFile.name}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">Share a link or upload images/PDF of your best work (max 5MB).</p>
            {portfolioUploadError && <p className="text-sm text-red-600">{portfolioUploadError}</p>}
          </div>
        </FormField>

        <FormField fieldName="contentSamplesLink" label="Additional Content Samples Link (optional)">
          <Input
            id="contentSamplesLink"
            name="contentSamplesLink"
            value={application.contentSamplesLink || ''}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="https://youtube.com/... or another folder of reels/posts"
            className={fieldErrors.contentSamplesLink ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          />
        </FormField>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Skills & Content Experience</h3>

        <FormField fieldName="socialMediaPlatforms" label="Platforms You're Comfortable With" required>
          <div className="grid grid-cols-2 gap-2">
            {SOCIAL_PLATFORMS.map((platform) => (
              <div key={platform} className="flex items-center space-x-2">
                <Checkbox
                  id={`csm-platform-${platform}`}
                  checked={application.socialMediaPlatforms?.includes(platform) || false}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange('socialMediaPlatforms', platform, checked as boolean)
                  }
                />
                <Label htmlFor={`csm-platform-${platform}`} className="text-sm font-normal">
                  {platform}
                </Label>
              </div>
            ))}
          </div>
        </FormField>

        <FormField fieldName="contentCreationSkills" label="Content Creation Skills" required>
          <div className="grid grid-cols-2 gap-2">
            {CONTENT_SKILLS.map((skill) => (
              <div key={skill} className="flex items-center space-x-2">
                <Checkbox
                  id={`csm-skill-${skill}`}
                  checked={application.contentCreationSkills?.includes(skill) || false}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange('contentCreationSkills', skill, checked as boolean)
                  }
                />
                <Label htmlFor={`csm-skill-${skill}`} className="text-sm font-normal">
                  {skill}
                </Label>
              </div>
            ))}
          </div>
        </FormField>

        <FormField
          fieldName="contentCreated"
          label={isIntern ? "Content You've Created (posts, reels, designs)" : "Types of Content You've Created"}
          required
        >
          <Textarea
            id="contentCreated"
            name="contentCreated"
            value={application.contentCreated || ''}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="Describe posts, reels, videos, carousels, or designs you've created"
            required
            className={fieldErrors.contentCreated ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            rows={4}
          />
        </FormField>

        <FormField
          fieldName="proudContentOrCampaign"
          label={
            isIntern
              ? 'Creator or Brand You Admire (and why)'
              : "Campaign or Content You're Proud Of (and why)"
          }
          required
        >
          <Textarea
            id="proudContentOrCampaign"
            name="proudContentOrCampaign"
            value={application.proudContentOrCampaign || ''}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder={
              isIntern
                ? 'Share a creator/brand whose content inspires you and what you learn from them'
                : "Share one campaign or piece of content you're proud of and what made it successful"
            }
            required
            className={fieldErrors.proudContentOrCampaign ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            rows={4}
          />
        </FormField>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Availability</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField fieldName="preferredStartDate" label="Preferred Start Date" required>
            <Input
              id="preferredStartDate"
              name="preferredStartDate"
              type="date"
              value={application.preferredStartDate || ''}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required
              className={fieldErrors.preferredStartDate ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            />
          </FormField>

          {isIntern && (
            <FormField fieldName="hoursPerWeek" label="Hours Per Week (optional)">
              <Input
                id="hoursPerWeek"
                name="hoursPerWeek"
                value={application.hoursPerWeek || ''}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder="e.g., 20-30 hours"
                className={fieldErrors.hoursPerWeek ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
              />
            </FormField>
          )}

          <FormField fieldName="workPreference" label="Work Preference" required>
            <select
              id="workPreference"
              name="workPreference"
              value={application.workPreference || ''}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent ${
                fieldErrors.workPreference ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select your work preference</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
              <option value="Office">Office</option>
            </select>
          </FormField>
        </div>

        <FormField fieldName="motivation" label="Why do you want to join Trizen?" required>
          <Textarea
            id="motivation"
            name="motivation"
            value={application.motivation || ''}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="What draws you to this content & social media role?"
            required
            className={fieldErrors.motivation ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            rows={4}
          />
        </FormField>

        <FormField
          fieldName="expectedStipend"
          label={isIntern ? 'Expected Stipend (₹/month)' : 'Expected Compensation (₹/month)'}
          required
        >
          <Input
            id="expectedStipend"
            name="expectedStipend"
            type="number"
            value={application.expectedStipend || ''}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder={isIntern ? 'e.g., 8000' : 'e.g., 30000'}
            required
            className={fieldErrors.expectedStipend ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          />
        </FormField>
      </div>
    </>
  );
}
