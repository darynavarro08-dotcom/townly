"use server";

import { createClient } from "@/utils/supabase/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

async function getAuthUser() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const [dbUser] = await db.select().from(users).where(eq(users.supabaseId, user.id)).limit(1);
    if (!dbUser || !dbUser.communityId) throw new Error("No community found");

    return dbUser;
}

export async function updateProfileSettings(formData: FormData) {
    const user = await getAuthUser();

    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const directoryOptIn = formData.get("directoryOptIn") === "on";

    await db.update(users)
        .set({
            phone: phone || null,
            address: address || null,
            directoryOptIn,
        })
        .where(eq(users.id, user.id));

    revalidatePath("/directory");
}
