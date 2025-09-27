import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Octokit } from "@octokit/rest";
import clerk from '@clerk/clerk-sdk-node'

export async function GET(request: NextRequest) {
  try {
    const authData = await auth();
    if (!authData.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tokens = await clerk.users.getUserOauthAccessToken(authData.userId, "oauth_github");
    // Get the token from the request headers


    const token = tokens[0].token;

    // Initialize Octokit with the user's token
    const octokit = new Octokit({
      auth: token,
    });

    // Get query parameters for pagination and filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const per_page = parseInt(searchParams.get("per_page") || "30");
    const sort = searchParams.get("sort") || "updated";
    const type = searchParams.get("type") || "all"; // all, owner, public, private, member

    // Fetch user repositories
    const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
      page,
      per_page,
      sort: sort as "created" | "updated" | "pushed" | "full_name",
      type: type as "all" | "owner" | "public" | "private" | "member",
    });

    console.log(repos);

    // Transform the data to include only relevant fields
    const transformedRepos = repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      clone_url: repo.clone_url,
      ssh_url: repo.ssh_url,
      private: repo.private,
      fork: repo.fork,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      open_issues_count: repo.open_issues_count,
      created_at: repo.created_at,
      updated_at: repo.updated_at,
      pushed_at: repo.pushed_at,
      default_branch: repo.default_branch,
      owner: repo.owner
    }));

    return NextResponse.json({ repos: transformedRepos });
  } catch (error: unknown) {
    console.error("GitHub repos API error:", error);

    if (error && typeof error === "object" && "status" in error) {
      if (error.status === 401) {
        return NextResponse.json(
          { error: "Invalid GitHub token" },
          { status: 401 }
        );
      }

      if (error.status === 403) {
        return NextResponse.json(
          { error: "GitHub API rate limit exceeded" },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the token from the request headers
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization token" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const body = await request.json();
    const { owner, repo, path } = body;

    if (!owner || !repo) {
      return NextResponse.json(
        { error: "Owner and repo are required" },
        { status: 400 }
      );
    }

    // Initialize Octokit with the user's token
    const octokit = new Octokit({
      auth: token,
    });

    // Get repository contents
    const { data: contents } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: path || "",
    });

    return NextResponse.json({ contents });
  } catch (error: unknown) {
    console.error("GitHub repo contents API error:", error);

    if (error && typeof error === "object" && "status" in error) {
      if (error.status === 401) {
        return NextResponse.json(
          { error: "Invalid GitHub token" },
          { status: 401 }
        );
      }

      if (error.status === 404) {
        return NextResponse.json(
          { error: "Repository or path not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to fetch repository contents" },
      { status: 500 }
    );
  }
}
