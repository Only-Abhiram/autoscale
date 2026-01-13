
import { NextResponse } from "next/server";
import { getProfileDetails } from "@/lib/db/schema.js"

export async function GET(req) {
  const instagramAccountId = req.headers.get("instagramAccountId");
  //get the accescToken from DB, if not present(error) redirect to /login
  console.log(instagramAccountId)
  try {

    const UserData = await getProfileDetails(instagramAccountId);  //from our db
    return NextResponse.json({UserPosts:UserData.posts});  
  }
  catch(e){
    //error:  accestoken(Invalid/ not found) , please login again
    return NextResponse.redirect(new URL('/login', req.url))
  }


 

  //get the modiaId's(post Id's) ->insta API
  //get thumbnail of every post
  //sent them to all to frontend 
   
}
