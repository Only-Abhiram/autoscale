
import { NextResponse } from "next/server";
import { getProfileDetails} from "@/lib/db/schema"
import { getInstagramUserPosts} from "@/lib/instagram"

export async function GET(req) {
  const instagramAccountId = req.headers.get("instagramAccountId");
  console.log('Reached   /me')
  //look up Media Automated DB -> send the automated media (Status,thumbnail, reply msg, DM msg )
  //get the profile details also 
  try{
    const UserData= await getProfileDetails(instagramAccountId);
    return NextResponse.json({
        automations: UserData.automations,
        account_type:UserData.account_type,
        followers_count: UserData.followers_count,
        follows_count: UserData.follows_count,
        media_count: UserData.media_count,
        name: UserData.name,
        profile_picture_url: UserData.profile_picture_url, 
        username: UserData.username,
        automations:UserData.automations
      });
  }catch(e){
    console.log("Error: \n"+e);
  }
}
