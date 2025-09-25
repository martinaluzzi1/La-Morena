"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays, Mail, MapPin, Phone, Star, Users, Home, Sun, Trees, Snowflake,
  Sparkles, Wifi, Car, PawPrint, Mountain, Beef, Clock, ChevronRight, Loader2,
  Instagram, Facebook
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

/* ===================== i18n (ES/EN) ===================== */
type Lang = "es" | "en";

const STRINGS = {
  es: {
    site: "Estancia La Morena",
    nav: { alojamiento: "Alojamiento", experiencias: "Actividades y eventos", galeria: "Galería", como: "Cómo llegar", contacto: "Contacto", reservar: "Reservar" },
    hero: {
      title: "Descanso de campo,\na pocas horas de la ciudad",
      subtitle: "Naturaleza, confort y experiencias auténticas en una estancia boutique.",
      cta: { disponibilidad: "Consultar disponibilidad", galeria: "Ver galería" },
      meta: { guests: "Hasta {n} huéspedes", location: "San José del Morro, San Luis, Argentina" },
    },
    sections: {
      alojamiento: "Alojamiento",
      tarifas: "Tarifas",
      experiencias: "Experiencias",
      instalaciones: "Instalaciones",
      actividades: "Actividades",
      eventos: "Eventos",
      galeria: "Galería",
      como: "Cómo llegar",
      contacto: "¿Tenés dudas?",
      platos: "Gastronomía",
      dejaComentario: "Dejá tu comentario",
      tuNombre: "Tu nombre",
      tuComentario: "Tu comentario",
      tuPuntaje: "Puntaje",
      enviarComentario: "Enviar comentario",
    },
    features: {
      wifi: "Wi-Fi rural",
      cocina: "Cocina casera · All Inclusive",
      pet: "Pet-friendly",
      senderismo: "Senderismo y travesías",
      volcan: "Ascenso al volcán El Morro",
      parking: "Estacionamiento",
    },
    activities: [
      "Senderismo / trekking con ascenso al volcán",
      "Bicicleteadas con ascenso al volcán",
      "Cabalgatas con ascenso al volcán",
      "Retiros espirituales",
      "Encuentros de yoga y astrológicos",
      "Avistaje de aves y cóndores",
      "Travesías",
    ],
    instalaciones: {
      sistema: "All Inclusive con distintos tipos de alojamiento y espacios comunes",
      restaurant: "Restaurante para 150 personas",
      casaTe: "Casa de té con minutas, repostería y blends",
    },
    rooms: { desde: "desde", elegir: "Elegir" },
    eventosHead: { emp: "Empresariales", soc: "Sociales" },
    eventosEmp: ["Brainstormings empresariales", "Fiestas de fin de año", "Presentaciones de producto", "Demostraciones 4x4"],
    eventosSoc: ["Casamientos", "Cumpleaños", "15 años", "Bautismos", "Mitzvot", "Producciones fotográficas", "Rodajes"],
    booking: {
      title: "Consultá disponibilidad",
      subtitle: "Confirmamos por mail o WhatsApp.",
      labels: {
        checkin: "Check-in",
        checkout: "Check-out",
        guests: "Huéspedes",
        type: "Tipo de alojamiento",
        notes: "Comentarios",
      },
      placeholders: { notes: "¿Necesitás cuna, late check-out, dieta especial?" },
      total: {
        needDates: "Elegí fechas para ver el total estimado.",
        title: "Total estimado",
        includes: (base: string, extra: string) => `Incluye ${base} base + ${extra} x noche por extras.`,
      },
      submit: "Solicitar reserva",
      stepsTitle: "Cómo funciona",
      steps: [
        "Enviás la solicitud con tus fechas.",
        "Confirmamos disponibilidad y precio final por mensaje.",
        "Seña del 30% para garantizar la reserva.",
        "Cancelación sin cargo hasta 7 días antes.",
      ],
      incluye: { title: "Incluye", items: ["Desayuno de campo", "Ropa blanca y amenities", "Uso de bicis, kayaks y pileta"] },
      noIncluye: { title: "No incluye", items: ["Traslados", "Actividades guiadas especiales"] },
      contactoDirecto: { title: "Contacto directo", horario: "9:00–18:00 (ARG)"},
    },
    testimonials: { title: "Lo que dicen los huéspedes"},
    contact: { subtitle: "Escribinos y armamos tu escapada." },
    footer: { reservas: "Reservas", como: "Cómo llegar", contacto: "Contacto", derechos: "Todos los derechos reservados." },
  },
  en: {
    site: "Estancia La Morena",
    nav: { alojamiento: "Lodging", experiencias: "Experiences", galeria: "Gallery", como: "Getting here", contacto: "Contact", reservar: "Book" },
    hero: {
      title: "Country retreat,\njust hours from the city",
      subtitle: "Nature, comfort and authentic experiences in a boutique ranch.",
      cta: { disponibilidad: "Check availability", galeria: "View gallery" },
      meta: { guests: "Up to {n} guests", location: "San José del Morro, San Luis, Argentina" },
    },
    sections: {
      alojamiento: "Lodging",
      tarifas: "Rates",
      experiencias: "Experiences",
      instalaciones: "Facilities",
      actividades: "Activities",
      eventos: "Events",
      galeria: "Gallery",
      como: "Getting here",
      contacto: "Have questions?",
      platos: "Food",
      dejaComentario: "Leave your comment",
      tuNombre: "Your name",
      tuComentario: "Your comment",
      tuPuntaje: "Rating",
      enviarComentario: "Send comment",
    },
    features: {
      wifi: "Rural Wi-Fi",
      cocina: "Homestyle cooking · All-Inclusive",
      pet: "Pet-friendly",
      senderismo: "Hiking & trails",
      volcan: "El Morro volcano ascent",
      parking: "Parking",
    },
    activities: [
      "Hiking / trekking to the volcano",
      "Cycling with volcano ascent",
      "Horseback rides with volcano ascent",
      "Spiritual retreats",
      "Yoga & astrology gatherings",
      "Bird & condor watching",
      "Overland trips",
    ],
    instalaciones: {
      sistema: "All-Inclusive with multiple lodging types and shared spaces",
      restaurant: "Restaurant for 150 people",
      casaTe: "Tea house with light meals, pastries and blends",
    },
    rooms: { desde: "from", elegir: "Choose" },
    eventosHead: { emp: "Corporate", soc: "Social" },
    eventosEmp: ["Corporate brainstormings", "Year-end parties", "Product launches", "4x4 demonstrations"],
    eventosSoc: ["Weddings", "Birthdays", "Quinceañeras", "Baptisms", "Mitzvot", "Photo productions", "Film shoots"],
    booking: {
      title: "Check availability",
      subtitle: "We'll confirm via email or WhatsApp.",
      labels: {
        checkin: "Check-in",
        checkout: "Check-out",
        guests: "Guests",
        type: "Room type",
        notes: "Notes",
      },
      placeholders: { notes: "Need a crib, late check-out, special diet?" },
      total: {
        needDates: "Pick dates to see the estimated total.",
        title: "Estimated total",
        includes: (base: string, extra: string) => `Includes ${base} base + ${extra} per night for extras.`,
      },
      submit: "Request booking",
      stepsTitle: "How it works",
      steps: [
        "Send your request with dates.",
        "We confirm availability and final price by message.",
        "30% deposit to secure the booking.",
        "Free cancellation up to 7 days before.",
      ],
      incluye: { title: "Included", items: ["Country breakfast", "Linens and amenities", "Use of bikes, kayaks and pool"] },
      noIncluye: { title: "Not included", items: ["Transfers", "Guided special activities"] },
      contactoDirecto: { title: "Direct contact", horario: "9:00–18:00 (ARG)", nota: "We also reply via Instagram and WhatsApp." },
    },
    testimonials: { title: "Guest reviews", items: ["Incredible peace and service.", "We come back every year.", "Total disconnection, highly recommended."] },
    contact: { subtitle: "Write to us and we’ll craft your getaway." },
    footer: { reservas: "Bookings", como: "Getting here", contacto: "Contact", derechos: "All rights reserved." },
  },
} as const;

