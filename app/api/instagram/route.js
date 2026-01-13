
import { NextResponse } from "next/server";
import {sendDmMessage, sendReplyMessage} from "@/lib/instagram";
import { findAutomation , getProfileDetails} from "@/lib/db/schema";
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const APP_SECRET = process.env.APP_SECRET;
console.log(VERIFY_TOKEN);
  console.log(APP_SECRET);
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  
  const token = searchParams.get("hub.verify_token");
  const mode = searchParams.get("hub.mode");
  const challenge = searchParams.get("hub.challenge");

  if (mode == 'subscribe' && token === VERIFY_TOKEN && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(req) {
  const body = await req.json();

  console.log("Webhook event:", body);

  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      const value = change.value;
      console.log(value);
      const media_id = value.media.id;
      const comment_id = value.id;
      const commenter_id = value.from.id;
      const commenter_username = value.from.username;
      const instagramAccountId = entry.id;
      if (instagramAccountId === commenter_id) continue; // avoid infinite looping
      //find if media_if exists ->get the reply and dm message , accesstoken
      const { reply_message, dm_message} = await findAutomation(media_id);
      if(!reply_message && !dm_message ) continue;
      const userData = await getProfileDetails(instagramAccountId);
      const accessToken = userData.access_token; 
      
      if (dm_message!==""){
        await sendDmMessage({dm_message,instagramAccountId, comment_id, accessToken});
      }
      if (reply_message!==""){
        await sendReplyMessage({reply_message,comment_id, accessToken });
      }
    }
  }

  return NextResponse.json({ ok: true });
}
