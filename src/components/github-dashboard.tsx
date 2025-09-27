'use client';

import { useGitHub } from '@/hooks/use-github';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, GitFork, Star, AlertCircle } from 'lucide-react';

export function GitHubDashboard() {
  const { repos, loading, error, refreshRepos } = useGitHub();


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your GitHub Repositories</CardTitle>
              <CardDescription>
                {repos.length} repositories found
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={refreshRepos} 
                disabled={loading}
                variant="outline"
              >
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Error
            </CardTitle>
            <CardDescription>
              {error}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-3 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo) => (
            <Card key={repo.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <a 
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline flex items-center gap-1"
                  >
                    {repo.name}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  {repo.private && (
                    <Badge variant="secondary" className="text-xs">
                      Private
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {repo.description || 'No description provided'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    {repo.language && (
                      <Badge variant="outline" className="text-xs">
                        {repo.language}
                      </Badge>
                    )}
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {repo.stargazers_count}
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="h-3 w-3" />
                      {repo.forks_count}
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Updated {new Date(repo.updated_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && repos.length === 0 && !error && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              No repositories found. Make sure you have repositories in your GitHub account.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}