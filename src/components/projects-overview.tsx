"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
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
  const { projects, loading, error, deleteProject, updateProjectStatus } = useProjects()
  const [projectToDelete, setProjectToDelete] = React.useState<string | null>(null)

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
              {/* <TableHead>Last Run</TableHead> */}
              {/* <TableHead>Next Run</TableHead> */}
              <TableHead>Status</TableHead>
              {/* <TableHead>Total Sent</TableHead> */}
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
                  {/* <TableCell className="text-muted-foreground">
                    {project.automation.lastRun ? formatDate(project.automation.lastRun) : 'Never'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatNextRun(project.automation.nextRun, project.automation.status)}
                  </TableCell> */}
                  <TableCell>
                    <Badge 
                      variant={project.automation.status === 'active' ? 'default' : 'secondary'}
                      className={project.automation.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {project.automation.status}
                    </Badge>
                  </TableCell>
                  {/* <TableCell>{project.automation.emailsSent}</TableCell> */}
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
                        <DropdownMenuItem onClick={() => {
                          if (!project.id) return;
                          const newStatus = project.automation.status === 'active' ? 'paused' : 'active';
                          updateProjectStatus(project.id, newStatus);
                        }}>
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
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => setProjectToDelete(project.id || null)}
                        >
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

      <Dialog open={projectToDelete !== null} onOpenChange={() => setProjectToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This will remove all automation settings and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setProjectToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!projectToDelete) return;
                
                try {
                  const success = await deleteProject(projectToDelete);
                  if (success) {
                    setProjectToDelete(null);
                    toast.success('Project deleted successfully');
                  } else {
                    toast.error('Failed to delete project');
                  }
                } catch {
                  toast.error('Failed to delete project');
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </Card>
  )
}