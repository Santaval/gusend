"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, X, GitBranch, Mail, Clock, Star, Loader2 } from "lucide-react"
import { useGitHub } from "@/hooks/use-github"
import { useProjects } from "@/hooks/use-projects"
import { toast } from "sonner"

export default function CreateProjectPage() {
  const router = useRouter()
  const { repos } = useGitHub()
  const { createProject, loading: creatingProject } = useProjects()
  
  const [selectedRepo, setSelectedRepo] = useState("")
  const [automationType, setAutomationType] = useState("")
  const [frequency, setFrequency] = useState("")
  const [recipients, setRecipients] = useState<string[]>([])
  const [recipientInput, setRecipientInput] = useState("")
  const [customSchedule, setCustomSchedule] = useState("")

  const automationTypes = [
    {
      value: "tech-daily-summary",
      label: "Tech Daily Summary",
      description: "Tech-focused daily digest of commits, PRs, and issues for the development team",
      recommended: false
    },
    {
      value: "non-tech-daily-summary",
      label: "Non-Tech Daily Summary",
      description: "Daily digest of commits, PRs, and issues for non-technical stakeholders",
      recommended: false
    },
  ]

  const frequencyOptions = [
    { value: "daily", label: "Daily", description: "Every day at 5:00 PM", icon: Clock },
    { value: "twice-daily", label: "Twice Daily", description: "11:00 AM and 5:00 PM", icon: Clock },
    { value: "weekly", label: "Weekly", description: "Every Friday at 5:00 PM", icon: Clock },
    // { value: "on-event", label: "On Event", description: "Triggered by repository events", icon: GitBranch },
    { value: "custom", label: "Custom Schedule", description: "Set your own cron schedule", icon: Clock }
  ]

  const addRecipient = () => {
    if (recipientInput.trim() && !recipients.includes(recipientInput.trim())) {
      setRecipients([...recipients, recipientInput.trim()])
      setRecipientInput("")
    }
  }

  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter(r => r !== email))
  }

  const handleSubmit = async () => {
    if (!selectedRepo || !automationType || !frequency || recipients.length === 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const projectData = {
        repoId: selectedRepo,
        automationType,
        frequency,
        customSchedule: frequency === 'custom' ? customSchedule : undefined,
        recipients
      };

      const project = await createProject(projectData);
      
      if (project) {
        toast.success("Project created successfully!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project. Please try again.");
    }
  }

  const selectedRepoData = repos.find(r => r.id.toString() === selectedRepo)
  const selectedAutomationType = automationTypes.find(t => t.value === automationType)
  const selectedFrequency = frequencyOptions.find(f => f.value === frequency)

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Create New Automation</h1>
          <p className="text-muted-foreground mt-2">
            Set up automated email reports for your GitHub repository
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Repository Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    1
                  </div>
                  Select Repository
                </CardTitle>
                <CardDescription>
                  Choose which GitHub repository you want to create automated reports for
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {repos.map((repo) => (
                    <div
                      key={repo.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedRepo === repo.id.toString() 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedRepo(repo.id.toString())}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={repo.owner.avatar_url} />
                          <AvatarFallback>{repo.owner.login.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">{repo.owner.login}/{repo.name}</h4>
                            <div className="flex items-center space-x-1">
                              {repo.private && (
                                <Badge variant="secondary" className="text-xs">Private</Badge>
                              )}
                              <Badge variant="outline" className="text-xs">{repo.language}</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{repo.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Automation Type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    2
                  </div>
                  Choose Automation Type
                </CardTitle>
                <CardDescription>
                  Select what kind of automated emails you want to send
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {automationTypes.map((type) => (
                    <div 
                      key={type.value}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors relative ${
                        automationType === type.value 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setAutomationType(type.value)}
                    >
                      {type.recommended && (
                        <Badge className="absolute top-2 right-2 text-xs">Recommended</Badge>
                      )}
                      <div className="space-y-2">
                        <h4 className="font-medium">{type.label}</h4>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Frequency */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    3
                  </div>
                  Set Schedule
                </CardTitle>
                <CardDescription>
                  How often should the automated emails be sent?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {frequencyOptions.map((option) => (
                    <div 
                      key={option.value}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        frequency === option.value 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setFrequency(option.value)}
                    >
                      <div className="flex items-center space-x-3">
                        <option.icon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">{option.label}</h4>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {frequency === 'custom' && (
                  <div className="space-y-2">
                    <Label>Custom Cron Expression</Label>
                    <Input
                      placeholder="0 9 * * *"
                      value={customSchedule}
                      onChange={(e) => setCustomSchedule(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter a valid cron expression (e.g., &quot;0 9 * * *&quot; for daily at 9 AM)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Step 4: Recipients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    4
                  </div>
                  Add Recipients
                </CardTitle>
                <CardDescription>
                  Who should receive the automated email reports?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter email address"
                    value={recipientInput}
                    onChange={(e) => setRecipientInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addRecipient()}
                    className="flex-1"
                  />
                  <Button type="button" onClick={addRecipient} variant="outline">
                    Add
                  </Button>
                </div>
                
                {recipients.length > 0 && (
                  <div className="space-y-3">
                    <Label>Recipients ({recipients.length})</Label>
                    <div className="flex flex-wrap gap-2">
                      {recipients.map((email) => (
                        <Badge key={email} variant="secondary" className="px-3 py-1">
                          <Mail className="h-3 w-3 mr-1" />
                          {email}
                          <button
                            onClick={() => removeRecipient(email)}
                            className="ml-2 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <p className="text-sm text-muted-foreground">
                  Add team members who should receive the automated emails
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GitBranch className="h-5 w-5 mr-2" />
                    Preview
                  </CardTitle>
                  <CardDescription>
                    Summary of your automation setup
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedRepoData && (
                    <div>
                      <Label className="text-sm font-medium">Repository</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={selectedRepoData.owner.avatar_url} />
                          <AvatarFallback>{selectedRepoData.owner.login.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{selectedRepoData.owner.login}/{selectedRepoData.name}</span>
                      </div>
                    </div>
                  )}

                  {selectedAutomationType && (
                    <div>
                      <Label className="text-sm font-medium">Automation Type</Label>
                      <p className="text-sm text-muted-foreground mt-1">{selectedAutomationType.label}</p>
                    </div>
                  )}

                  {selectedFrequency && (
                    <div>
                      <Label className="text-sm font-medium">Schedule</Label>
                      <p className="text-sm text-muted-foreground mt-1">{selectedFrequency.label}</p>
                    </div>
                  )}

                  {recipients.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Recipients</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {recipients.length} email{recipients.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 space-y-2">
                    <Button 
                      onClick={handleSubmit}
                      disabled={!selectedRepo || !automationType || !frequency || recipients.length === 0 || creatingProject}
                      className="w-full"
                    >
                      {creatingProject ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating Project...
                        </>
                      ) : (
                        'Create Project'
                      )}
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/dashboard">Cancel</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}