"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Plus, ExternalLink } from "lucide-react";
import { useGitHub } from "@/hooks/use-github";
import Link from "next/link";

export function ConnectedRepos() {
  const { repos } = useGitHub();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Connected Repositories</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage your automated email reports
          </p>
        </div>
        <Button asChild>
          <Link href="/projects/create">
            <Plus className="h-4 w-4 mr-2" />
            Connect Repo
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {repos.map((repo) => (
            <div
              key={repo.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={repo.owner.avatar_url} />
                  <AvatarFallback>
                    {repo.owner.login.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-semibold">
                      {repo.owner.login}/{repo.name}
                    </h4>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </div>

                  {/* <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {repo.recipients} recipients
                    </span>
                    <span>Last sent: {repo.lastEmail}</span>
                    <span>{repo.frequency}</span>
                  </div> */}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* <Badge
                  variant={repo. === "active" ? "default" : "secondary"}
                  className={
                    repo.status === "active"
                      ? "bg-green-100 text-green-800"
                      : ""
                  }
                >
                  {repo.status}
                </Badge>

                <div className="text-sm text-muted-foreground">
                  {repo.automations} automation
                  {repo.automations !== 1 ? "s" : ""}
                </div> */}

                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
