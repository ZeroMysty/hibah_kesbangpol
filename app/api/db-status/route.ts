import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await pool.query("SELECT 1 as is_connected");
    return NextResponse.json({ status: "connected", db: "kesbang", ok: true });
  } catch (err: any) {
    return NextResponse.json({ status: "disconnected", error: err.message, ok: false }, { status: 500 });
  }
}
