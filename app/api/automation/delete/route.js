import { NextResponse } from "next/server";
import { deleteAutomation } from "@/lib/db/schema";

export  async function GET(req){
    
    const instagramAccountId = req.headers.get("instagramAccountId");
    const { searchParams } = new URL(req.url);

    const media_id = searchParams.get("mediaId");
    

    //save the automations to the DB
    const res = await deleteAutomation(media_id);
    return NextResponse.json({success: res.success});
}