import { NextResponse } from "next/server";
import { toggleAutomation } from "@/lib/db/schema";

export async function GET(req) {
    const instagramAccountId = req.headers.get("instagramAccountId");
    const { searchParams } = new URL(req.url);

    const media_id = searchParams.get("mediaId");
    const status = searchParams.get("status");
    
    const res = await toggleAutomation({media_id, status});

    return NextResponse.json({ success: res.success });
}