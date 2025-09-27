import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import clerk from '@clerk/clerk-sdk-node'
import GithubService from "@/app/backend/Services/Github.service";

export async function GET() {
  try {
    const { isAuthenticated, userId } = await auth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const tokens = await clerk.users.getUserOauthAccessToken(userId, "oauth_github");
    // Get the token from the request headers
    const token = tokens[0].token;
    // Fetch user repositories
    const repos = await GithubService.allRepos(token);

    return NextResponse.json({ repos });
  } catch  {
    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 }
    );
  }
}
