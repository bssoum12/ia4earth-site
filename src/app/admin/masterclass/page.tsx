import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/adminAuth";
import { MASTERCLASSES, MASTERCLASS_CAPACITY, MASTERCLASS_DAYS } from "@/lib/content";
import { masterclass } from "@/lib/masterclass";

export const dynamic = "force-dynamic";

const fmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short", timeZone: "Africa/Tunis" });

export default async function AdminMasterclassPage() {
  if (!isAdmin()) redirect("/admin/login");

  let list;
  try {
    list = await masterclass.list();
  } catch (e) {
    console.error("[admin] masterclass", e);
    return (
      <main className="adm-main">
        <p className="adm-alert">
          Le stockage des inscriptions est indisponible. En production, définissez <code>SUPABASE_URL</code> et <code>SUPABASE_SERVICE_ROLE_KEY</code> et exécutez <code>supabase/schema.sql</code>.
        </p>
      </main>
    );
  }

  return (
    <main className="adm-main">
      <header className="adm-head">
        <div>
          <h1>Inscriptions aux master class</h1>
          <p className="adm-muted">
            {list.length} inscription{list.length > 1 ? "s" : ""} · {MASTERCLASS_CAPACITY} places par master class
          </p>
        </div>
        <div className="adm-actions">
          <a className="adm-btn" href="/admin">Participants</a>
        </div>
      </header>

      {MASTERCLASS_DAYS.map((d) => (
        <section key={d.day} style={{ display: "grid", gap: 20 }}>
          <h2>{d.label}</h2>
          {MASTERCLASSES.filter((m) => m.day === d.day).map((m) => {
            const rows = list.filter((r) => r.classId === m.id);
            return (
              <div key={m.id} style={{ display: "grid", gap: 8 }}>
                <h3>
                  {m.title} <span className="adm-muted">· {m.trainer} · {rows.length}/{MASTERCLASS_CAPACITY}{rows.length >= MASTERCLASS_CAPACITY ? " (complet)" : ""}</span>
                </h3>
                {rows.length === 0 ? (
                  <p className="adm-muted">Aucune inscription.</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table className="adm-table">
                      <thead>
                        <tr><th>Inscrit le</th><th>Nom</th><th>Organisation</th><th>E-mail</th><th>Téléphone</th></tr>
                      </thead>
                      <tbody>
                        {rows.map((r) => (
                          <tr key={r.id}>
                            <td>{fmt.format(new Date(r.createdAt))}</td>
                            <td>{r.nom}</td>
                            <td>{r.organisation || "-"}</td>
                            <td>{r.email}</td>
                            <td>{r.telephone || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      ))}
    </main>
  );
}
