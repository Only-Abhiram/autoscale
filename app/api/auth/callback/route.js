// import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getInstagramLongLivedToken, getInstagramAccountDetails } from "@/lib/instagram";
import { saveInstagramToken } from "@/lib/db/schema";
import { sign } from "@/lib/cookie";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  console.log(req.url);
  if (!code) {
    return new Response("Missing auth code", { status: 400 });
  }

    //get the Accesstoken, InstaLoginId, Expiry
    const { instagramLoginId, accessToken, expiresIn } = await getInstagramLongLivedToken(code);

    const expiresAt = new Date(Date.now() + expiresIn * 1000);


    //get all the details of user-> profile, posts..etc
    const { instagramAccountId, username, name,
      account_type, profile_picture_url, followers_count
      , follows_count, media_count, posts } = await getInstagramAccountDetails(accessToken);


    // save user info to the db 
    await saveInstagramToken({
      instagramLoginId,
      instagramAccountId,
      username,
      accessToken,
      name,
      account_type,
      profile_picture_url,
      followers_count,
      follows_count,
      media_count,
      posts,
      expiresAt
    });
    
    //set the cookie
    await setSessionCookie(instagramAccountId);
    console.log("cookie set successfully");
    // Login successfull, redirect to the dashboard
    redirect("/dashboard");
    
  
}

async function setSessionCookie(instagramAccountId) {
  const signed = sign(instagramAccountId);

  const cookieStore = await cookies();

  cookieStore.set("insta_session", signed, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}