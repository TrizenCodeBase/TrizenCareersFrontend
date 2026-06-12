interface JobDescriptionContentProps {
  description: string;
  shortDescription?: string;
  applicationPrompt?: string;
}

export function JobDescriptionContent({
  description,
  shortDescription,
  applicationPrompt
}: JobDescriptionContentProps) {
  return (
    <div className="space-y-5">
      {shortDescription && (
        <p className="text-base text-gray-800 font-medium leading-relaxed">{shortDescription}</p>
      )}
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{description}</p>
      {applicationPrompt && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-900 mb-2">When applying, please share</p>
          <p className="text-sm text-blue-800 leading-relaxed">{applicationPrompt}</p>
        </div>
      )}
    </div>
  );
}
