import { redirect } from "next/navigation";
import BadgeCard from "@/components/admin/BadgeCard";
import PrintToolbar from "@/components/admin/PrintToolbar";
import { isAdmin } from "@/lib/adminAuth";
import { participants } from "@/lib/participants";

export const dynamic = "force-dynamic";

/** /admin/badges?ids=a,b,c  ou  /admin/badges?pending=1 (tous les badges non imprimés) */
export default async function BadgesPage({ searchParams }: { searchParams: { ids?: string; pending?: string } }) {
  if (!isAdmin()) redirect("/admin/login");

  let list;
  try {
    list = searchParams.pending
      ? (await participants.list()).filter((p) => !p.badgePrintedAt).reverse()
      : await participants.getMany((searchParams.ids ?? "").split(",").filter(Boolean).slice(0, 2000));
  } catch {
    return <main className="adm-main"><p className="adm-alert">Stockage indisponible.</p></main>;
  }

  return (
    <main className="adm-badges">
      <PrintToolbar ids={list.map((p) => p.id)} count={list.length} />
      {list.length === 0 && <p className="adm-alert no-print">Aucun badge à imprimer.</p>}
      <div className="badge-sheet">
        {list.map((p) => <BadgeCard key={p.id} p={p} />)}
      </div>
    </main>
  );
}