/* ===================== i18n helper ===================== */
function useT(lang: Lang) {
  const walk = (obj: unknown, key: string): unknown => {
    if (obj && typeof obj === "object" && key in (obj as Record<string, unknown>)) {
      return (obj as Record<string, unknown>)[key];
    }
    return undefined;
  };
  const get = (path: string): unknown => {
    const parts = path.split(".");
    let cur: unknown = (STRINGS as Record<string, unknown>)[lang];
    for (const p of parts) cur = walk(cur, p);
    if (cur !== undefined) return cur;
    cur = (STRINGS as Record<string, unknown>)["es"];
    for (const p of parts) cur = walk(cur, p);
    return cur;
  };
  const t = (path: string, vars: Record<string, string | number> = {}) => {
    const raw = get(path);
    if (typeof raw !== "string") return path;
    return raw.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
  };
  const ta = (path: string): string[] => {
    const v = get(path);
    return Array.isArray(v) ? (v as string[]) : [];
  };
  return { t, ta, get };
}

/* ========== Imagen con fallback de extensión ========== */
const CANDIDATE_EXTS = ["jpg","jpeg","png","webp","JPG","JPEG","PNG","WEBP"] as const;

function FallbackImage({ base, alt, className = "" }: { base: string; alt: string; className?: string }) {
  const [idx, setIdx] = useState<number>(0);
  const candidates = React.useMemo(() => CANDIDATE_EXTS.map(ext => `${base}.${ext}`), [base]);
  return (
    <img
      src={encodeURI(candidates[idx]!)}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setIdx(v => (v < candidates.length - 1 ? v + 1 : v))}
    />
  );
}

