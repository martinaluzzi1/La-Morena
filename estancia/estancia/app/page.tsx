"use client";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { CalendarDays, Mail, MapPin, Phone, Star, Users, Home, Sun, Trees, Snowflake, Sparkles, Wifi, Car, PawPrint, Mountain, Beef, Clock, ChevronRight, Loader2 } from "lucide-react";
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

// --- Utilidades simples ---
const currency = (n:number) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
const nightsBetween = (inStr:string, outStr:string) => {
  const inD = inStr ? new Date(inStr) : null;
  const outD = outStr ? new Date(outStr) : null;
  if (!inD || !outD) return 0;
  const ms = outD.getTime() - inD.getTime();
  return Math.max(0, Math.round(ms / (1000*60*60*24)));
};

// --- Datos reales (ajustá precios/fotos si querés) ---
const SITE_NAME = "Estancia La Morena";
const LOCATION = "San José del Morro, San Luis, Argentina";

const FEATURES = [
  { icon: Wifi, label: "Wi-Fi rural" },
  { icon: Beef, label: "Cocina casera · All Inclusive" },
  { icon: PawPrint, label: "Pet-friendly" },
  { icon: Trees, label: "Senderismo y travesías" },
  { icon: Mountain, label: "Ascenso al volcán El Morro" },
  { icon: Car, label: "Estacionamiento" },
];

const ACTIVITIES = [
  "Senderismo / trekking con ascenso al volcán",
  "Bicicleteadas con ascenso al volcán",
  "Cabalgatas con ascenso al volcán",
  "Retiros espirituales",
  "Encuentros de yoga y astrológicos",
  "Avistaje de aves y cóndores",
  "Travesías",
];

const EVENTS_EMP = [
  "Brainstormings empresariales",
  "Fiestas de fin de año",
  "Presentaciones de producto",
  "Demostraciones 4x4",
];

const EVENTS_SOC = [
  "Casamientos","Cumpleaños","15 años","Bautismos",
  "Mitzvot","Producciones fotográficas","Rodajes",
];

const INSTALACIONES = {
  sistema: "All Inclusive con distintos tipos de alojamiento y espacios comunes",
  restaurant: "Restaurante para 150 personas",
  casaTe: "Casa de té con minutas, repostería y blends",
};

type Room = {
  id: string;
  name: string;
  base: number;
  cap: number;
  img: string;
  perks?: string[];
};

const ROOMS: Room[] = [
  // Suites (7)
  { id: "suite-bradford",  name: "Suite Bradford",  base: 120000, cap: 4, img: "/suites/bradford.jpg" },
  { id: "suite-charolais", name: "Suite Charolais", base: 120000, cap: 4, img: "/suites/charolais.jpg" },
  { id: "suite-hereford",  name: "Suite Hereford",  base: 120000, cap: 4, img: "/suites/hereford.jpg" },
  { id: "suite-limousin",  name: "Suite Limousin",  base: 120000, cap: 4, img: "/suites/limousin.jpg" },
  { id: "suite-jersey",    name: "Suite Jersey",    base: 120000, cap: 4, img: "/suites/jersey.jpg" },
  { id: "suite-bonsmara",  name: "Suite Bonsmara",  base: 120000, cap: 4, img: "/suites/bonsmara.jpg" },
  { id: "suite-shorton",   name: "Suite Shorton",   base: 120000, cap: 4, img: "/suites/shorton.jpg" },
  // Cabañas
  { id: "cab-1", name: "Cabaña 1", base: 140000, cap: 4, img: "/cabanas/1.jpg" },
  { id: "cab-2", name: "Cabaña 2", base: 110000, cap: 2, img: "/cabanas/2.jpg" },
  // Hostels
  { id: "hostel-a", name: "Hostel A", base: 90000, cap: 6, img: "/hostel/a.jpg" },
  { id: "hostel-b", name: "Hostel B", base: 90000, cap: 6, img: "/hostel/b.jpg" },
];

