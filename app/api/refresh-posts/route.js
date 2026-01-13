
import { NextResponse } from "next/server";
import { getProfileDetails, updatePosts} from "@/lib/db/schema"
import { getInstagramUserPosts} from "@/lib/instagram"

export async function GET(req) {
  const instagramAccountId = req.headers.get("instagramAccountId");
  console.log('Reached   /refresh-posts')
  try{
    const UserData= await getProfileDetails(instagramAccountId);  //user details(accesstoken)
    const accessToken = UserData.access_token;
    const lastestPosts = await getInstagramUserPosts({instagramAccountId, accessToken}); //insta API call for all posts
    const status = await updatePosts({instagramAccountId, lastestPosts}); //update the db with all posts
    return NextResponse.json({success: status});
  }catch(e){
    console.log("Error: \n"+e);
  }
}
