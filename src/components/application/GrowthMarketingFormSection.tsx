import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';
import { PersonalDetailsSection } from './PersonalDetailsSection';
import type { MarketingFormSectionProps } from './types';

export function GrowthMarketingFormSection(props: MarketingFormSectionProps) {
  const {
    application,
    fieldErrors,
    FormField,
    handleInputChange,
    handleInputBlur,
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

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          {isIntern ? 'Projects & Interest' : 'Campaign Experience'}
        </h3>

        {!isIntern && (
          <FormField fieldName="campaignsWorkedOn" label="Campaigns You've Worked On" required>
            <Textarea
              id="campaignsWorkedOn"
              name="campaignsWorkedOn"
              value={application.campaignsWorkedOn || ''}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder="Describe campaigns you've planned or executed (channels, goals, audience, etc.)"
              required
              className={fieldErrors.campaignsWorkedOn ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
              rows={4}
            />
          </FormField>
        )}

        {isIntern && (
          <>
            <FormField fieldName="projectsOrActivities" label="Projects, Internships, or Activities" required>
              <Textarea
                id="projectsOrActivities"
                name="projectsOrActivities"
                value={application.projectsOrActivities || ''}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder="Share relevant college projects, internships, clubs, or marketing activities"
                required
                className={fieldErrors.projectsOrActivities ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                rows={4}
              />
            </FormField>

            <FormField fieldName="growthMarketingInterest" label="Why Growth Marketing?" required>
              <Textarea
                id="growthMarketingInterest"
                name="growthMarketingInterest"
                value={application.growthMarketingInterest || ''}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder="Why are you interested in growth marketing and startups?"
                required
                className={fieldErrors.growthMarketingInterest ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                rows={3}
              />
            </FormField>

            <FormField fieldName="campaignOrEventOrganized" label="Campaign, Event, or Initiative You've Helped Organize" required>
              <Textarea
                id="campaignOrEventOrganized"
                name="campaignOrEventOrganized"
                value={application.campaignOrEventOrganized || ''}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder="Describe any marketing campaign, college event, or growth initiative you contributed to"
                required
                className={fieldErrors.campaignOrEventOrganized ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                rows={3}
              />
            </FormField>
          </>
        )}

        <FormField fieldName="marketingToolsUsed" label="Tools & Platforms Used" required>
          <Textarea
            id="marketingToolsUsed"
            name="marketingToolsUsed"
            value={application.marketingToolsUsed || ''}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="e.g., Meta Ads, Google Ads, Google Analytics, HubSpot, Excel, WhatsApp campaigns"
            required
            className={fieldErrors.marketingToolsUsed ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            rows={3}
          />
        </FormField>

        {!isIntern && (
          <FormField fieldName="resultsAchieved" label="Results Achieved (metrics)" required>
            <Textarea
              id="resultsAchieved"
              name="resultsAchieved"
              value={application.resultsAchieved || ''}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder="Share leads generated, conversions, ROAS, growth %, or other measurable outcomes"
              required
              className={fieldErrors.resultsAchieved ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
              rows={4}
            />
          </FormField>
        )}
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Portfolio & Work Samples</h3>

        <FormField fieldName="portfolioUrl" label="Portfolio / Case Studies URL (optional)">
          <Input
            id="portfolioUrl"
            name="portfolioUrl"
            value={application.portfolioUrl || ''}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="https://notion.so/your-case-studies or https://yourwebsite.com"
            className={fieldErrors.portfolioUrl ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          />
        </FormField>

        <FormField fieldName="portfolioWorkSamples" label="Work Samples Link or Upload (optional)">
          <div className="space-y-3">
            <Input
              id="portfolioWorkSamples"
              name="portfolioWorkSamples"
              value={application.portfolioWorkSamples || ''}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder="https://drive.google.com/... (campaign decks, screenshots, reports)"
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
            <p className="text-xs text-gray-500">Paste a shareable link or upload PDF/images (max 5MB).</p>
            {portfolioUploadError && <p className="text-sm text-red-600">{portfolioUploadError}</p>}
          </div>
        </FormField>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Availability & Compensation</h3>

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

        <FormField
          fieldName="motivation"
          label={isIntern ? 'Why do you want to join Trizen?' : 'Why are you interested in this role?'}
          required
        >
          <Textarea
            id="motivation"
            name="motivation"
            value={application.motivation || ''}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="Tell us what excites you about this opportunity"
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
            placeholder={isIntern ? 'e.g., 8000' : 'e.g., 35000'}
            required
            className={fieldErrors.expectedStipend ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          />
        </FormField>
      </div>
    </>
  );
}
