import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, GitCommit, Users, AlertTriangle } from "lucide-react"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "email_sent",
      title: "Daily summary sent",
      description: "awesome-project",
      time: "2 hours ago",
      icon: Mail,
      status: "success"
    },
    {
      id: 2,
      type: "commit",
      title: "15 new commits detected",
      description: "react-dashboard",
      time: "3 hours ago",
      icon: GitCommit,
      status: "info"
    },
    {
      id: 3,
      type: "subscriber",
      title: "New subscriber added",
      description: "sarah@company.com joined api-backend",
      time: "5 hours ago",
      icon: Users,
      status: "success"
    },
    {
      id: 4,
      type: "email_sent",
      title: "Weekly report sent",
      description: "mobile-app",
      time: "1 day ago",
      icon: Mail,
      status: "success"
    },
    {
      id: 5,
      type: "error",
      title: "Email delivery failed",
      description: "Invalid email address",
      time: "2 days ago",
      icon: AlertTriangle,
      status: "error"
    },
    {
      id: 6,
      type: "email_sent",
      title: "Daily summary sent",
      description: "api-backend",
      time: "2 days ago",
      icon: Mail,
      status: "success"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600'
      case 'error': return 'text-red-600'
      case 'info': return 'text-blue-600'
      default: return 'text-muted-foreground'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <p className="text-sm text-muted-foreground">
          Latest updates from your automations
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${getStatusColor(activity.status)} bg-opacity-10`}>
                <activity.icon className={`h-4 w-4 ${getStatusColor(activity.status)}`} />
              </div>
              
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}