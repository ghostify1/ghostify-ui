import { useState } from "react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function Home() {
  const [email, setEmail] = useState("");

  return (
    <div className="mx-auto max-w-3xl px-4">
      <section className="text-center mt-16 sm:mt-24">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Dijital izlerini <span className="text-primary drop-shadow-glow">sil.</span> Şimdi başla.
        </h1>
        <p className="mt-4 text-[var(--muted)]">E-posta adresini gir, taramayı başlat.</p>
      </section>

      <Card className="mt-10 p-5 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="email@ornek.com"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" className="w-full sm:w-auto">Taramayı Başlat</Button>
        </div>
      </Card>
    </div>
  );
}
