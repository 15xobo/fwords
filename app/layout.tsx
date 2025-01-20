import { auth0 } from "@/lib/auth0";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import Container from '@mui/material/Container';
import type { Metadata } from "next";
import AppBar from "./AppBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "FWords",
  description: "Learn foreign language words with AI assisstance",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth0.getSession();

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <Container className="h-screen w-screen items-center justify-center flex">
            <AppBar session={session} />
            {children}
          </Container>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
