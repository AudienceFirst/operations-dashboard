import { NextResponse } from "next/server";
import { exec } from "child_process";
import { resolve } from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST() {
  const syncScript = resolve(process.cwd(), "sync.mjs");

  try {
    const { stdout, stderr } = await execAsync(`node "${syncScript}"`, {
      cwd: process.cwd(),
      // Full sync can take much longer than 5 minutes with many projects/tasks.
      timeout: 60 * 60 * 1000, // 60 minuten max
    });

    if (stderr) {
      console.error("[sync] stderr:", stderr);
    }

    console.log("[sync] stdout:", stdout);

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[sync] error:", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
