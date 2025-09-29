import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getFirestoreDb } from '@/lib/firebase-admin';
import { Project, CreateProjectRequest } from '@/types/Project';
import GithubService from '@/app/backend/Services/Github.service';
import clerk from '@clerk/clerk-sdk-node'
import CronJobService from '@/app/backend/Services/CronJob.service';


export async function POST(request: NextRequest) {
  try {
     const { isAuthenticated, userId } = await auth();
        if (!isAuthenticated) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const tokens = await clerk.users.getUserOauthAccessToken(userId, "oauth_github");
        // Get the token from the request headers
        const token = tokens[0].token;

    const body: CreateProjectRequest = await request.json();
    const { repoId, automationType, frequency, customSchedule, recipients } = body;

    // Validation
    if (!repoId || !automationType || !frequency || !recipients || recipients.length === 0) {
      return NextResponse.json({ 
        error: 'Missing required fields: repoId, automationType, frequency, and recipients are required' 
      }, { status: 400 });
    }

    // Validate email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = recipients.filter(email => !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      return NextResponse.json({ 
        error: `Invalid email addresses: ${invalidEmails.join(', ')}` 
      }, { status: 400 });
    }

    // Get repository information from GitHub API
    const repo = await GithubService.findRepo(token, repoId);


    

    // Calculate next run time
    const now = new Date();
    const nextRun = new Date();
    
    function fromFrequencyToCron(frequency: string, customSchedule?: string): string | null {
      switch (frequency) {
        case 'daily':
          return '0 9 * * *'; // every day at 9 AM
        case 'weekly':
          return '0 9 * * 1'; // every Monday at 9 AM
        case 'monthly':
          return '0 9 1 * *'; // first day of month at 9 AM
        case 'custom':
          return customSchedule || null; // use custom cron expression
        case 'on-event':
          return null; // no scheduled run
        default:
          return null;
      }
    }

    // Create project object - avoid undefined values for Firestore
    const projectData: Omit<Project, 'id'> = {
      userId,
      repo: repo,
      userToken: token,
      automation: {
        type: automationType,
        cronSchedule: fromFrequencyToCron(frequency, customSchedule) || '',
        frequency,
        recipients,
        status: 'active',
        emailsSent: 0
      },
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };



    if (frequency !== 'on-event') {
      projectData.automation.nextRun = nextRun.toISOString();
    }

    // Save to Firestore
    const db = getFirestoreDb();
    const docRef = await db.collection('projects').add(projectData);

    // Return the created project with its ID
    const createdProject: Project = {
      id: docRef.id,
      ...(projectData as Omit<Project, 'id'>)
    };

    // Create activity log
    await db.collection('activity').add({
      projectId: docRef.id,
      type: 'project_created',
      title: 'Project created',
      description: `New automation set up for ${repo.owner}/${repo.name}`,
      time: now.toISOString(),
      status: 'success'
    });

    // register cron job
    await CronJobService.register(docRef.id, projectData.automation.cronSchedule!);



    return NextResponse.json({ 
      message: 'Project created successfully', 
      project: createdProject 
    }, { status: 201 });

  } catch (error: unknown) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getFirestoreDb();
    const snapshot = await db.collection('projects')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const projects: Project[] = [];
    snapshot.forEach(doc => {
      projects.push({
        id: doc.id,
        ...doc.data() as Omit<Project, 'id'>
      });
    });
    console.log(`Fetched ${projects.length} projects for user ${userId}`);
    return NextResponse.json({ projects });

  } catch (error: unknown) {
    console.error('Get projects error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}