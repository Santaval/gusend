"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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
import { useProjects } from "@/hooks/use-projects"

export function ProjectsOverview() {
  const { projects, loading, error } = useProjects()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  const formatNextRun = (nextRunString?: string, status?: string) => {
    if (status === 'paused') return 'Paused'
    if (!nextRunString) return 'On event'
    
    const nextRun = new Date(nextRunString)
    const now = new Date()
    
    if (nextRun.toDateString() === now.toDateString()) {
      return `Today ${nextRun.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    }
    
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    if (nextRun.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow ${nextRun.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    }
    
    return nextRun.toLocaleDateString()
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Automations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Error loading projects: {error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

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
            {loading ? (
              // Show loading skeletons
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No projects found. Create your first automation to get started.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    {project.repo.owner.login}/{project.repo.name}
                  </TableCell>
                  <TableCell>{project.automation.type}</TableCell>
                  <TableCell>{project.automation.recipients.length}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {project.automation.lastRun ? formatDate(project.automation.lastRun) : 'Never'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatNextRun(project.automation.nextRun, project.automation.status)}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={project.automation.status === 'active' ? 'default' : 'secondary'}
                      className={project.automation.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {project.automation.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{project.automation.emailsSent}</TableCell>
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
                          {project.automation.status === 'active' ? (
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
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}