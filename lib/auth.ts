import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { username, captcha } from "better-auth/plugins";
import prisma from "./prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    user: {
        additionalFields: {
            firstname: { type: "string" },
            lastname: { type: "string" },
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        username(),
        captcha({
            provider: "cloudflare-turnstile",
            secretKey: process.env.TURNSTILE_SECRET_KEY!,
            endpoints: ["/sign-up/email", "/sign-in/username"],
        }),
    ],
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    // 1. If Social Login (Google), split the 'name' into first/last
                    if (user.name && (!user.firstname || !user.lastname)) {
                        const parts = user.name.trim().split(/\s+/);
                        user.firstname = parts[0];
                        user.lastname = parts.slice(1).join(" ");
                    }

                    // 2. Generate Username: 1st letter of Firstname + up to 6 letters of Lastname
                    if (user.firstname && user.lastname) {
                        const firstChar = user.firstname.charAt(0).toLowerCase();
                        // Remove all spaces from lastname and take first 6 characters
                        const lastPart = user.lastname.replace(/\s+/g, '').toLowerCase().slice(0, 6);

                        user.username = `${firstChar}${lastPart}`;
                    }
                    return user;
                },
            },
        },
    },
});