import { auth0 } from "@/lib/auth0";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import Stack from '@mui/material/Stack';
import type { Metadata } from "next";
import AppBar from "./AppBar";
import AppBarSpacer from "./AppBarSpacer";
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

  const dateToday = new Date().toISOString().substring(0, 10);

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <AppBar session={session} />
          <Stack direction="column" className="w-screen h-screen flex">
            <AppBarSpacer />
            <div className="w-screen flex-1 justify-center items-center flex">
              {children}
            </div>
          </Stack>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
