import { NextResponse } from "next/server";
import { saveAutomation } from "@/lib/db/schema";

export  async function GET(req){
    const instagramAccountId = req.headers.get("instagramAccountId");
    const {postId} = await req.params;
    

    //save the automations to the DB
    const res = await deleteAutomation(postId);
    return NextResponse.json({success: res.success});
}