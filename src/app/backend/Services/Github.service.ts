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
}
