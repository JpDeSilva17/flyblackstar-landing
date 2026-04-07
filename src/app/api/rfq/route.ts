import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const payload = {
      type: form.get("emptyLegId") ? "empty_leg" : "custom",
      emptyLegId: form.get("emptyLegId") || undefined,
      from: form.get("from") || undefined,
      to: form.get("to") || undefined,
      departure: form.get("departure") || undefined,
      returnDate: form.get("returnDate") || undefined,
      passengers: Number(form.get("passengers") || 1),
      aircraftType: form.get("aircraftType") || undefined,
      aircraftCategory: form.get("aircraftCategory") || undefined,
      notes: form.get("notes") || undefined,
      clientMessage: form.get("clientMessage") || undefined,
      contact: {
        name: String(form.get("name") || ""),
        email: String(form.get("email") || ""),
        phone: form.get("phone") ? String(form.get("phone")) : undefined,
      },
    };

    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

    const res = await fetch(`${baseUrl}/api/rfq`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "Failed to submit", details: text },
        { status: 500 },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected error", details: String(err) },
      { status: 500 },
    );
  }
}
