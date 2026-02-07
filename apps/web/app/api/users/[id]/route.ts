import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const res = await fetch(`http://localhost:4000/api/users/${id}`);
  const data = await res.json();

  return NextResponse.json(data);
}
