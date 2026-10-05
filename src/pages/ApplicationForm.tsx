import { Navigate, useParams } from "react-router-dom";

/** Old /application/:jobId links now open the apply dialog on the job details page. */
const ApplicationForm = () => {
  const { jobId } = useParams();
  return <Navigate to={jobId ? `/jobs/${jobId}?apply=1` : "/"} replace />;
};

export default ApplicationForm;