const HIGHLIGHTS = [
  { icon: Sun, title: "Verano", desc: "Pileta, kayaks y atardeceres infinitos." },
  { icon: Snowflake, title: "Invierno", desc: "Fogón, vinos y cielos estrellados." },
  { icon: Sparkles, title: "Experiencias", desc: "Clases de cocina, ordeñe y paseo en sulky." },
];

const GALLERY = [
  "/gallery/1.jpg","/gallery/2.jpg","/gallery/3.jpg",
  "/gallery/4.jpg","/gallery/5.jpg","/gallery/6.jpg",
];

// --- Componente Principal ---
export default function EstanciaLanding(){
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [roomId, setRoomId] = useState<string | null>(ROOMS[0].id);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const nights = useMemo(()=> nightsBetween(checkIn, checkOut), [checkIn, checkOut]);
  const room = ROOMS.find(r=> r.id === roomId) ?? ROOMS[0];
  const total = useMemo(()=> {
    const base = room.base * Math.max(1, nights);
    const extra = Math.max(0, guests - 2) * 12000 * Math.max(1, nights); // cargo por huésped extra
    return base + extra;
  }, [room, nights, guests]);

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut || !name || !email) {
      toast.error(
        <div>
          <div className="font-semibold">Faltan datos</div>
          <div>Completá fechas, nombre y correo.</div>
        </div>
      );
      return;
    }
    setSubmitting(true);
    // Simulación de envío — acá integrarías tu backend / formulario (Formspree, Airtable, Supabase, etc.)
    setTimeout(()=>{
      setSubmitting(false);
      toast(
        <div>
          <div className="font-semibold">Solicitud enviada</div>
          <div>Gracias, {name}. Te escribimos a {email} para confirmar la reserva.</div>
        </div>
      );
    }, 1100);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Toaster />
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="size-6" />
            <span className="font-semibold tracking-tight">Estancia La Morena</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#alojamiento" className="hover:underline">Alojamiento</a>
            <a href="#experiencias" className="hover:underline">Experiencias</a>
            <a href="#galeria" className="hover:underline">Galería</a>
            <a href="#como-llegar" className="hover:underline">Cómo llegar</a>
            <a href="#contacto" className="hover:underline">Contacto</a>
          </nav>
          <a href="#reservas" className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-80"><CalendarDays className="size-4"/> Reservar</a>
        </div>
      </header>

      {/* Hero */}
<section className="relative">
  <div className="absolute inset-0 -z-10">
    {/* tu foto local optimizada por Next */}
    {/* si querés dejar <img>, también sirve, pero Next/Image optimiza */}
    {/* importá Image arriba:  import Image from "next/image"; */}
    <Image
      src="/hero.jpg"
      alt="Estancia La Morena"
      fill
      priority
      className="object-cover"
    />
    {/* velo para legibilidad: usa tu verde bosque con opacidad */}
    <div className="absolute inset-0 bg-[hsl(143_47%_24%/_0.45)]" />
  </div>

  <div className="mx-auto max-w-6xl px-4 py-24 md:py-40 text-black">
    <motion.h1
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-4xl md:text-6xl font-semibold leading-tight"
    >
      Descanso de campo, <br /> a pocas horas de la ciudad
    </motion.h1>
    <p className="mt-4 max-w-2xl text-lg md:text-xl text-black/90">
      Naturaleza, confort y experiencias auténticas en una estancia boutique.
    </p>
    <div className="mt-8 flex flex-col sm:flex-row gap-3">
      <a href="#reservas">
        <Button size="lg" className="rounded-2xl">Consultar disponibilidad</Button>
      </a>
      <a href="#galeria">
        <Button size="lg" variant="secondary" className="rounded-2xl">Ver galería</Button>
      </a>
    </div>
    <div className="mt-8 flex items-center gap-4 text-black/90">
      <div className="flex items-center gap-1"><Star className="size-4 fill-black" /> <span>4.9</span></div>
      <div className="hidden md:flex items-center gap-2"><Users className="size-4" /> Hasta 12 huéspedes</div>
      <div className="hidden md:flex items-center gap-2"><MapPin className="size-4" /> San José del Morro, San Luis, Argentina</div>
    </div>
  </div>
