export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
    const response = await fetch(`${apiUrl}/health`, { cache: "no-store" });
    return Response.json({ ok: response.ok, backendStatus: response.status }, { status: response.ok ? 200 : 503 });
  } catch {
    return Response.json({ ok: false, backendStatus: "unreachable" }, { status: 503 });
  }
}
