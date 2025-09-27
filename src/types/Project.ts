export interface Project {
  id?: string; // Firestore document ID (optional for creation)
  userId: string; // Clerk user ID
  repo: {
    id: string; // GitHub repo ID
    name: string;
    owner: string;
    url: string;
    description?: string;
    language?: string;
    isPrivate: boolean;
  };
  automation: {
    type: string; // e.g., "daily-summary", "pr-notifications"
    frequency: string; // e.g., "daily", "weekly", "on-event"
    cronSchedule?: string; // cron expression for scheduling
    recipients: string[]; // array of email addresses
    status: 'active' | 'paused';
    lastRun?: string; // ISO date string
    nextRun?: string; // ISO date string
    emailsSent: number;
  };
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface CreateProjectRequest {
  repoId: string;
  automationType: string;
  frequency: string;
  customSchedule?: string;
  recipients: string[];
}

export interface Activity {
  id?: string;
  projectId: string;
  type: 'email_sent' | 'error' | 'commit' | 'pr_created' | 'issue_created' | 'subscriber_added';
  title: string;
  description: string;
  time: string; // ISO date string
  status: 'success' | 'error' | 'info';
}