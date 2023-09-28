import type { Metadata } from "next";
import Theme from "./theme";

export const metadata: Metadata = {
  title: "Game Project",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body>
        <Theme>
          {children}
        </Theme>
      </body>
    </html>
  );
}
