import { redirect } from "next/navigation";
import AdminClient from "@/components/admin/AdminClient";
import { isAdmin } from "@/lib/adminAuth";
import { participants } from "@/lib/participants";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isAdmin()) redirect("/admin/login");

  try {
    const list = await participants.list();
    return <AdminClient initial={list} />;
  } catch (e) {
    console.error("[admin] list", e);
    return (
      <main className="adm-main">
        <p className="adm-alert">
          Le stockage des participants est indisponible. En production, définissez <code>SUPABASE_URL</code> et <code>SUPABASE_SERVICE_ROLE_KEY</code> (voir <code>supabase/schema.sql</code>).
        </p>
      </main>
    );
  }
}
