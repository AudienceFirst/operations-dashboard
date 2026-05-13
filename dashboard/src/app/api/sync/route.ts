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
    const stderr =
      typeof err === "object" &&
      err !== null &&
      "stderr" in err &&
      typeof (err as { stderr?: unknown }).stderr === "string"
        ? (err as { stderr: string }).stderr
        : "";
    const details = stderr.trim().slice(0, 800);
    const errorMessage = details ? `${message}\n${details}` : message;
    console.error("[sync] error:", errorMessage);
    return NextResponse.json({ ok: false, error: errorMessage }, { status: 500 });
  }
}
