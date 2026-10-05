import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useApplication } from "@/contexts/ApplicationContext";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CalendarClock,
  Check,
  CheckCircle2,
  Clock,
  Hourglass,
  Link2,
  MapPin,
  Sparkles,
} from "lucide-react";
import jobsData from "@/data/jobs.json";
import { JobDescriptionContent } from "@/components/jobs/JobDescriptionContent";
import { ApplicationFormPanel } from "@/components/application/ApplicationFormPanel";
import { normalizeJobId } from "@/components/application/jobTypes";

type Job = (typeof jobsData.jobs)[number] & { status?: string };

const allJobs: Job[] = [
  ...jobsData.jobs,
  ...((jobsData as { archivedJobs?: Job[] }).archivedJobs ?? []),
];

const NICE_TO_HAVE_PREFIX = /^(nice to have|bonus|preferred(?: projects)?):\s*/i;

function splitRequirements(requirements: string[]) {
  const mustHave: string[] = [];
  const niceToHave: string[] = [];
  requirements.forEach((item) => {
    if (NICE_TO_HAVE_PREFIX.test(item)) niceToHave.push(item.replace(NICE_TO_HAVE_PREFIX, ""));
    else mustHave.push(item);
  });
  return { mustHave, niceToHave };
}

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="px-6 py-7 sm:px-8">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">{title}</h2>
      {children}
    </section>
  );
}

