import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function GET(req) {
  const cookieStore = await cookies();
  const proto =
  req.headers.get("x-forwarded-proto") ?? "http";

const host =
  req.headers.get("x-forwarded-host") ??
  req.headers.get("host");

const origin = `${proto}://${host}`;
  // remove the session cookie
  cookieStore.delete("insta_session");

  // redirect to home
    console.log(req.nextUrl.origin);
    console.log(req.url);
  return NextResponse.redirect(
    new URL("/", origin)// replace withe req.url
  );
  
}
