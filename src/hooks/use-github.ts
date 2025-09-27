"use client";

import GithubReposService from "@/services/Repos.service";
import { useState, useEffect, useCallback } from "react";



interface UseGitHubReturn {
  repos: GitHubRepo[];
  refreshRepos: () => Promise<void>;
  loading: boolean;
  error: string | null;
}
export function useGitHub(): UseGitHubReturn {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize token from localStorage on mount

  async function loadRepos() {
    setLoading(true);
    setError(null);
    try {
      const repos = await GithubReposService.all();
      setRepos(repos);
    } catch {
      setError("Failed to load repositories");
    } finally {
      setLoading(false);
    }
  }

  // use effect to load repositories on mount
  useEffect(() => {
    loadRepos();
  }, []);

  return {
    repos,
    loading,
    error,
    refreshRepos: useCallback(async () => {
      await loadRepos();
    }, []),
  };
}
