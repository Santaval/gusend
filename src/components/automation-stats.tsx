import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, GitBranch, Clock, Users } from "lucide-react"

export function AutomationStats() {
  const stats = [
    {
      title: "Active Projects",
      value: "12",
      description: "Repositories connected",
      icon: GitBranch,
      trend: "+2 this month"
    },
    {
      title: "Emails Sent",
      value: "847",
      description: "Total this month",
      icon: Mail,
      trend: "+23% from last month"
    },
    {
      title: "Automations",
      value: "28",
      description: "Currently running",
      icon: Clock,
      trend: "4 scheduled today"
    },
    {
      title: "Recipients",
      value: "156",
      description: "Across all projects",
      icon: Users,
      trend: "+8 new subscribers"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
            <p className="text-xs text-green-600 mt-1">{stat.trend}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}