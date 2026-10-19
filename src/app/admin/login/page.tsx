import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { adminConfigured, isAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  if (isAdmin()) redirect("/admin");
  return (
    <main className="adm-login">
      <h1>Administration IA4EARTH</h1>
      {adminConfigured() ? (
        <LoginForm />
      ) : (
        <p className="adm-alert">
          L&apos;administration n&apos;est pas configurée. Définissez <code>ADMIN_PASSWORD</code> et <code>ADMIN_SESSION_SECRET</code> (16 caractères minimum) dans les variables d&apos;environnement.
        </p>
      )}
    </main>
  );
}
