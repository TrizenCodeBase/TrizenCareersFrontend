import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Auth from "./pages/Auth";
import JobDetails from "./pages/JobDetails";
import ApplicationForm from "./pages/ApplicationForm";
import EmailTest from "./pages/EmailTest";
import { AuthProvider } from './contexts/AuthContext';
import { ApplicationProvider } from './contexts/ApplicationContext';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <AuthProvider>
      <ApplicationProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/jobs/:jobId" element={<JobDetails />} />
            <Route path="/application/:jobId" element={<ApplicationForm />} />
            <Route path="/email-test" element={<EmailTest />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </ApplicationProvider>
    </AuthProvider>
  );
}

export default App;