function CheckList({ items, muted = false }: { items: string[]; muted?: boolean }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span
            className={cn(
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
              muted ? "bg-gray-100 text-gray-500" : "bg-brand-accent text-brand-primary"
            )}
          >
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
          <span className={cn("leading-relaxed", muted ? "text-gray-600" : "text-gray-700")}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function OverviewRow({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
      <div className="min-w-0">
        <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
        <dd className="mt-0.5 text-sm font-medium text-gray-900">{value}</dd>
      </div>
    </div>
  );
}

const JobDetails = () => {
  const { jobId = "" } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { isJobApplied } = useApplication();
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    const foundJob = allJobs.find((j) => j.id === normalizeJobId(jobId));
    if (foundJob) {
      setJob(foundJob);
    } else {
      toast({
        title: "Job Not Found",
        description: "The job you're looking for doesn't exist.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [jobId, navigate, toast]);

  const isClosed = job?.status === "closed";
  const hasApplied = isJobApplied(jobId);
  const wantsApply = searchParams.get("apply") === "1";
  const isApplyOpen = wantsApply && !isClosed;

  const openApply = () => setSearchParams({ apply: "1" }, { replace: true });
  const closeApply = useCallback(() => setSearchParams({}, { replace: true }), [setSearchParams]);

  // Checked only when the dialog opens, so the success screen stays visible after submitting.
  useEffect(() => {
    if (wantsApply && isJobApplied(jobId)) closeApply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wantsApply]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href.split("?")[0]);
      toast({ title: "Link copied", description: "Share it with anyone who might be a good fit." });
    } catch {
      toast({ title: "Could not copy link", variant: "destructive" });
    }
  };

  if (!job) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
      </div>
    );
  }

  const { mustHave, niceToHave } = splitRequirements(job.requirements);

  const applyAction = (className?: string, onDark = false) => {
    if (isClosed) {
      return (
        <Button disabled className={cn("w-full", className)}>
          Applications closed
        </Button>
      );
    }
    if (hasApplied) {
      return (
        <Button disabled variant="outline" className={cn("w-full gap-2", onDark && "border-white/30 bg-white/10 text-white", className)}>
          <CheckCircle2 className="h-4 w-4" />
          Applied
        </Button>
      );
    }
    if (!isAuthenticated) {
      return (
        <Button asChild className={cn("w-full", onDark ? "bg-white text-brand-primary hover:bg-white/90" : "bg-brand-primary hover:bg-brand-primary/90", className)}>
          <Link to="/auth">Log in to apply</Link>
        </Button>
      );
    }
    return (
      <Button
        onClick={openApply}
        className={cn("w-full", onDark ? "bg-white text-brand-primary hover:bg-white/90" : "bg-brand-primary hover:bg-brand-primary/90", className)}
      >
        Apply now
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-br from-brand-primary via-[#0b1280] to-[#1d3aa8] text-white">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            All jobs
          </Link>

          <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 ring-1 ring-white/20">
                <Sparkles className="h-3.5 w-3.5" />
                {job.category}
              </span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{job.title}</h1>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4" />
                  {job.type}
                </span>
                {job.postedDate && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    Posted {formatDate(job.postedDate)}
                  </span>
                )}
              </div>
            </div>
            <div className="hidden w-48 shrink-0 lg:block">{applyAction("h-11 text-base font-semibold", true)}</div>
          </div>
        </div>
      </header>

      <div className="mx-auto -mt-8 max-w-6xl px-4 pb-28 sm:px-6 lg:pb-16">
        <div className="grid gap-6 lg:grid-cols-3">
          <main className="divide-y divide-gray-100 rounded-2xl border border-gray-200/80 bg-white shadow-sm lg:col-span-2">
            <Section title="About the role">
              <JobDescriptionContent description={job.description} applicationPrompt={job.applicationPrompt} />
            </Section>

            <Section title="What you'll do">
              <CheckList items={job.responsibilities} />
            </Section>

            <Section title="What we're looking for">
              <CheckList items={mustHave} />
              {niceToHave.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Nice to have</h3>
                  <CheckList items={niceToHave} muted />
                </div>
              )}
            </Section>

            {job.tags.length > 0 && (
              <Section title="Skills & tools">
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-brand-primary/15 bg-brand-accent/60 px-3 py-1 text-sm text-brand-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            <Section title="What you'll get">
              <CheckList items={job.benefits} />
            </Section>

            {job.selectionProcess?.length > 0 && (
              <Section title="Selection process">
                <ol className="relative space-y-5">
                  {job.selectionProcess.map((step, index) => (
                    <li key={step} className="relative flex items-start gap-4">
                      {index < job.selectionProcess.length - 1 && (
                        <span className="absolute left-4 top-9 h-[calc(100%-1rem)] w-px bg-gray-200" aria-hidden />
                      )}
                      <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-semibold text-white">
                        {index + 1}
                      </span>
                      <span className="pt-1 text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </Section>
            )}
          </main>

          <aside className="space-y-4 self-start lg:sticky lg:top-6">
            <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900">Job overview</h2>
              <dl className="mt-2 divide-y divide-gray-100">
                <OverviewRow icon={Briefcase} label="Employment type" value={job.type} />
                <OverviewRow icon={MapPin} label="Location" value={job.location} />
                <OverviewRow icon={Hourglass} label="Duration" value={job.duration} />
                <OverviewRow icon={Clock} label="Start date" value={job.startDate} />
                <OverviewRow icon={CalendarClock} label="Apply by" value={job.applicationDeadline} />
              </dl>
              <div className="mt-4 hidden lg:block">{applyAction("h-11 font-semibold")}</div>
            </div>

            <button
              type="button"
              onClick={copyLink}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200/80 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              <Link2 className="h-4 w-4" />
              Copy job link
            </button>
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">{job.title}</p>
            <p className="truncate text-xs text-gray-500">{job.location}</p>
          </div>
          <div className="w-40 shrink-0">{applyAction("h-10 font-semibold")}</div>
        </div>
      </div>

      <Dialog open={isApplyOpen} onOpenChange={(open) => !open && closeApply()}>
        <DialogContent
          className="flex max-h-[92vh] w-[calc(100vw-1.5rem)] max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:rounded-2xl"
          onInteractOutside={(event) => event.preventDefault()}
        >
          <DialogHeader className="space-y-1 border-b px-6 py-5 pr-12 text-left">
            <DialogTitle className="text-xl">Apply for {job.title}</DialogTitle>
            <DialogDescription>
              {job.location} · {job.type} · {job.duration}
            </DialogDescription>
          </DialogHeader>
          {isApplyOpen && <ApplicationFormPanel jobId={jobId} onClose={closeApply} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobDetails;
