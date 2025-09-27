import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MoreHorizontal, Play, Pause, Settings, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export function ProjectsOverview() {
  const projects = [
    {
      id: 1,
      repo: "john-doe/awesome-project",
      automation: "Daily Summary",
      recipients: 15,
      lastRun: "2 hours ago",
      nextRun: "Tomorrow 9:00 AM",
      status: "active",
      emailsSent: 45
    },
    {
      id: 2,
      repo: "john-doe/awesome-project", 
      automation: "PR Notifications",
      recipients: 8,
      lastRun: "5 hours ago",
      nextRun: "On PR creation",
      status: "active",
      emailsSent: 12
    },
    {
      id: 3,
      repo: "company-org/react-dashboard",
      automation: "Weekly Report",
      recipients: 8,
      lastRun: "1 day ago",
      nextRun: "Monday 9:00 AM",
      status: "active",
      emailsSent: 24
    },
    {
      id: 4,
      repo: "john-doe/api-backend",
      automation: "Daily Summary",
      recipients: 12,
      lastRun: "3 days ago",
      nextRun: "Paused",
      status: "paused",
      emailsSent: 67
    },
    {
      id: 5,
      repo: "startup-team/mobile-app",
      automation: "Twice Daily",
      recipients: 25,
      lastRun: "5 hours ago",
      nextRun: "Today 6:00 PM",
      status: "active",
      emailsSent: 156
    },
    {
      id: 6,
      repo: "startup-team/mobile-app",
      automation: "Release Notes",
      recipients: 45,
      lastRun: "1 week ago",
      nextRun: "On release",
      status: "active",
      emailsSent: 8
    }
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>All Automations</CardTitle>
          <p className="text-sm text-muted-foreground">
            Detailed view of all your email automations
          </p>
        </div>
        <Button asChild>
          <Link href="/projects/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Repository</TableHead>
              <TableHead>Automation</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Last Run</TableHead>
              <TableHead>Next Run</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Sent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">
                  {project.repo}
                </TableCell>
                <TableCell>{project.automation}</TableCell>
                <TableCell>{project.recipients}</TableCell>
                <TableCell className="text-muted-foreground">{project.lastRun}</TableCell>
                <TableCell className="text-muted-foreground">{project.nextRun}</TableCell>
                <TableCell>
                  <Badge 
                    variant={project.status === 'active' ? 'default' : 'secondary'}
                    className={project.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell>{project.emailsSent}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Configure
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        {project.status === 'active' ? (
                          <>
                            <Pause className="mr-2 h-4 w-4" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            Resume
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}