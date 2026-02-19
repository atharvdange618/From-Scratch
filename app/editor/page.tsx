import { Metadata } from "next";
import EditorAuthWrapper from "./editor-auth-wrapper";

export const metadata: Metadata = {
  title: "Editor",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function EditorPage() {
  return <EditorAuthWrapper />;
}
