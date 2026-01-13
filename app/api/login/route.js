import { NextResponse } from "next/server";


export async function GET() {
  console.log('reached /api/login endpoint')

  const OAUTH_URL = process.env.OAUTH_URL;
  console.log(OAUTH_URL)
  //redirect to the instagram oauth interface
  return NextResponse.redirect(OAUTH_URL);

}




