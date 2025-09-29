
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GitBranch, Mail } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <GitBranch className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">GuSend</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild>
                <Link href="/projects/create">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6">
              ✨ Automate Your GitHub Workflows
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Never Miss a{" "}
              <span className="text-blue-600">Git Update</span>{" "}
              Again
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Automatically send email notifications to your team when important changes happen in your GitHub repositories. 
              Stay connected, stay informed, stay productive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/projects/create">
                  <Mail className="mr-2 h-5 w-5" />
                  Start Automating
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">
                  View Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {/* <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Automation Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to keep your team in sync with your GitHub activity
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <Zap className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Real-time Notifications</CardTitle>
                <CardDescription>
                  Get instant email alerts when commits, pull requests, or releases happen in your repositories.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <Clock className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Scheduled Reports</CardTitle>
                <CardDescription>
                  Receive daily, weekly, or monthly summaries of repository activity directly in your inbox.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <Users className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Team Management</CardTitle>
                <CardDescription>
                  Add multiple recipients and customize who receives notifications for different repositories.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <Shield className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Secure Integration</CardTitle>
                <CardDescription>
                  Safe and secure GitHub integration with OAuth authentication and encrypted data storage.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <GitBranch className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Multiple Repositories</CardTitle>
                <CardDescription>
                  Monitor multiple repositories with different automation rules and recipient lists.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <Mail className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Custom Templates</CardTitle>
                <CardDescription>
                  Beautiful, responsive email templates that make your notifications professional and clear.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section> */}

      {/* How It Works Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in just a few simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect GitHub</h3>
              <p className="text-gray-600">
                Securely connect your GitHub account and select the repositories you want to monitor.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Configure Automation</h3>
              <p className="text-gray-600">
                Choose what events to track and set up your email recipients and schedule preferences.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Stay Informed</h3>
              <p className="text-gray-600">
                Receive beautiful email notifications whenever important changes happen in your repositories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-24 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Automate Your Workflows?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join teams that stay connected with their GitHub activity through smart email automation.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/projects/create">
              <Mail className="mr-2 h-5 w-5" />
              Get Started Free
            </Link>
          </Button>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <GitBranch className="h-6 w-6" />
              <span className="text-lg font-semibold">GuSend</span>
            </div>
            <div className="flex space-x-6">
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/projects/create" className="text-gray-400 hover:text-white transition-colors">
                Get Started
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 GuSend. Automate your GitHub notifications with ease.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
