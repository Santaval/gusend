'use client';

import { useState, useEffect, useCallback } from 'react';
import { Project, CreateProjectRequest } from '@/types/Project';
import axios from 'axios';

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  createProject: (projectData: CreateProjectRequest, githubToken?: string) => Promise<Project | null>;
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

    async function loadProjects() {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get('/api/projects');
        console.log("Fetched projects:", data.projects);
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
    setLoading(true);
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
      setLoading(false);
    }
  }, []);



  return {
    projects,
    loading,
    error,
    createProject,
  };
}