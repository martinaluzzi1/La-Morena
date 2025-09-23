// app/api/reserva/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

// Asegura runtime Node (el SDK de Resend no funciona en Edge)
export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const {
      nombre = "",
      email = "",
      whatsapp = "",
      website = "", // honeypot anti-bots
      checkIn = "",
      checkOut = "",
      guests = "",
      roomId = "",
      notes = "",
      total = "",
    } = data || {};

    if (website) return NextResponse.json({ ok: true, skipped: true }); // bot detectado

    if (!nombre || !email || !checkIn || !checkOut) {
      return new NextResponse("Faltan campos obligatorios", { status: 400 });
    }

    const to = process.env.BOOKINGS_TO || "estancialamorena0@gmail.com";

    const subject = `Nueva solicitud de reserva — ${nombre}`;
    const html = `
      <h2>Nueva solicitud de reserva</h2>
      <p><b>Nombre:</b> ${nombre}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>WhatsApp:</b> ${whatsapp || "-"}</p>
      <hr/>
      <p><b>Check-in:</b> ${checkIn}</p>
      <p><b>Check-out:</b> ${checkOut}</p>
      <p><b>Huéspedes:</b> ${guests}</p>
      <p><b>Alojamiento:</b> ${roomId}</p>
      <p><b>Total estimado:</b> ${total}</p>
      <p><b>Comentarios:</b><br/>${(notes || "-")
        .toString()
        .replace(/\n/g, "<br/>")}</p>
    `;

    // Enviar con Resend
    const sendResult = await resend.emails.send({
      from: process.env.FROM_EMAIL || "onboarding@resend.dev",
      to: [to],
      subject,
      html,
      // usa "reply_to" (snake_case) si querés responderle directo al huésped:
      reply_to: email,
    } as any);

    if ((sendResult as any).error) {
      console.error("Resend error:", (sendResult as any).error);
      return new NextResponse("No se pudo enviar el mail", { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return new NextResponse("Error procesando la solicitud", { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, msg: "API /api/reserva funciona" });
}
