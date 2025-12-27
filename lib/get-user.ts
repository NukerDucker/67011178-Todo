import { auth } from "@/lib/auth";
import  { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function getFullUser() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) return null;

    // Direct DB query to get the freshest name and username
    const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            name: true,
            username: true,
        }
    });

    return dbUser;
}