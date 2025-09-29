import { Octokit } from "@octokit/rest";

export default class GithubService {
  static async allRepos(userToken: string) {
    const octokit = new Octokit({
      auth: userToken,
    });

    try {
      const response = await octokit.rest.repos.listForAuthenticatedUser({
        per_page: 10, // Fetch up to 100 repos
        sort: 'updated',
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching repositories:", error);
      throw new Error("Failed to fetch repositories");
    }
  }

  static async findRepo(userToken: string, repoId: string) : Promise<GitHubRepo> {
    try {
      const repos = await this.allRepos(userToken);
      const response = repos.find(repo => repo.id.toString() === repoId);
      if (!response) {
        throw new Error("Repository not found");
      }
      return response as GitHubRepo;
    } catch (error) {
      console.error("Error fetching repository:", error);
      throw new Error("Failed to fetch repository");
    }
  }

  static async getRepoCommits(userToken: string, owner: string, repo: string) {
    const octokit = new Octokit({
      auth: userToken,
    });

    try {
      const response = await octokit.rest.repos.listCommits({
        owner,
        repo,
        per_page: 20, // Fetch up to 20 commits
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching commits:", error);
      throw new Error("Failed to fetch commits");
    }
  }
}
