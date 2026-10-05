import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';
import { ENV_CONFIG } from '@/config/environment';
import type { FieldErrors, FormFieldComponent, HackathonApplicationFields } from './types';

const HACKATHON_NAME = 'AI HACK X MRDU 2026';
const OTHER_STATEMENT = '__other__';

const TRACK_NAMES: Record<string, string> = {
  'ui-ux': 'UI/UX Design',
  'web-dev': 'Web Development',
  'vibe-coding': 'Vibe Coding',
  'agentic-ai': 'Agentic AI'
};

interface ProblemStatementOption {
  id: string;
  title: string;
  domainId: string;
}

type LoadState = 'idle' | 'loading' | 'loaded' | 'error';

const selectClass = (hasError: boolean) =>
  `w-full px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent ${
    hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
  }`;

interface HackathonParticipationSectionProps {
  application: HackathonApplicationFields;
  fieldErrors: FieldErrors;
  FormField: FormFieldComponent;
  updateHackathonFields: (fields: Partial<HackathonApplicationFields>) => void;
}

export function HackathonParticipationSection({
  application,
  fieldErrors,
  FormField,
  updateHackathonFields
}: HackathonParticipationSectionProps) {
  const [statements, setStatements] = useState<ProblemStatementOption[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [manualEntry, setManualEntry] = useState(false);

  const isFromHackathon = application.fromHackathon === 'yes';

  useEffect(() => {
    if (!isFromHackathon || loadState !== 'idle') return;
    if (!ENV_CONFIG.HACKATHON_API_BASE_URL) {
      setLoadState('error');
      return;
    }

    setLoadState('loading');
    fetch(`${ENV_CONFIG.HACKATHON_API_BASE_URL}/api/hackathon/problem-statements`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data: { statements?: ProblemStatementOption[] }) => {
        setStatements(Array.isArray(data.statements) ? data.statements : []);
        setLoadState('loaded');
      })
      .catch((error) => {
        console.warn('Could not load hackathon problem statements:', error);
        setLoadState('error');
      });
  }, [isFromHackathon, loadState]);

  const showStatementList = loadState === 'loaded' && statements.length > 0;
  const showManualInput = loadState === 'error' || (loadState === 'loaded' && statements.length === 0) || manualEntry;

  const statementsByTrack = statements.reduce<Record<string, ProblemStatementOption[]>>((groups, statement) => {
    const track = TRACK_NAMES[statement.domainId] || 'Other';
    (groups[track] ||= []).push(statement);
    return groups;
  }, {});

  const handleFromHackathonChange = (value: string) => {
    if (value === 'no') {
      setManualEntry(false);
      updateHackathonFields({
        fromHackathon: 'no',
        hackathonTeamName: '',
        hackathonResult: '',
        hackathonProblemStatementId: '',
        hackathonProblemStatementTitle: ''
      });
      return;
    }
    updateHackathonFields({ fromHackathon: value });
  };

  const handleStatementSelect = (value: string) => {
    if (value === OTHER_STATEMENT) {
      setManualEntry(true);
      updateHackathonFields({ hackathonProblemStatementId: '', hackathonProblemStatementTitle: '' });
      return;
    }
    setManualEntry(false);
    const statement = statements.find((item) => item.id === value);
    updateHackathonFields({
      hackathonProblemStatementId: statement?.id || '',
      hackathonProblemStatementTitle: statement?.title || ''
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Hackathon Participation</h3>

      <FormField fieldName="fromHackathon" label={`Did you take part in the ${HACKATHON_NAME} hackathon?`} required>
        <RadioGroup
          value={application.fromHackathon || ''}
          onValueChange={handleFromHackathonChange}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="fromHackathon-yes" />
            <Label htmlFor="fromHackathon-yes" className="text-sm font-normal">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="fromHackathon-no" />
            <Label htmlFor="fromHackathon-no" className="text-sm font-normal">No</Label>
          </div>
        </RadioGroup>
      </FormField>

      {isFromHackathon && (
        <>
          <FormField fieldName="hackathonTeamName" label="Team name" required>
            <Input
              id="hackathonTeamName"
              value={application.hackathonTeamName || ''}
              onChange={(e) => updateHackathonFields({ hackathonTeamName: e.target.value })}
              placeholder="The team name you registered with"
              maxLength={100}
              className={fieldErrors.hackathonTeamName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            />
          </FormField>

          <FormField fieldName="hackathonResult" label="Were you a winner or a participant?" required>
            <RadioGroup
              value={application.hackathonResult || ''}
              onValueChange={(value) => updateHackathonFields({ hackathonResult: value })}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="winner" id="hackathonResult-winner" />
                <Label htmlFor="hackathonResult-winner" className="text-sm font-normal">Winner</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="participant" id="hackathonResult-participant" />
                <Label htmlFor="hackathonResult-participant" className="text-sm font-normal">Participant</Label>
              </div>
            </RadioGroup>
          </FormField>

          <FormField fieldName="hackathonProblemStatementTitle" label="Which problem statement did your team work on?" required>
            <div className="space-y-3">
              {loadState === 'loading' && (
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading problem statements...
                </p>
              )}

              {showStatementList && (
                <select
                  id="hackathonProblemStatementId"
                  value={manualEntry ? OTHER_STATEMENT : application.hackathonProblemStatementId || ''}
                  onChange={(e) => handleStatementSelect(e.target.value)}
                  className={selectClass(Boolean(fieldErrors.hackathonProblemStatementTitle) && !manualEntry)}
                >
                  <option value="">Select your problem statement</option>
                  {Object.entries(statementsByTrack).map(([track, items]) => (
                    <optgroup key={track} label={track}>
                      {items.map((statement) => (
                        <option key={statement.id} value={statement.id}>
                          {statement.title} ({statement.id})
                        </option>
                      ))}
                    </optgroup>
                  ))}
                  <option value={OTHER_STATEMENT}>My problem statement isn't listed</option>
                </select>
              )}

              {showManualInput && (
                <Input
                  id="hackathonProblemStatementTitle"
                  value={application.hackathonProblemStatementTitle || ''}
                  onChange={(e) => updateHackathonFields({ hackathonProblemStatementTitle: e.target.value })}
                  placeholder="Enter the problem statement title (and ID, if you remember it)"
                  className={fieldErrors.hackathonProblemStatementTitle ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                />
              )}
            </div>
          </FormField>
        </>
      )}
    </div>
  );
}
