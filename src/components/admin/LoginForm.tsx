"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const password = String(new FormData(e.currentTarget).get("password") ?? "");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    }).catch(() => null);
    if (res?.ok) {
      router.replace("/admin");
      router.refresh();
      return;
    }
    const json = (await res?.json().catch(() => ({}))) as { message?: string } | undefined;
    setError(json?.message ?? "Connexion impossible.");
    setBusy(false);
  }

  return (
    <form className="adm-card adm-form" onSubmit={onSubmit}>
      <label>
        Mot de passe
        <input name="password" type="password" autoComplete="current-password" required autoFocus />
      </label>
      {error && <p className="adm-alert" role="alert">{error}</p>}
      <button className="adm-btn adm-btn--primary" type="submit" disabled={busy}>
        {busy ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