/* ===================== Carrusel genérico (manual) ===================== */
function Carousel({
  bases = [],
  alt,
  aspect = "aspect-[4/3]",
  rounded = "rounded-2xl",
}: { bases?: string[]; alt: string; aspect?: string; rounded?: string }) {
  const [i, setI] = useState(0);
  const list = Array.isArray(bases) ? bases : [];
  const count = list.length;
  if (!count) return null;

  const prev = () => setI(v => (v - 1 + count) % count);
  const next = () => setI(v => (v + 1) % count);

  return (
    <div className={`relative w-full overflow-hidden ${rounded} bg-neutral-200`}>
      <div className={`relative ${aspect}`}>
        {list.map((b, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-500 ${idx === i ? "opacity-100" : "opacity-0"}`}
          >
            <FallbackImage base={b} alt={`${alt} — foto ${idx + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      {count > 1 && (
        <>
          <button type="button" onClick={prev} aria-label="Anterior" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white px-3 py-2 shadow">‹</button>
          <button type="button" onClick={next} aria-label="Siguiente" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white px-3 py-2 shadow">›</button>
          <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1">
            {list.map((_, idx) => (
              <button key={idx} aria-label={`Ir a foto ${idx + 1}`} onClick={() => setI(idx)} className={`h-2 w-2 rounded-full ${idx === i ? "bg-white" : "bg-white/50"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ===================== Carrusel para el HERO (auto) ===================== */
function HeroCarousel({
  bases = [],
  alt = "Fondo",
  autoMs = 5000,
}: { bases?: string[]; alt?: string; autoMs?: number }) {
  const [i, setI] = useState(0);
  const count = bases.length;

  useEffect(() => {
    if (count < 2) return;
    const id = setInterval(() => setI(v => (v + 1) % count), autoMs);
    return () => clearInterval(id);
  }, [count, autoMs]);

  if (!count) return null;

  return (
    <div className="relative h-[70vh] md:h-[80vh]">
      {bases.map((b, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0"}`}
        >
          <FallbackImage base={b} alt={`${alt} — fondo ${idx + 1}`} className="w-full h-full object-cover" />
        </div>
      ))}
      <div className="pointer-events-none absolute inset-0 bg-black/35" />
    </div>
  );
}

/* ===================== Utilidades ===================== */
const currency = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

const nightsBetween = (inStr: string, outStr: string) => {
  const inD = inStr ? new Date(inStr) : null;
  const outD = outStr ? new Date(outStr) : null;
  if (!inD || !outD) return 0;
  const ms = outD.getTime() - inD.getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
};

/* ===================== Datos ===================== */
const LOCATION = "San José del Morro, San Luis, Argentina";

/* Iconos de features */
const FEATURE_KEYS = [
  { icon: Wifi, key: "wifi" },
  { icon: Beef, key: "cocina" },
  { icon: PawPrint, key: "pet" },
  { icon: Trees, key: "senderismo" },
  { icon: Mountain, key: "volcan" },
  { icon: Car, key: "parking" },
] as const;

/* Habitaciones (igual que antes) */
type Room = { id: string; name: string; base: number; cap: number; photos: string[]; perks?: string[]; };
const ROOMS: Room[] = [
  { id: "suite-bradford", name: "Suite Bradford", base: 120000, cap: 4, photos: ["/suites/bradford1", "/suites/bradford2", "/suites/bradford3", "/suites/bradford4", "/suites/bradford5"] },
  { id: "suite-charolais", name: "Suite Charolais", base: 120000, cap: 4, photos: ["/suites/charolais1", "/suites/charolais2", "/suites/charolais3", "/suites/charolais4"] },
  { id: "suite-hereford", name: "Suite Hereford", base: 120000, cap: 4, photos: ["/suites/hereford1", "/suites/hereford2"] },
  { id: "suite-limousin", name: "Suite Limousin", base: 120000, cap: 4, photos: ["/suites/limousin1", "/suites/limousin2"] },
  { id: "suite-jersey", name: "Suite Jersey", base: 120000, cap: 4, photos: ["/suites/jersey1", "/suites/jersey2", "/suites/jersey3"] },
  { id: "suite-bonsmara", name: "Suite Bonsmara", base: 120000, cap: 4, photos: ["/suites/bonsmara1", "/suites/bonsmara2"] },
  { id: "suite-shorton", name: "Suite Shorton", base: 120000, cap: 4, photos: ["/suites/shorton1", "/suites/shorton2"] },
  { id: "cab-1", name: "Cabaña 1", base: 140000, cap: 4, photos: ["/cabanas/cabana11", "/cabanas/cabana12", "/cabanas/cabana13", "/cabanas/cabana14", "/cabanas/cabana15", "/cabanas/cabana16", "/cabanas/cabana17"] },
  { id: "cab-2", name: "Cabaña 2", base: 110000, cap: 2, photos: ["/cabanas/cabana12", "/cabanas/cabana13", "/cabanas/cabana14", "/cabanas/cabana15", "/cabanas/cabana16", "/cabanas/cabana17"] },
  { id: "hostel-a", name: "Hostel A", base: 90000, cap: 6, photos: ["/hostel/hostela1", "/hostel/hostela2", "/hostel/hostela3", "/hostel/hostela4", "/hostel/hostela5", "/hostel/hostela6"] },
  { id: "hostel-b", name: "Hostel B", base: 90000, cap: 6, photos: ["/hostel/hostelb1", "/hostel/hostelb2", "/hostel/hostelb3", "/hostel/hostelb4", "/hostel/hostelb6", "/hostel/hostelb8"] },
];

/* ---------- FOTOS REALES: /public/fotos ---------- */
const ESTANCIA_COUNT = 12;
const range = (n: number, prefix: string) => Array.from({ length: n }, (_, i) => `/fotos/${prefix}${i + 1}`);

const FOTOS = {
  fondo:       range(3,  "fondo"),
  verano:      range(10, "verano"),
  invierno:    range(6,  "invierno"),
  experiencias:range(8,  "experiencias"),
  evento:      range(7,  "evento"),
  plato:       range(7,  "plato"),
  estancia:    range(ESTANCIA_COUNT, "estancia"),
} as const;

/* ======== Tipos para comentarios de huéspedes ======== */
type Review = { name: string; rating: number; comment: string; date: string };
const REVIEWS_KEY = "morena_reviews_v1";

/* ===================== Página ===================== */
export default function EstanciaLanding() {
  const [lang, setLang] = useState<Lang>("es");
  const { t, ta, get } = useT(lang);
  const L = STRINGS[lang];

  // ====== Estado de reservas
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [roomId, setRoomId] = useState<string>(ROOMS[0].id);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ====== Estado de comentarios
  const [reviews, setReviews] = useState<Review[]>([]);
  const [revName, setRevName] = useState("");
  const [revRating, setRevRating] = useState<number>(5);
  const [revComment, setRevComment] = useState("");

  // cargar de localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(REVIEWS_KEY);
      const parsed = raw ? (JSON.parse(raw) as Review[]) : [];
      setReviews(parsed);
    } catch {
      setReviews([]);
    }
  }, []);

  const nights = useMemo(() => nightsBetween(checkIn, checkOut), [checkIn, checkOut]);
  const room = ROOMS.find(r => r.id === roomId) ?? ROOMS[0];

  const total = useMemo(() => {
    const base = room.base * Math.max(1, nights);
    const extra = Math.max(0, guests - 2) * 12000 * Math.max(1, nights);
    return base + extra;
  }, [room, nights, guests]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      toast.error(<div><div className="font-semibold">Oops</div><div>{L.booking.total.needDates}</div></div>);
      return;
    }
    setSubmitting(true);
    try {
      const form = new FormData(e.currentTarget);
      const payload = {
        nombre: form.get("nombre"),
        email: form.get("email"),
        whatsapp: form.get("whatsapp"),
        website: form.get("website"),
        checkIn, checkOut, guests, roomId, notes, total,
      };
      const res = await fetch("/api/reserva", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text();
        toast.error(`Error ${res.status}: ${txt || "Bad response"}`);
        setSubmitting(false);
        return;
      }
      toast(<div><div className="font-semibold">OK</div><div>{lang === "es" ? "Solicitud enviada." : "Request sent."}</div></div>);
    } catch (err) {
      console.error(err);
      toast.error("Hubo un error. Probá de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  // agregar review
  const addReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revComment.trim()) {
      toast.error(lang === "es" ? "Completá nombre y comentario." : "Please fill name and comment.");
      return;
    }
    const newRev: Review = {
      name: revName.trim(),
      rating: Math.min(5, Math.max(1, Number(revRating))),
      comment: revComment.trim(),
      date: new Date().toISOString(),
    };
    const next = [newRev, ...reviews];
    setReviews(next);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(next));
    setRevName("");
    setRevRating(5);
    setRevComment("");
    toast.success(lang === "es" ? "¡Gracias por tu comentario!" : "Thanks for your review!");
  };

  // *** SIN comentarios por defecto: solo se muestran los reales ***
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : "—";

  const baseStr = currency(room.base);
  const extraStr = currency(Math.max(0, guests - 2) * 12000);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Toaster />

      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="size-6" />
            <span className="font-semibold tracking-tight">{t("site")}</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#alojamiento" className="hover:underline">{t("nav.alojamiento")}</a>
            <a href="#experiencias" className="hover:underline">{t("nav.experiencias")}</a>
            <a href="#galeria" className="hover:underline">{t("nav.galeria")}</a>
            <a href="#como-llegar" className="hover:underline">{t("nav.como")}</a>
            <a href="#contacto" className="hover:underline">{t("nav.contacto")}</a>
          </nav>

          {/* Redes sociales + Reservar */}
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com/tuusuario"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-2 rounded-full hover:bg-neutral-100"
              title="Instagram"
            >
              <Instagram className="size-5" />
            </a>
            <a
              href="https://facebook.com/tuusuario"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="p-2 rounded-full hover:bg-neutral-100"
              title="Facebook"
            >
              <Facebook className="size-5" />
            </a>

            <button
              onClick={() => setLang(l => (l === "es" ? "en" : "es"))}
              className="text-sm px-3 py-1 rounded-full border hover:bg-neutral-100"
              aria-label="Cambiar idioma"
              title="Cambiar idioma"
            >
              {lang === "es" ? "EN" : "ES"}
            </button>
            <a href="#reservas" className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-80">
              <CalendarDays className="size-4" /> {t("nav.reservar")}
            </a>
          </div>
        </div>
      </header>

      {/* ===== HERO con carrusel de fondo (auto 2s) ===== */}
      <section className="relative">
        <HeroCarousel bases={FOTOS.fondo} alt="Fondo Estancia" autoMs={2000} />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto max-w-6xl px-4 w-full">
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white text-4xl md:text-6xl font-semibold leading-tight"
            >
              {t("hero.title").split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
            </motion.h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl text-white/90">{t("hero.subtitle")}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="#reservas"><Button size="lg" className="rounded-2xl">{t("hero.cta.disponibilidad")}</Button></a>
              <a href="#galeria"><Button size="lg" variant="secondary" className="rounded-2xl">{t("hero.cta.galeria")}</Button></a>
            </div>
            <div className="mt-8 flex items-center gap-4 text-white/90">
              <div className="flex items-center gap-1"><Star className="size-4 fill-white" /><span>{avgRating}</span></div>
              <div className="hidden md:flex items-center gap-2"><Users className="size-4" /> {t("hero.meta.guests", { n: 12 })}</div>
              <div className="hidden md:flex items-center gap-2"><MapPin className="size-4" /> {t("hero.meta.location")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid sm:grid-cols-3 md:grid-cols-6 gap-3">
          {FEATURE_KEYS.map(({ icon: Icon, key }, i) => (
            <Card key={i} className="rounded-2xl">
              <CardContent className="py-4 flex items-center gap-2 justify-center">
                <Icon className="size-5" />
                <span className="text-sm font-medium">{t(`features.${key}`)}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Alojamiento */}
      <section id="alojamiento" className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl md:text-3xl font-semibold">{t("sections.alojamiento")}</h2>
          <Badge variant="secondary" className="rounded-full">{t("sections.tarifas")}</Badge>
        </div>
        <p className="mt-2 text-neutral-600">
          {lang === "es"
            ? "Elegí tu espacio ideal. Las tarifas son por noche, base 2 personas."
            : "Choose your ideal space. Rates are per night, base 2 guests."}
        </p>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {ROOMS.map(r => (
            <Card key={r.id} className="overflow-hidden rounded-2xl">
              <Carousel bases={r.photos} alt={r.name} />
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{r.name}</h3>
                  <div className="text-right">
                    <div className="text-sm text-neutral-500">{t("rooms.desde")}</div>
                    <div className="font-semibold">{currency(r.base)}</div>
                  </div>
                </div>
                {r.perks?.length ? (
                  <ul className="mt-3 text-sm text-neutral-600 list-disc pl-5 space-y-1">
                    {r.perks.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                ) : null}
                <div className="mt-4">
                  <Button
                    variant="secondary"
                    className="w-full rounded-xl"
                    onClick={() => {
                      setRoomId(r.id);
                      document.getElementById("reservas")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    {t("rooms.elegir")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Experiencias */}
      <section id="experiencias" className="bg-white border-y">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-semibold">{t("sections.experiencias")}</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            {[
              { icon: Sun,        title: lang === "es" ? "Verano" : "Summer",       desc: lang === "es" ? "Pileta, kayaks, recorridos en bicicleta y cuatriclico, atardeceres infinitos." : "Pool, kayaks, bike and ATV tours, endless sunsets.", fotos: FOTOS.verano },
              { icon: Snowflake,  title: lang === "es" ? "Invierno" : "Winter",     desc: lang === "es" ? "Fogón, vinos, nieve y cielos estrellados." : "Bonfires, wine, snow and starry skies.",    fotos: FOTOS.invierno },
              { icon: Sparkles,   title: lang === "es" ? "Experiencias" : "Experiences", desc: lang === "es" ? "Fauna local, platos exquisitos, campamentos y más!" : "Local wildlife, exquisite dishes, camping, and more!", fotos: FOTOS.experiencias },
            ].map(({ icon: Icon, title, desc, fotos }, i) => (
              <Card key={i} className="rounded-2xl overflow-hidden">
                <Carousel bases={fotos} alt={title} aspect="aspect-[16/10]" />
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Icon className="size-6" />
                    <h3 className="text-lg font-semibold">{title}</h3>
                  </div>
                  <p className="mt-2 text-neutral-600">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Instalaciones */}
      <section className="bg-white border-y">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-semibold">{t("sections.instalaciones")}</h2>
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-12 grid md:grid-cols-3 gap-6">
          <Card className="rounded-2xl"><CardContent className="p-6"><h3 className="text-lg font-semibold">{lang === "es" ? "Sistema" : "System"}</h3><p className="text-neutral-700 mt-2 text-sm">{t("instalaciones.sistema")}</p></CardContent></Card>
          <Card className="rounded-2xl"><CardContent className="p-6"><h3 className="text-lg font-semibold">{lang === "es" ? "Restaurante" : "Restaurant"}</h3><p className="text-neutral-700 mt-2 text-sm">{t("instalaciones.restaurant")}</p></CardContent></Card>
          <Card className="rounded-2xl"><CardContent className="p-6"><h3 className="text-lg font-semibold">{lang === "es" ? "Casa de té" : "Tea house"}</h3><p className="text-neutral-700 mt-2 text-sm">{t("instalaciones.casaTe")}</p></CardContent></Card>
        </div>
      </section>

      {/* Gastronomía (Platos) */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-semibold">{t("sections.platos")}</h2>
        <p className="text-neutral-600 mt-2">{lang === "es" ? "Algunos de nuestros platos caseros." : "Some of our homemade dishes."}</p>
        <div className="mt-6">
          <Card className="rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <Carousel bases={FOTOS.plato} alt="Platos" aspect="aspect-[4/2]" />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Eventos con carrusel al costado */}
      <section className="bg-white border-y">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-semibold">{t("sections.eventos")}</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">{t("eventosHead.emp")}</h3>
                <ul className="mt-2 list-disc pl-5 space-y-1 text-neutral-700">
                  {(ta("eventosEmp") || []).map((e, i) => (<li key={i}>{e}</li>))}
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">{t("eventosHead.soc")}</h3>
                <ul className="mt-2 list-disc pl-5 space-y-1 text-neutral-700">
                  {(ta("eventosSoc") || []).map((e, i) => (<li key={i}>{e}</li>))}
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-2xl overflow-hidden md:row-span-1">
              <CardContent className="p-0">
                <Carousel bases={FOTOS.evento} alt="Eventos" aspect="aspect-[16/12]" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Actividades (texto) */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-semibold">{t("sections.actividades")}</h2>
        <ul className="mt-4 grid md:grid-cols-2 gap-2 text-neutral-700 list-disc pl-6">
          {(ta("activities") || []).map((a: string, i: number) => <li key={i}>{a}</li>)}
        </ul>
      </section>

      {/* ===================== GALERÍA (SOLO ESTANCIA) ===================== */}
      <section id="galeria" className="bg-white border-t">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-semibold">{t("sections.galeria")}</h2>
          <div className="mt-6 grid grid-cols-1 gap-8">
            <Card className="rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <Carousel bases={FOTOS.estancia} alt="Estancia" aspect="aspect-[12/6]" />
                <div className="p-5">
                  <h3 className="text-lg font-semibold">Estancia</h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    {lang === "es" ? "Postales generales de la estancia." : "General views of the ranch."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Cómo llegar */}
      <section id="como-llegar" className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-semibold">{t("sections.como")}</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-2"><MapPin className="size-5" /> <strong>{LOCATION}</strong></div>
              <p className="text-neutral-700 mt-2 text-sm">
                {lang === "es"
                  ? "A 180 km de CABA por AU Ezeiza-Cañuelas (2 h 20 min aprox.). Enviamos ubicación por WhatsApp al confirmar."
                  : "180 km from Buenos Aires via Ezeiza-Cañuelas Hwy (approx. 2 h 20 min). We send the location on WhatsApp upon confirmation."}
              </p>
              <ul className="mt-3 text-sm text-neutral-700 list-disc pl-5 space-y-1">
                <li>{lang === "es" ? "Coordenadas: −33.20, −65.41" : "Coordinates: −33.20, −65.41"}</li>
                <li>{lang === "es" ? "Camino consolidado, accesible en auto convencional" : "Consolidated road, accessible with regular car"}</li>
              </ul>
            </CardContent>
          </Card>
          <div className="rounded-2xl overflow-hidden border bg-white">
            <iframe title="Mapa" className="w-full h-[280px]" src="https://www.google.com/maps?q=San%20Jos%C3%A9%20del%20Morro%2C%20San%20Luis%2C%20Argentina&z=14&output=embed" />
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-semibold">{t("sections.contacto")}</h2>
        <p className="text-neutral-600 mt-2">{t("contact.subtitle")}</p>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-2"><Phone className="size-5" /> <span>+54 9 2392 440994</span></div>
              <div className="flex items-center gap-2 mt-2"><Mail className="size-5" /> <span>estancialamorena0@gmail.com</span></div>
              <div className="flex items-center gap-3 mt-3">
                <a
                  href="https://instagram.com/tuusuario"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:underline"
                >
                  <Instagram className="size-5" /> Instagram
                </a>
                <a
                  href="https://facebook.com/tuusuario"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:underline"
                >
                  <Facebook className="size-5" /> Facebook
                </a>
              </div>
              <p className="text-sm text-neutral-600 mt-3">
                {lang === "es" ? "También atendemos por Instagram y WhatsApp." : "We also reply via Instagram and WhatsApp."}
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold">{lang === "es" ? "Eventos y grupos" : "Events & groups"}</h3>
              <p className="text-sm text-neutral-700 mt-2">
                {lang === "es"
                  ? "Consultanos por retiros, workshops y celebraciones. Podemos armar presupuestos a medida con gastronomía y actividades."
                  : "Ask us about retreats, workshops and celebrations. We can tailor quotes with catering and activities."}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Reservas (lo dejo al final para los links del footer) */}
      <section id="reservas" className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold">{t("booking.title")}</h2>
              <p className="text-neutral-600 text-sm mt-1">{t("booking.subtitle")}</p>

              <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>{t("booking.labels.checkin")}</Label><Input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} required /></div>
                <div className="space-y-2"><Label>{t("booking.labels.checkout")}</Label><Input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} required /></div>
                <div className="space-y-2"><Label>{t("booking.labels.guests")}</Label><Input type="number" min={1} max={12} value={guests} onChange={e => setGuests(Math.max(1, Number(e.target.value || 1)))} /></div>
                <div className="space-y-2">
                  <Label>{t("booking.labels.type")}</Label>
                  <Select value={roomId} onValueChange={setRoomId}>
                    <SelectTrigger className="w-full"><SelectValue placeholder={lang === "es" ? "Elegí una opción" : "Choose an option"} /></SelectTrigger>
                    <SelectContent>{ROOMS.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2"><Label>{t("booking.labels.notes")}</Label><Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder={t("booking.placeholders.notes")} /></div>

                <div className="space-y-2"><Label>Nombre</Label><Input name="nombre" required /></div>
                <div className="space-y-2"><Label>Email</Label><Input name="email" type="email" required /></div>
                <div className="space-y-2"><Label>WhatsApp (opcional)</Label><Input name="whatsapp" placeholder="+54 9 ..." /></div>

                <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
                <input type="hidden" name="roomId" value={roomId ?? ""} />

                <div className="md:col-span-2 flex items-center justify-between gap-4">
                  <div className="text-sm text-neutral-600">
                    {nights > 0 ? (
                      <>
                        <div>{nights} {lang === "es" ? "noche(s)" : "night(s)"} · {room.name} · {guests} {lang === "es" ? "huésped(es)" : "guest(s)"}</div>
                        <div className="font-medium">{t("booking.total.title")}: {currency(total)}</div>
                        <div className="text-xs">{L.booking.total.includes(baseStr, extraStr)}</div>
                      </>
                    ) : (<div>{t("booking.total.needDates")}</div>)}
                  </div>
                  <Button type="submit" size="lg" className="rounded-2xl min-w-48" disabled={submitting}>
                    {submitting ? (<><Loader2 className="size-4 animate-spin" /> {lang === "es" ? "Enviando…" : "Sending…"}</>) : (<>{t("booking.submit")} <ChevronRight className="size-4" /></>)}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Lateral info */}
          <div className="space-y-6">
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">{t("booking.stepsTitle")}</h3>
                <ol className="mt-2 text-sm text-neutral-700 list-decimal pl-5 space-y-1">
                  {(ta("booking.steps") || []).map((s, i) => (<li key={i}>{s}</li>))}
                </ol>
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">{t("booking.incluye.title")}</h3>
                <ul className="mt-2 text-sm text-neutral-700 list-disc pl-5 space-y-1">
                  {(get("booking.incluye.items") as string[]).map((it, i) => (<li key={i}>{it}</li>))}
                </ul>
                <h3 className="text-lg font-semibold mt-4">{t("booking.noIncluye.title")}</h3>
                <ul className="mt-2 text-sm text-neutral-700 list-disc pl-5 space-y-1">
                  {(get("booking.noIncluye.items") as string[]).map((it, i) => (<li key={i}>{it}</li>))}
                </ul>
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">{t("booking.contactoDirecto.title")}</h3>
                <div className="mt-3 space-y-2 text-sm">
                  <a className="flex items-center gap-2 hover:underline" href="tel:+5492392440994"><Phone className="size-4" /> +54 9 2392 440994</a>
                  <a className="flex items-center gap-2 hover:underline" href="mailto:estancialamorena0@gmail.com"><Mail className="size-4" /> estancialamorena0@gmail.com</a>
                  <div className="flex items-center gap-2 text-neutral-600"><Clock className="size-4" /> {t("booking.contactoDirecto.horario")}</div>
                  <div className="flex items-center gap-3">
                    <a href="https://instagram.com/tuusuario" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:underline">
                      <Instagram className="size-4" /> Instagram
                    </a>
                    <a href="https://facebook.com/tuusuario" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:underline">
                      <Facebook className="size-4" /> Facebook
                    </a>
                  </div>
                  <div className="text-neutral-600">{t("booking.contactoDirecto.nota")}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ===== Testimonios + Formulario (AHORA AL FINAL) ===== */}
      <section className="bg-white border-y">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-semibold">{t("testimonials.title")}</h2>
            <div className="text-sm text-neutral-600">
              {lang === "es" ? "Puntaje promedio" : "Average rating"}:{" "}
              <span className="font-medium">{avgRating} / 5</span> · {reviews.length}{" "}
              {lang === "es" ? "opiniones" : "reviews"}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-12 grid lg:grid-cols-3 gap-6">
          {/* Cards de reviews */}
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
            {reviews.map((r, i) => (
              <Card key={i} className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{r.name}</div>
                    <div className="flex gap-1 text-amber-500" aria-label={`${r.rating} estrellas`}>
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} className={`size-4 ${idx < r.rating ? "fill-amber-500" : ""}`} />
                      ))}
                    </div>
                  </div>
                  <p className="mt-3">{`“${r.comment}”`}</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {new Date(r.date).toLocaleDateString(lang === "es" ? "es-AR" : "en-US")}
                  </p>
                </CardContent>
              </Card>
            ))}
            {reviews.length === 0 && (
              <div className="text-sm text-neutral-600 md:col-span-2">
                {lang === "es" ? "Todavía no hay comentarios. ¡Sé la primera persona en dejar uno!" : "No reviews yet. Be the first to leave one!"}
              </div>
            )}
          </div>

          {/* Formulario para dejar comentario */}
          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold">{t("sections.dejaComentario")}</h3>
              <form className="mt-4 space-y-3" onSubmit={addReview}>
                <div className="space-y-1">
                  <Label htmlFor="revName">{t("sections.tuNombre")}</Label>
                  <Input id="revName" value={revName} onChange={e => setRevName(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="revRating">{t("sections.tuPuntaje")}</Label>
                  <Select value={String(revRating)} onValueChange={(v) => setRevRating(Number(v))}>
                    <SelectTrigger id="revRating" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5,4,3,2,1].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="revComment">{t("sections.tuComentario")}</Label>
                  <Textarea id="revComment" rows={4} value={revComment} onChange={e => setRevComment(e.target.value)} required />
                </div>
                <Button type="submit" className="rounded-2xl w-full">{t("sections.enviarComentario")}</Button>
                <p className="text-xs text-neutral-500">
                  {lang === "es"
                    ? "Al enviar aceptás que mostremos tu nombre y comentario en esta página (no se publica tu email)."
                    : "By submitting you agree we may show your name and comment on this page (your email is not published)."}
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-neutral-600">
          <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-neutral-800">
              <Home className="size-5" /> Estancia La Morena
            </div>
            <div className="flex items-center gap-6">
              <a className="hover:underline" href="#reservas">{L.footer.reservas}</a>
              <a className="hover:underline" href="#como-llegar">{L.footer.como}</a>
              <a className="hover:underline" href="#contacto">{L.footer.contacto}</a>
              <a
                href="https://instagram.com/tuusuario"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:opacity-80"
                aria-label="Instagram"
                title="Instagram"
              >
                <Instagram className="size-4" /> Instagram
              </a>
              <a
                href="https://facebook.com/tuusuario"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:opacity-80"
                aria-label="Facebook"
                title="Facebook"
              >
                <Facebook className="size-4" /> Facebook
              </a>
            </div>
          </div>
          <div className="mt-4">© {new Date().getFullYear()} Estancia La Morena. {L.footer.derechos}</div>
        </div>
      </footer>
    </div>
  );
}
