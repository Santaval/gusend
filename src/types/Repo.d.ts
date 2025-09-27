interface GitHubRepo {
  id: number;
  name: string;
  owner: RepoOwner;
  full_name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  ssh_url: string;
  private: boolean;
  fork: boolean;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string | null;
  default_branch: string;
}

interface RepoOwner {

      login: string,
      id: number,
      node_id: string,
      avatar_url: string,
      gravatar_id: string,
      url: string,
      html_url: string,
      followers_url: string,
      following_url: string,
      gists_url: string,
      starred_url: string,
      subscriptions_url: string,
      organizations_url: string,
      repos_url: string,
      events_url: string,
      received_events_url: string,
      type: 'User',
      user_view_type: 'public',
      site_admin: false
 }