</section>


      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid sm:grid-cols-3 md:grid-cols-6 gap-3">
          {FEATURES.map((f, i)=> (
            <Card key={i} className="rounded-2xl">
              <CardContent className="py-4 flex items-center gap-2 justify-center">
                <f.icon className="size-5"/>
                <span className="text-sm font-medium">{f.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Alojamiento */}
      <section id="alojamiento" className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl md:text-3xl font-semibold">Alojamiento</h2>
          <Badge variant="secondary" className="rounded-full">Tarifas demo</Badge>
        </div>
        <p className="mt-2 text-neutral-600">Elegí tu espacio ideal. Las tarifas son por noche, base 2 personas.</p>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {ROOMS.map(r => (
            <Card key={r.id} className="overflow-hidden rounded-2xl">
              <img src={r.img} alt={r.name} className="h-44 w-full object-cover"/>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{r.name}</h3>
                  <div className="text-right"><div className="text-sm text-neutral-500">desde</div><div className="font-semibold">{currency(r.base)}</div></div>
                </div>
                <ul className="mt-3 text-sm text-neutral-600 list-disc pl-5 space-y-1">
  {(r.perks ?? []).map((p, i) => <li key={i}>{p}</li>)}
</ul>

                <div className="mt-4">
                  <Button variant={roomId===r.id?"default":"secondary"} onClick={()=> setRoomId(r.id)} className="w-full rounded-xl">Elegir</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Experiencias */}
      <section id="experiencias" className="bg-white border-y">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-semibold">Experiencias</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            {HIGHLIGHTS.map((h, i)=> (
              <Card key={i} className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <h.icon className="size-6"/>
                    <h3 className="text-lg font-semibold">{h.title}</h3>
                  </div>
                  <p className="mt-2 text-neutral-600">{h.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Instalaciones */}
<section className="bg-white border-y">
  <div className="mx-auto max-w-6xl px-4 py-12">
    <h2 className="text-2xl md:text-3xl font-semibold">Instalaciones</h2>
    <div className="mt-6 grid md:grid-cols-3 gap-6">
      <Card className="rounded-2xl"><CardContent className="p-6">
        <h3 className="text-lg font-semibold">Sistema</h3>
        <p className="text-neutral-700 mt-2 text-sm">{INSTALACIONES.sistema}</p>
      </CardContent></Card>
      <Card className="rounded-2xl"><CardContent className="p-6">
        <h3 className="text-lg font-semibold">Restaurante</h3>
        <p className="text-neutral-700 mt-2 text-sm">{INSTALACIONES.restaurant}</p>
      </CardContent></Card>
      <Card className="rounded-2xl"><CardContent className="p-6">
        <h3 className="text-lg font-semibold">Casa de té</h3>
        <p className="text-neutral-700 mt-2 text-sm">{INSTALACIONES.casaTe}</p>
      </CardContent></Card>
    </div>
  </div>
</section>

{/* Actividades */}
<section className="mx-auto max-w-6xl px-4 py-12">
  <h2 className="text-2xl md:text-3xl font-semibold">Actividades</h2>
  <ul className="mt-4 grid md:grid-cols-2 gap-2 text-neutral-700 list-disc pl-6">
    {ACTIVITIES.map((a,i)=>(<li key={i}>{a}</li>))}
  </ul>
</section>

{/* Eventos */}
<section className="bg-white border-y">
  <div className="mx-auto max-w-6xl px-4 py-12">
    <h2 className="text-2xl md:text-3xl font-semibold">Eventos</h2>
    <div className="mt-6 grid md:grid-cols-2 gap-6">
      <Card className="rounded-2xl"><CardContent className="p-6">
        <h3 className="text-lg font-semibold">Empresariales</h3>
        <ul className="mt-2 list-disc pl-5 space-y-1 text-neutral-700">
          {EVENTS_EMP.map((e,i)=>(<li key={i}>{e}</li>))}
        </ul>
      </CardContent></Card>
      <Card className="rounded-2xl"><CardContent className="p-6">
        <h3 className="text-lg font-semibold">Sociales</h3>
        <ul className="mt-2 list-disc pl-5 space-y-1 text-neutral-700">
          {EVENTS_SOC.map((e,i)=>(<li key={i}>{e}</li>))}
        </ul>
      </CardContent></Card>
    </div>
  </div>
</section>


      {/* Reservas */}
      <section id="reservas" className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Panel calculadora */}
          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold">Consultá disponibilidad</h2>
              <p className="text-neutral-600 text-sm mt-1">Confirmamos por mail o WhatsApp.</p>

              <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Check‑in</Label>
                  <Input type="date" value={checkIn} onChange={(e)=> setCheckIn(e.target.value)} required/>
                </div>
                <div className="space-y-2">
                  <Label>Check‑out</Label>
                  <Input type="date" value={checkOut} onChange={(e)=> setCheckOut(e.target.value)} required/>
                </div>
                <div className="space-y-2">
                  <Label>Huéspedes</Label>
                  <Input type="number" min={1} max={12} value={guests} onChange={(e)=> setGuests(parseInt(e.target.value||"1"))} />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de alojamiento</Label>
                  <Select value={roomId ?? undefined} onValueChange={setRoomId as any}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Elegí una opción"/></SelectTrigger>
                    <SelectContent>
                      {ROOMS.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Comentarios</Label>
                  <Textarea value={notes} onChange={(e)=> setNotes(e.target.value)} placeholder="¿Necesitás cuna, late check‑out, dieta especial?"/>
                </div>

                <div className="space-y-2 md:col-span-2 border-t pt-4">
                  <Label>Datos de contacto</Label>
                  <div className="grid md:grid-cols-3 gap-3">
                    <Input placeholder="Nombre y apellido" value={name} onChange={(e)=> setName(e.target.value)} required/>
                    <Input type="email" placeholder="Correo" value={email} onChange={(e)=> setEmail(e.target.value)} required/>
                    <Input type="tel" placeholder="WhatsApp (opcional)" value={phone} onChange={(e)=> setPhone(e.target.value)}/>
                  </div>
                </div>

                <div className="md:col-span-2 flex items-center justify-between gap-4">
                  <div className="text-sm text-neutral-600">
                    {nights>0 ? (
                      <>
                        <div>{nights} noche(s) · {room.name} · {guests} huésped(es)</div>
                        <div className="font-medium">Total estimado: {currency(total)}</div>
                        <div className="text-xs">Incluye {currency(room.base)} base + {currency(Math.max(0, guests-2)*12000)} x noche por extras.</div>
                      </>
                    ) : <div>Elegí fechas para ver el total estimado.</div>}
                  </div>
                  <Button type="submit" size="lg" className="rounded-2xl min-w-48" disabled={submitting}>
                    {submitting ? (<><Loader2 className="size-4 animate-spin"/> Enviando…</>) : (<>Solicitar reserva <ChevronRight className="size-4"/></>)}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Info lateral */}
          <div className="space-y-6">
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">Cómo funciona</h3>
                <ol className="mt-2 text-sm text-neutral-700 list-decimal pl-5 space-y-1">
                  <li>Enviás la solicitud con tus fechas.</li>
                  <li>Confirmamos disponibilidad y precio final por mensaje.</li>
                  <li>Seña del 30% para garantizar la reserva.</li>
                  <li>Cancelación sin cargo hasta 7 días antes.</li>
                </ol>
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">Incluye</h3>
                <ul className="mt-2 text-sm text-neutral-700 list-disc pl-5 space-y-1">
                  <li>Desayuno de campo</li>
                  <li>Ropa blanca y amenities</li>
                  <li>Uso de bicis, kayaks y pileta</li>
                </ul>
                <h3 className="text-lg font-semibold mt-4">No incluye</h3>
                <ul className="mt-2 text-sm text-neutral-700 list-disc pl-5 space-y-1">
                  <li>Traslados</li>
                  <li>Actividades guiadas especiales</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">Contacto directo</h3>
                <div className="mt-3 space-y-2 text-sm">
                  <a className="flex items-center gap-2 hover:underline" href="tel:+549612111"><Phone className="size-4"/> +54 9 11 1234‑5678</a>
                  <a className="flex items-center gap-2 hover:underline" href="mailto:hola@estancialalaguna.com"><Mail className="size-4"/> hola@estancialalaguna.com</a>
                  <div className="flex items-center gap-2 text-neutral-600"><Clock className="size-4"/> 9:00–18:00 (ARG)</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Galería */}
      <section id="galeria" className="bg-white border-t">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-semibold">Galería</h2>
          <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {GALLERY.map((src, i)=> (
              <img key={i} src={src} alt={`Foto ${i+1}`} className="rounded-2xl aspect-[4/3] object-cover"/>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo llegar */}
      <section id="como-llegar" className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-semibold">Cómo llegar</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-2"><MapPin className="size-5"/> <strong>San José del Morro, San Luis, Argentina</strong></div>
              <p className="text-neutral-700 mt-2 text-sm">A 180 km de CABA por AU Ezeiza‑Cañuelas (2 h 20 min aprox.). Enviamos ubicación por WhatsApp al confirmar.</p>
              <ul className="mt-3 text-sm text-neutral-700 list-disc pl-5 space-y-1">
                <li>Coordenadas: −33.20, −65.41</li>
                <li>Camino consolidado, accesible en auto convencional</li>
              </ul>
            </CardContent>
          </Card>
          <div className="rounded-2xl overflow-hidden border bg-white">
            {/* Mapa embebido — reemplazá src por tu mapa real */}
            <iframe title="Mapa" className="w-full h-[280px]" src="https://https://www.google.com/maps?q=San%20Jos%C3%A9%20del%20Morro%2C%20San%20Luis%2C%20Argentina&z=14&output=embedmaps.app.goo.gl/tGQcC5dYMheiCQPD7"/>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="bg-white border-y">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-semibold">Lo que dicen los huéspedes</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            {["Increíble paz y atención.", "Volvemos todos los años.", "Desconexión total, super recomendable."].map((t, i)=> (
              <Card key={i} className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex gap-1 text-amber-500"><Star className="size-4 fill-amber-500"/><Star className="size-4 fill-amber-500"/><Star className="size-4 fill-amber-500"/><Star className="size-4 fill-amber-500"/><Star className="size-4 fill-amber-500"/></div>
                  <p className="mt-3">“{t}”</p>
                  <p className="mt-1 text-sm text-neutral-600">— Huésped verificado</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-semibold">¿Tenés dudas?</h2>
        <p className="text-neutral-600 mt-2">Escribinos y armamos tu escapada.</p>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-2"><Phone className="size-5"/> <span>+54 9 11 1234‑5678</span></div>
              <div className="flex items-center gap-2 mt-2"><Mail className="size-5"/> <span>hola@estancialalaguna.com</span></div>
              <p className="text-sm text-neutral-600 mt-3">También atendemos por Instagram y WhatsApp.</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold">Eventos y grupos</h3>
              <p className="text-sm text-neutral-700 mt-2">Consultanos por retiros, workshops y celebraciones. Podemos armar presupuestos a medida con gastronomía y actividades.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-neutral-600">
          <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-neutral-800"><Home className="size-5"/> Estancia La Morena</div>
            <div className="flex gap-4">
              <a className="hover:underline" href="#reservas">Reservas</a>
              <a className="hover:underline" href="#como-llegar">Cómo llegar</a>
              <a className="hover:underline" href="#contacto">Contacto</a>
            </div>
          </div>
          <div className="mt-4">© {new Date().getFullYear()} Estancia La Morena. Todos los derechos reservados.</div>
        </div>
      </footer>
    </div>
  );
}
