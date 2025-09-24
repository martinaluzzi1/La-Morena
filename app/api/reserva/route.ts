// app/api/reserva/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

// Instanciar sólo si hay API key (evita errores en build)
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export async function GET() {
  return NextResponse.json({
    ok: true,
    msg: "API /api/reserva funciona",
    hasKey: Boolean(RESEND_API_KEY),
  });
}

type Payload = {
  nombre: string;
  email: string;
  whatsapp?: string;
  website?: string; // honeypot anti-bots
  checkIn: string;
  checkOut: string;
  guests: number;
  roomId: string;
  notes?: string;
  total: number;
};

export async function POST(req: Request) {
  try {
    if (!resend) {
      console.error("Missing RESEND_API_KEY env var");
      return NextResponse.json(
        { ok: false, error: "Mailer not configured" },
        { status: 500 }
      );
    }

    const body: Payload = await req.json();

    // Honeypot anti-bots: si viene relleno, hacemos como que todo ok
    if (body.website && body.website.trim() !== "") {
      return NextResponse.json({ ok: true });
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

    // Validaciones mínimas
    if (!nombre || !email || !checkIn || !checkOut) {
      return NextResponse.json(
        { ok: false, error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    const subject = `Nueva consulta: ${nombre} — ${checkIn} → ${checkOut}`;
    const html = `
      <h2>Nueva consulta desde la web</h2>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>WhatsApp:</strong> ${whatsapp ?? "-"}</p>
      <p><strong>Fechas:</strong> ${checkIn} → ${checkOut}</p>
      <p><strong>Huéspedes:</strong> ${guests}</p>
      <p><strong>Alojamiento (ID):</strong> ${roomId}</p>
      <p><strong>Comentarios:</strong> ${notes ?? "-"}</p>
      <p><strong>Total estimado:</strong> ${total}</p>
    `;

    // IMPORTANTE:
    // Si NO verificaste un dominio en Resend, usá el remitente de prueba:
    //   'onboarding@resend.dev'
    // Cuando verifiques tu dominio, cambiá el `from` por algo como
    //   'Reservas <reservas@tu-dominio.com>'
    const { data, error } = await resend.emails.send({
      from: "Estancia La Morena <onboarding@resend.dev>",
      to: ["estancialamorena0@gmail.com"],
      replyTo: email ? [email] : undefined, // <- camelCase y como array
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { ok: false, error: "Mailer error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, id: data?.id ?? null });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
