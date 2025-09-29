"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, X, GitBranch, Mail } from "lucide-react"

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false)
  const [selectedRepo, setSelectedRepo] = useState("")
  const [automationType, setAutomationType] = useState("")
  const [frequency, setFrequency] = useState("")
  const [recipients, setRecipients] = useState<string[]>([])
  const [recipientInput, setRecipientInput] = useState("")

  // Mock GitHub repos
  const mockRepos = [
    {
      id: "1",
      name: "awesome-project",
      owner: "john-doe",
      avatar: "https://github.com/john-doe.png",
      description: "A really awesome project with TypeScript",
      language: "TypeScript",
      stars: 142
    },
    {
      id: "2", 
      name: "react-dashboard",
      owner: "company-org",
      avatar: "https://github.com/company-org.png",
      description: "Modern React dashboard with shadcn/ui",
      language: "JavaScript",
      stars: 89
    },
    {
      id: "3",
      name: "api-backend",
      owner: "john-doe", 
      avatar: "https://github.com/john-doe.png",
      description: "REST API built with Node.js and Express",
      language: "JavaScript",
      stars: 67
    },
    {
      id: "4",
      name: "mobile-app",
      owner: "startup-team",
      avatar: "https://github.com/startup-team.png",
      description: "Cross-platform mobile app built with React Native",
      language: "TypeScript",
      stars: 234
    }
  ]

  const automationTypes = [
    {
      value: "daily-summary",
      label: "Daily Summary",
      description: "Daily digest of commits, PRs, and issues"
    },
    {
      value: "pr-notifications",
      label: "PR Notifications", 
      description: "Notify when PRs are created, merged, or reviewed"
    },
    {
      value: "weekly-report",
      label: "Weekly Report",
      description: "Weekly overview of repository activity"
    },
    {
      value: "release-notes",
      label: "Release Notes",
      description: "Automated release notes on new tags/releases"
    },
    {
      value: "issue-digest",
      label: "Issue Digest",
      description: "Summary of new and updated issues"
    }
  ]

  const frequencyOptions = [
    { value: "daily", label: "Daily", description: "Every day at 9:00 AM" },
    { value: "twice-daily", label: "Twice Daily", description: "9:00 AM and 6:00 PM" },
    { value: "weekly", label: "Weekly", description: "Every Monday at 9:00 AM" },
    { value: "on-event", label: "On Event", description: "Triggered by repository events" },
    { value: "custom", label: "Custom Schedule", description: "Set your own cron schedule" }
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

  const handleSubmit = () => {
    // TODO: Create project logic
    console.log({
      repo: selectedRepo,
      automationType,
      frequency,
      recipients
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Email Automation</DialogTitle>
          <DialogDescription>
            Set up automated email reports for your GitHub repository
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Repository Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Select Repository</Label>
            <Select value={selectedRepo} onValueChange={setSelectedRepo}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a repository to automate" />
              </SelectTrigger>
              <SelectContent>
                {mockRepos.map((repo) => (
                  <SelectItem key={repo.id} value={repo.id}>
                    <div className="flex items-center space-x-3 py-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={repo.avatar} />
                        <AvatarFallback>{repo.owner.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{repo.owner}/{repo.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {repo.language}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{repo.description}</p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Automation Type */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Automation Type</Label>
            <Select value={automationType} onValueChange={setAutomationType}>
              <SelectTrigger>
                <SelectValue placeholder="What kind of emails do you want to send?" />
              </SelectTrigger>
              <SelectContent>
                {automationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="space-y-1">
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-muted-foreground">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Frequency */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue placeholder="How often should emails be sent?" />
              </SelectTrigger>
              <SelectContent>
                {frequencyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="space-y-1">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Recipients */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Email Recipients</Label>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter email address"
                  value={recipientInput}
                  onChange={(e) => setRecipientInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addRecipient()}
                />
                <Button type="button" onClick={addRecipient} variant="outline">
                  Add
                </Button>
              </div>
              
              {recipients.length > 0 && (
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
              )}
              
              <p className="text-xs text-muted-foreground">
                Add team members who should receive the automated emails
              </p>
            </div>
          </div>

          {/* Preview */}
          {selectedRepo && automationType && frequency && (
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <h4 className="font-medium flex items-center">
                <GitBranch className="h-4 w-4 mr-2" />
                Preview
              </h4>
              <div className="text-sm space-y-1">
                <p><strong>Repository:</strong> {mockRepos.find(r => r.id === selectedRepo)?.owner}/{mockRepos.find(r => r.id === selectedRepo)?.name}</p>
                <p><strong>Type:</strong> {automationTypes.find(t => t.value === automationType)?.label}</p>
                <p><strong>Schedule:</strong> {frequencyOptions.find(f => f.value === frequency)?.label}</p>
                <p><strong>Recipients:</strong> {recipients.length} email{recipients.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedRepo || !automationType || !frequency || recipients.length === 0}
          >
            Create Automation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}