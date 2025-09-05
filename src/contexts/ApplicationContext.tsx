import React, { createContext, useContext, useState, useEffect } from 'react';

interface ApplicationContextType {
  appliedJobs: Set<string>;
  markJobAsApplied: (jobId: string) => void;
  isJobApplied: (jobId: string) => boolean;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());

  // Load applied jobs from localStorage on mount
  useEffect(() => {
    const savedAppliedJobs = localStorage.getItem('appliedJobs');
    if (savedAppliedJobs) {
      try {
        const parsedJobs = JSON.parse(savedAppliedJobs);
        setAppliedJobs(new Set(parsedJobs));
      } catch (error) {
        console.error('Error loading applied jobs from localStorage:', error);
      }
    }
  }, []);

  // Save applied jobs to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('appliedJobs', JSON.stringify(Array.from(appliedJobs)));
  }, [appliedJobs]);

  const markJobAsApplied = (jobId: string) => {
    setAppliedJobs(prev => new Set([...prev, jobId]));
  };

  const isJobApplied = (jobId: string) => {
    return appliedJobs.has(jobId);
  };

  return (
    <ApplicationContext.Provider value={{
      appliedJobs,
      markJobAsApplied,
      isJobApplied
    }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplication = () => {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplication must be used within an ApplicationProvider');
  }
  return context;
};
