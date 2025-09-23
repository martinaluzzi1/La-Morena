// app/api/reserva/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  return NextResponse.json({ ok: true, msg: "API /api/reserva funciona" });
}

type Payload = {
  nombre: string;
  email: string;
  whatsapp?: string;
  website?: string; // honeypot
  checkIn: string;
  checkOut: string;
  guests: number;
  roomId: string;
  notes?: string;
  total: number;
};

export async function POST(req: Request) {
  try {
    const body: Payload = await req.json();

    // Honeypot anti-bots
    if (body.website && body.website.trim() !== "") {
      return NextResponse.json({ ok: true }); // ignoramos silenciosamente
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

    const subject = `Nueva consulta: ${nombre} — ${checkIn} → ${checkOut}`;
    const html = `
      <h2>Nueva consulta desde la web</h2>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>WhatsApp:</strong> ${whatsapp ?? "-"}</p>
      <p><strong>Fechas:</strong> ${checkIn} → ${checkOut}</p>
      <p><strong>Huéspedes:</strong> ${guests}</p>
      <p><strong>Alojamiento:</strong> ${roomId}</p>
      <p><strong>Comentarios:</strong> ${notes ?? "-"}</p>
      <p><strong>Total estimado:</strong> ${total}</p>
    `;

    const { data, error } = await resend.emails.send({
      from: "La Morena <reservas@estancialamorena0.resend.dev>", // tu sender verificado
      to: ["estancialamorena0@gmail.com"],                       // tu casilla
      replyTo: email,                                            // ✅ camelCase
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ ok: false, error: "Mailer error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: data?.id ?? null });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
