import axios from "axios";
export default class GithubReposService {
  static async all() : Promise<GitHubRepo[]> {
    try {
      const { data } = await axios.get("/api/github/repos");
      return data.repos;
    } catch (error) {
      console.error("Error fetching GitHub repos:", error);
      throw error;
    }
  }
}
