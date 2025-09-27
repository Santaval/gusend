import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getFirestoreDb } from '@/lib/firebase-admin';
import { Project, CreateProjectRequest } from '@/types/Project';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
    // Note: You'll need to get the user's GitHub token to fetch repo details
    const authHeader = request.headers.get('authorization');
    let repoData = {
      id: repoId,
      name: `repo-${repoId}`,
      owner: 'unknown',
      url: `https://github.com/unknown/repo-${repoId}`,
      description: '',
      language: '',
      isPrivate: false
    };

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        // Fetch repo details from GitHub API
        const repoResponse = await fetch(`https://api.github.com/repositories/${repoId}`, {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        });

        if (repoResponse.ok) {
          const githubRepo = await repoResponse.json();
          repoData = {
            id: githubRepo.id.toString(),
            name: githubRepo.name,
            owner: githubRepo.owner.login,
            url: githubRepo.html_url,
            description: githubRepo.description || '',
            language: githubRepo.language || '',
            isPrivate: githubRepo.private
          };
        }
      } catch (error) {
        console.warn('Failed to fetch repo details from GitHub:', error);
        // Continue with default repo data
      }
    }

    // Calculate next run time based on frequency
    const now = new Date();
    let nextRun = new Date();
    
    switch (frequency) {
      case 'daily':
        nextRun.setDate(now.getDate() + 1);
        nextRun.setHours(9, 0, 0, 0); // 9 AM tomorrow
        break;
      case 'twice-daily':
        if (now.getHours() < 9) {
          nextRun.setHours(9, 0, 0, 0); // Today at 9 AM
        } else if (now.getHours() < 18) {
          nextRun.setHours(18, 0, 0, 0); // Today at 6 PM
        } else {
          nextRun.setDate(now.getDate() + 1);
          nextRun.setHours(9, 0, 0, 0); // Tomorrow at 9 AM
        }
        break;
      case 'weekly':
        nextRun.setDate(now.getDate() + ((1 + 7 - now.getDay()) % 7)); // Next Monday
        nextRun.setHours(9, 0, 0, 0);
        break;
      case 'on-event':
        nextRun = now; // Event-triggered, no scheduled time
        break;
      case 'custom':
        // For custom schedules, we'd need to parse the cron expression
        // For now, default to tomorrow at 9 AM
        nextRun.setDate(now.getDate() + 1);
        nextRun.setHours(9, 0, 0, 0);
        break;
      default:
        nextRun.setDate(now.getDate() + 1);
        nextRun.setHours(9, 0, 0, 0);
    }

    const fromFrequencyToCron = {
      'daily': '0 9 * * *',
      'twice-daily': '0 9,18 * * *',
      'weekly': '0 9 * * 1',
      'on-event': '',
      'custom': customSchedule || ''
    };

    // Create project object
    const project: Omit<Project, 'id'> = {
      userId,
      repo: repoData,
      automation: {
        type: automationType,
        frequency,
        cronSchedule: fromFrequencyToCron[frequency as keyof typeof fromFrequencyToCron],
        recipients,
        status: 'active',
        nextRun: frequency === 'on-event' ? undefined : nextRun.toISOString(),
        emailsSent: 0
      },
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    console.log('Creating project:', project);

    // Save to Firestore
    const db = getFirestoreDb();
    const docRef = await db.collection('projects').add(project);

    // Return the created project with its ID
    const createdProject: Project = {
      id: docRef.id,
      ...project
    };

    // Create an activity log entry
    await db.collection('activity').add({
      projectId: docRef.id,
      type: 'project_created',
      title: 'Project created',
      description: `New automation set up for ${repoData.owner}/${repoData.name}`,
      time: now.toISOString(),
      status: 'success'
    });

    return NextResponse.json({ 
      message: 'Project created successfully', 
      project: createdProject 
    }, { status: 201 });

  } catch (error: unknown) {
    console.error('Create project error:', error);
    
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'permission-denied') {
        return NextResponse.json({ error: 'Permission denied to access database' }, { status: 403 });
      }
    }

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

    return NextResponse.json({ projects });

  } catch (error: unknown) {
    console.error('Get projects error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}