"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function completeOnboarding(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) throw new Error("Unauthorized");

    const username = formData.get("username") as string;

    // Check if taken
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) return { error: "Username already taken" };

    // Update DB
    await prisma.user.update({
        where: { id: session.user.id },
        data: { username },
    });

    // This forces the app to re-run the server-side logic in the dashboard
    redirect("/dashboard");
}