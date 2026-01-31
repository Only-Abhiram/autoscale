import { NextResponse } from "next/server";
import { saveAutomation } from "@/lib/db/schema";

export  async function POST(req){
    const instagramAccountId = req.headers.get("instagramAccountId");
    const body = await req.json();
    const { postId, dmMessage, replyMessage, mediaUrl, permalink } = body;

    //save the automations to the DB
    const res = await saveAutomation(  {
        media_id: postId,
        instagram_account_id: instagramAccountId,
        media_url: mediaUrl,
        status: true,
        reply_message: replyMessage,
        dm_message: dmMessage,
        permalink: permalink,
      });
    return NextResponse.json({success: res.success});
}