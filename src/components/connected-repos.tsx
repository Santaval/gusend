import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GitBranch, Settings, Mail, Plus, ExternalLink } from "lucide-react"

export function ConnectedRepos() {
  const repos = [
    {
      id: 1,
      name: "awesome-project",
      owner: "john-doe",
      avatar: "https://github.com/john-doe.png",
      automations: 3,
      status: "active",
      lastEmail: "2 hours ago",
      recipients: 15,
      frequency: "Daily"
    },
    {
      id: 2,
      name: "react-dashboard",
      owner: "company-org",
      avatar: "https://github.com/company-org.png",
      automations: 2,
      status: "active",
      lastEmail: "1 day ago",
      recipients: 8,
      frequency: "Weekly"
    },
    {
      id: 3,
      name: "api-backend",
      owner: "john-doe",
      avatar: "https://github.com/john-doe.png",
      automations: 1,
      status: "paused",
      lastEmail: "3 days ago",
      recipients: 12,
      frequency: "Daily"
    },
    {
      id: 4,
      name: "mobile-app",
      owner: "startup-team",
      avatar: "https://github.com/startup-team.png",
      automations: 4,
      status: "active",
      lastEmail: "5 hours ago",
      recipients: 25,
      frequency: "Twice daily"
    }
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Connected Repositories</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage your automated email reports
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Connect Repo
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {repos.map((repo) => (
            <div key={repo.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={repo.avatar} />
                  <AvatarFallback>{repo.owner.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-semibold">{repo.owner}/{repo.name}</h4>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {repo.recipients} recipients
                    </span>
                    <span>Last sent: {repo.lastEmail}</span>
                    <span>{repo.frequency}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Badge 
                  variant={repo.status === 'active' ? 'default' : 'secondary'}
                  className={repo.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                >
                  {repo.status}
                </Badge>
                
                <div className="text-sm text-muted-foreground">
                  {repo.automations} automation{repo.automations !== 1 ? 's' : ''}
                </div>
                
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
  )
}