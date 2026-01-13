import { NextResponse } from "next/server";
import { verify } from "./lib/cookie";

export function proxy(req) {
  const pathname = req.nextUrl.pathname;
  const signed = req.cookies.get("insta_session")?.value;
  const instagramAccountId = verify(signed);
  console.log('middle ware triggered');
  console.log(pathname)
  console.log(instagramAccountId)
  const proto =
  req.headers.get("x-forwarded-proto") ?? "http";

const host =
  req.headers.get("x-forwarded-host") ??
  req.headers.get("host");

const origin = `${proto}://${host}`;
console.log(origin);

//protect /dashboard
if (pathname.includes("/dashboard") && !instagramAccountId){
  return NextResponse.redirect(
      new URL("/login", req.url)
    );
}

  // req to /api/login -> redirect to dashboard if cookie already exists
  if (pathname.includes('/login')){
    if (instagramAccountId) {
      console.log('got into cookie exist');
      return NextResponse.redirect(
        new URL("/dashboard", req.url)
      );
    }else {
      console.log('got into cookie not exist');
      return NextResponse.next();
    }
  }

  // Not logged in → block protected routes
  // if (!instagramAccountId) {
  //   console.log("no  cookie!!!")
  //   return NextResponse.redirect(
  //     new URL("/login",req.url)  // replace origin with req.url in production
  //   );
  // }
  const headers = new Headers(req.headers);
  headers.set("instagramAccountId", instagramAccountId);

  return NextResponse.next({
    request: { headers },
  });
}

export const config = {
  matcher: ["/login/:path*", "/dashboard/:path*" , "/api/me/:path*", "/api/refresh-posts/:path*", "/api/automation/:path*"],
};
