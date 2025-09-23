// app/api/reserva/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ==== Tipos ====
export type ReservaPayload = {
  nombre: string;
  email: string;
  whatsapp?: string | null;
  website?: string | null; // honeypot
  checkIn: string;
  checkOut: string;
  guests: number;
  roomId: string;
  notes?: string;
  total: number;
};

// Narrowing/validación muy simple para no usar "any"
function isReservaPayload(x: unknown): x is ReservaPayload {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.nombre === "string" &&
    typeof o.email === "string" &&
    typeof o.checkIn === "string" &&
    typeof o.checkOut === "string" &&
    typeof o.guests === "number" &&
    typeof o.roomId === "string" &&
    typeof o.total === "number"
  );
}

export async function GET() {
  return NextResponse.json({ ok: true, msg: "API /api/reserva funciona" });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as unknown;

    if (!isReservaPayload(body)) {
      return NextResponse.json({ ok: false, error: "Payload inválido" }, { status: 400 });
    }

    // Honeypot
    if (body.website && body.website.trim() !== "") {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const {
      nombre,
      email,
      whatsapp,
      checkIn,
      checkOut,
      guests,
      roomId,
      notes,
      total,
    } = body;

    const subject = `Nueva solicitud de reserva — ${nombre}`;
    const html = `
      <h1>Solicitud de reserva</h1>
      <ul>
        <li><strong>Nombre:</strong> ${nombre}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>WhatsApp:</strong> ${whatsapp ?? "-"}</li>
        <li><strong>Check-in:</strong> ${checkIn}</li>
        <li><strong>Check-out:</strong> ${checkOut}</li>
        <li><strong>Huéspedes:</strong> ${guests}</li>
        <li><strong>Alojamiento:</strong> ${roomId}</li>
        <li><strong>Total estimado:</strong> ${total}</li>
        <li><strong>Notas:</strong> ${notes ?? "-"}</li>
      </ul>
    `;

    // Si todavía no verificaste dominio en Resend, usá "onboarding@resend.dev"
    const from = "La Morena <onboarding@resend.dev>";

    // ...
const { data, error } = await resend.emails.send({
  from,
  to: ["estancialamorena0@gmail.com"], // tu casilla
  replyTo: email,                      // ✅ camelCase
  subject,
  html,
});


    // `r` está bien tipado por la SDK; chequeo defensivo:
    if ("error" in r && r.error) {
      console.error("Resend error:", r.error);
      return NextResponse.json({ ok: false, error: "Mailer error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
