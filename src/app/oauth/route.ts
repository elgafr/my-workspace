import { AUTH_COOKIE } from "@/features/auth/constants";
import { createAdminClient } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const secret = request.nextUrl.searchParams.get("secret");

  if (!userId || !secret) {
    return new NextResponse("Missing fields", { status: 400 });
  }

  const { account } = await createAdminClient();
  const session = await account.createSession(userId, secret);

  // Create a new response with redirection
  const response = NextResponse.redirect(`${request.nextUrl.origin}/`);

  // Set the cookie on the response object
  response.cookies.set(AUTH_COOKIE, session.secret, {
    path: "/",
    domain: ".elga.my.id", // Allows subdomains
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  return response;
}
