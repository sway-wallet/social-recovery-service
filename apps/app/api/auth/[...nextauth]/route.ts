import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                label: "Email",
                type: "email",
                placeholder: "youremail@email.com",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any, req: any): Promise<any> {
                try {
                    const res = await fetch("http://localhost:8000/api/login", {
                    method: "POST",
                    body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password,
                    }),
                    headers: { "Content-Type": "application/json" },
                });

                if (!res.ok) {
                    // credentials are invalid
                    return null;
                }

                const parsedResponse = await res.json();

                // accessing the jwt returned by server
                const jwt = parsedResponse.access_token;

                // You can make more request to get other information about the user eg. Profile details

                // return user credentials together with jwt
                return {
                    ...credentials,
                    jwt,
                };
                } catch (error) {
                    console.log(error);
                    return null;
                }
            }
        }),
    ],
    callbacks: {
        jwt: async ({ token, user }: { token: any, user: any }) => {
         // user is only available the first time a user signs in authorized
            if (user) {
                return {
                    ...token,
                    jwt: user.jwt,
                };
            }
            return token;
        },
        session: async ({ session, token }: { session: any, token: any }) => {
            if (token) {
                session.jwt = token.jwt;
            }
            return session;
        },
      },
};

export default NextAuth(authOptions);