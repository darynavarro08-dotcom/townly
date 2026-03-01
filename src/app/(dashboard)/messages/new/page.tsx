import { createClient } from "@/utils/supabase/server";
import { db } from "@/db";
import { users, communityMembers } from "@/db/schema";
import { eq, and, not } from "drizzle-orm";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import NewMessageForm from "./form";

export default async function Page() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");

    const [dbUser] = await db.select().from(users).where(eq(users.supabaseId, user.id)).limit(1);
    if (!dbUser) redirect("/onboarding");

    // Resolve active community from cookie (same pattern as layout/actions)
    const cookieStore = await cookies();
    const activeCookieVal = cookieStore.get("quormet_active_community")?.value;
    const communityId = activeCookieVal ? parseInt(activeCookieVal) : dbUser.communityId;
    if (!communityId) redirect("/onboarding");

    const recipients = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
    })
    .from(communityMembers)
    .innerJoin(users, eq(users.id, communityMembers.userId))
    .where(and(eq(communityMembers.communityId, communityId), not(eq(users.id, dbUser.id))));

    return <NewMessageForm recipients={recipients} />;
}