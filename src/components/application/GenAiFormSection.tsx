import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';
import { MultiSelectField } from './MultiSelectField';
import type { GenAiFormSectionProps } from './types';

const AGENT_FRAMEWORKS = ['LangChain', 'LangGraph', 'AutoGen', 'CrewAI', 'Semantic Kernel', 'Other'];
const LLM_PLATFORMS = ['OpenAI GPT', 'Azure OpenAI', 'Claude', 'Llama', 'Hugging Face Transformers', 'Other'];
const VECTOR_DATABASES = ['Pinecone', 'Weaviate', 'FAISS', 'Chroma', 'pgvector', 'Other'];
const PLANNING_APPROACHES = ['ReAct', 'Plan-and-Execute', 'Tree-of-Thought', 'Reflection / Critic loops', 'None yet'];

const selectClass = (hasError: boolean) =>
  `w-full px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent ${
    hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
  }`;

const inputClass = (hasError: boolean) =>
  hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '';

export function GenAiFormSection({
  application,
  fieldErrors,
  FormField,
  handleInputChange,
  handleInputBlur,
  handleCheckboxChange,
  resumeFile,
  setResumeFile,
  resumeUploadError,
  setResumeUploadError,
  setApplication,
  setFieldErrors
}: GenAiFormSectionProps) {
  return (
    <>
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField fieldName="fullName" label="Full name" required>
            <Input
              id="fullName"
              name="fullName"
              value={application.fullName}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required
              placeholder="Your full name"
              className={inputClass(Boolean(fieldErrors.fullName))}
            />
          </FormField>

          <FormField fieldName="email" label="Email" required>
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

          <FormField fieldName="phone" label="Phone" required>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={application.phone}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required
              placeholder="+91 98765 43210"
              className={inputClass(Boolean(fieldErrors.phone))}
            />
          </FormField>

          <FormField fieldName="location" label="Location" required>
            <Input
              id="location"
              name="location"
              value={application.location}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required
              placeholder="City, country"
              className={inputClass(Boolean(fieldErrors.location))}
            />
          </FormField>

          <FormField fieldName="linkedinProfile" label="LinkedIn profile" required>
            <Input
              id="linkedinProfile"
              name="linkedinProfile"
              value={application.linkedinProfile}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required
              placeholder="https://linkedin.com/in/yourprofile"
              className={inputClass(Boolean(fieldErrors.linkedinProfile))}
            />
          </FormField>

          <FormField fieldName="portfolioUrl" label="GitHub or portfolio" required>
            <Input
              id="portfolioUrl"
              name="portfolioUrl"
              value={application.portfolioUrl || ''}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required
              placeholder="https://github.com/yourhandle"
              className={inputClass(Boolean(fieldErrors.portfolioUrl))}
            />
          </FormField>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Experience</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField fieldName="totalAiExperience" label="Total AI / ML experience" required>
            <select
              id="totalAiExperience"
              name="totalAiExperience"
              value={application.totalAiExperience || ''}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required
              className={selectClass(Boolean(fieldErrors.totalAiExperience))}
            >
              <option value="">Select experience</option>
              <option value="3-4 years">3–4 years</option>
              <option value="5-6 years">5–6 years</option>
              <option value="7-8 years">7–8 years</option>
              <option value="9-10 years">9–10 years</option>
            </select>
          </FormField>

          <FormField fieldName="agenticExperience" label="Experience with agentic systems" required>
            <select
              id="agenticExperience"
              name="agenticExperience"
              value={application.agenticExperience || ''}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required
              className={selectClass(Boolean(fieldErrors.agenticExperience))}
            >
              <option value="">Select experience</option>
              <option value="Less than 1 year">Less than 1 year</option>
              <option value="1-2 years">1–2 years</option>
              <option value="2-3 years">2–3 years</option>
              <option value="More than 3 years">More than 3 years</option>
            </select>
          </FormField>

          <FormField fieldName="currentTitle" label="Current job title" required>
            <Input
              id="currentTitle"
              name="currentTitle"
              value={application.currentTitle || ''}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required
              placeholder="e.g., Senior ML Engineer"
              className={inputClass(Boolean(fieldErrors.currentTitle))}
            />
          </FormField>

          <FormField fieldName="currentCompany" label="Current company">
            <Input
              id="currentCompany"
              name="currentCompany"
              value={application.currentCompany || ''}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder="Company name (or Freelance)"
              className={inputClass(Boolean(fieldErrors.currentCompany))}
            />
          </FormField>

          <FormField fieldName="highestDegree" label="Highest qualification" required>
            <select
              id="highestDegree"
              name="highestDegree"
              value={application.highestDegree || ''}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required
              className={selectClass(Boolean(fieldErrors.highestDegree))}
            >
              <option value="">Select qualification</option>
              <option value="Bachelor's - CS/AI">Bachelor's — CS / AI</option>
              <option value="Bachelor's - Other">Bachelor's — Other</option>
              <option value="Master's - CS/AI">Master's — CS / AI</option>
              <option value="Master's - Other">Master's — Other</option>
              <option value="PhD">PhD</option>
            </select>
          </FormField>

          <FormField fieldName="availabilityToStart" label="Available to start from" required>
            <Input
              id="availabilityToStart"
              name="availabilityToStart"
              type="date"
              value={application.availabilityToStart || ''}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required
              className={inputClass(Boolean(fieldErrors.availabilityToStart))}
            />
          </FormField>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Technical expertise</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField fieldName="agentFrameworks" label="Agent frameworks you have used" required>
            <MultiSelectField
              fieldName="agentFrameworks"
              options={AGENT_FRAMEWORKS}
              selected={application.agentFrameworks || []}
              placeholder="Select all that apply"
              hasError={Boolean(fieldErrors.agentFrameworks)}
              onToggle={handleCheckboxChange}
            />
          </FormField>

          <FormField fieldName="llmPlatforms" label="LLM platforms you have worked with" required>
            <MultiSelectField
              fieldName="llmPlatforms"
              options={LLM_PLATFORMS}
              selected={application.llmPlatforms || []}
              placeholder="Select all that apply"
              hasError={Boolean(fieldErrors.llmPlatforms)}
              onToggle={handleCheckboxChange}
            />
          </FormField>

          <FormField fieldName="vectorDatabases" label="Vector databases you have used">
            <MultiSelectField
              fieldName="vectorDatabases"
              options={VECTOR_DATABASES}
              selected={application.vectorDatabases || []}
              placeholder="Select all that apply"
              hasError={Boolean(fieldErrors.vectorDatabases)}
              onToggle={handleCheckboxChange}
            />
          </FormField>

          <FormField fieldName="planningApproaches" label="Agent planning approaches you have applied">
            <MultiSelectField
              fieldName="planningApproaches"
              options={PLANNING_APPROACHES}
              selected={application.planningApproaches || []}
              placeholder="Select all that apply"
              hasError={Boolean(fieldErrors.planningApproaches)}
              onToggle={handleCheckboxChange}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField fieldName="cloudPlatform" label="Primary cloud platform" required>
            <select
              id="cloudPlatform"
              name="cloudPlatform"
              value={application.cloudPlatform || ''}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required
              className={selectClass(Boolean(fieldErrors.cloudPlatform))}
            >
              <option value="">Select cloud platform</option>
              <option value="Azure">Azure (preferred)</option>
              <option value="AWS">AWS</option>
              <option value="GCP">GCP</option>
              <option value="Multiple">Multiple clouds</option>
              <option value="None">None yet</option>
            </select>
          </FormField>

          <FormField fieldName="devopsProficiency" label="Docker, Kubernetes and CI/CD level" required>
            <select
              id="devopsProficiency"
              name="devopsProficiency"
              value={application.devopsProficiency || ''}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required
              className={selectClass(Boolean(fieldErrors.devopsProficiency))}
            >
              <option value="">Select proficiency</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </FormField>
        </div>

        <FormField
          fieldName="systemExperience"
          label="Describe a RAG or multi-agent system you have built"
          required
        >
          <Textarea
            id="systemExperience"
            name="systemExperience"
            value={application.systemExperience || ''}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            required
            rows={5}
            placeholder="Approach, tools used, and the outcome or impact"
            className={inputClass(Boolean(fieldErrors.systemExperience))}
          />
        </FormField>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contract and availability</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField fieldName="timezone" label="Working timezone" required>
            <select
              id="timezone"
              name="timezone"
              value={application.timezone || ''}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required
              className={selectClass(Boolean(fieldErrors.timezone))}
            >
              <option value="">Select timezone</option>
              <option value="IST (UTC+5:30)">IST (UTC+5:30) — India</option>
              <option value="UTC (UTC+0)">UTC (UTC+0)</option>
              <option value="GMT (UTC+0)">GMT (UTC+0) — UK</option>
              <option value="CET (UTC+1)">CET (UTC+1) — Central Europe</option>
              <option value="EET (UTC+2)">EET (UTC+2) — Eastern Europe</option>
              <option value="GST (UTC+4)">GST (UTC+4) — Gulf</option>
              <option value="PKT (UTC+5)">PKT (UTC+5) — Pakistan</option>
              <option value="BST (UTC+6)">BST (UTC+6) — Bangladesh</option>
              <option value="ICT (UTC+7)">ICT (UTC+7) — Thailand / Vietnam</option>
              <option value="SGT (UTC+8)">SGT (UTC+8) — Singapore</option>
              <option value="JST (UTC+9)">JST (UTC+9) — Japan</option>
              <option value="AEST (UTC+10)">AEST (UTC+10) — Australia East</option>
              <option value="PST (UTC-8)">PST (UTC-8) — US Pacific</option>
              <option value="MST (UTC-7)">MST (UTC-7) — US Mountain</option>
              <option value="CST (UTC-6)">CST (UTC-6) — US Central</option>
              <option value="EST (UTC-5)">EST (UTC-5) — US Eastern</option>
              <option value="Other">Other</option>
            </select>
          </FormField>

          <FormField
            fieldName="contractCommitment"
            label="Can you commit to the full 3-month contract?"
            required
          >
            <select
              id="contractCommitment"
              name="contractCommitment"
              value={application.contractCommitment || ''}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required
              className={selectClass(Boolean(fieldErrors.contractCommitment))}
            >
              <option value="">Select an option</option>
              <option value="Yes">Yes, full 3 months</option>
              <option value="Partially">Partially available</option>
              <option value="No">No</option>
            </select>
          </FormField>

          <FormField
            fieldName="expectedMonthlyRate"
            label="Expected rate per month (₹)"
            required
          >
            <Input
              id="expectedMonthlyRate"
              name="expectedMonthlyRate"
              type="number"
              min={0}
              value={application.expectedMonthlyRate || ''}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required
              placeholder="e.g., 150000 per month"
              className={inputClass(Boolean(fieldErrors.expectedMonthlyRate))}
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter a monthly amount in rupees for this 3-month contract, not hourly or weekly.
            </p>
          </FormField>

          <FormField fieldName="applicationSource" label="How did you hear about this role?">
            <select
              id="applicationSource"
              name="applicationSource"
              value={application.applicationSource || ''}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className={selectClass(Boolean(fieldErrors.applicationSource))}
            >
              <option value="">Select a source</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Naukri">Naukri</option>
              <option value="Referral">Referral</option>
              <option value="Trizen website">Trizen website</option>
              <option value="Other">Other</option>
            </select>
          </FormField>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Documents</h3>

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
                <span className="text-sm text-gray-600 flex items-center gap-1 shrink-0">
                  <FileText className="h-4 w-4" />
                  {resumeFile.name}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">PDF, DOC or DOCX. Max 5MB.</p>
            {resumeUploadError && <p className="text-sm text-red-600">{resumeUploadError}</p>}
          </div>
        </FormField>

        <FormField fieldName="coverNote" label="Why you are a fit for this role">
          <Textarea
            id="coverNote"
            name="coverNote"
            value={application.coverNote || ''}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            rows={4}
            placeholder="Optional — a short note on why this contract suits you"
            className={inputClass(Boolean(fieldErrors.coverNote))}
          />
        </FormField>
      </div>
    </>
  );
}
