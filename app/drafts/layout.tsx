import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Drafts",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DraftsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
