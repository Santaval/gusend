'use client';

import { useState, useEffect, useCallback } from 'react';
import { Project, CreateProjectRequest } from '@/types/Project';
import axios from 'axios';

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  creating?: boolean;
  error: string | null;
  deleteProject: (projectId: string) => Promise<boolean>;
  createProject: (projectData: CreateProjectRequest, githubToken?: string) => Promise<Project | null>;
  updateProjectStatus: (projectId: string, status: 'active' | 'paused') => Promise<boolean>;
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

    async function loadProjects() {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get('/api/projects');
        setProjects(data.projects || []);
      } catch {
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    }

    // use effect to load projects on mount
    useEffect(() => {
      loadProjects();
    }, []);
  
  const createProject = useCallback(async (
    projectData: CreateProjectRequest, 
    githubToken?: string
  ): Promise<Project | null> => {
    setCreating(true);
    setError(null);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Include GitHub token for fetching repo details
      if (githubToken) {
        headers['Authorization'] = `Bearer ${githubToken}`;
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers,
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create project');
      }

      const data = await response.json();
      const newProject = data.project;

      // Add the new project to the local state
      setProjects(prev => [newProject, ...prev]);

      return newProject;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setCreating(false);
    }
  }, []);



  const updateProjectStatus = useCallback(async (projectId: string, status: 'active' | 'paused'): Promise<boolean> => {
    setError(null);
    try {
      await axios.patch(`/api/projects/${projectId}`, { status });
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, automation: { ...project.automation, status } }
          : project
      ) as Project[]);
      return true;
    } catch {
      setError("Failed to update project status");
      return false;
    }
  }, []);

  const deleteProject = useCallback(async (projectId: string): Promise<boolean> => {
    setError(null);
    try {
      await axios.delete(`/api/projects/${projectId}`);
      setProjects(prev => prev.filter(project => project.id !== projectId));
      return true;
    } catch {
      setError("Failed to delete project");
      return false;
    }
  }
  , []);

  return {
    projects,
    loading,
    error,
    createProject,
    deleteProject,
    creating,
    updateProjectStatus
  };
}