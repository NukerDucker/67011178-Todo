import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    plugins: [
        usernameClient()
    ],
    user: {
        additionalFields: {
            username:{ type: "string" },
            firstname: { type: "string" },
            lastname: { type: "string" },
        }
    }
});