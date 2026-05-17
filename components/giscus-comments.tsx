"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme-provider";
import { env } from "@/lib/env";

export function GiscusComments() {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const theme = resolvedTheme === "dark" ? "dark" : "light";
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", env.NEXT_PUBLIC_GISCUS_REPO || "");
    script.setAttribute(
      "data-repo-id",
      env.NEXT_PUBLIC_GISCUS_REPO_ID || ""
    );
    script.setAttribute(
      "data-category",
      env.NEXT_PUBLIC_GISCUS_CATEGORY || ""
    );
    script.setAttribute(
      "data-category-id",
      env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || ""
    );
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", theme);
    script.setAttribute("data-lang", "en");
    script.setAttribute("data-loading", "lazy");
    script.crossOrigin = "anonymous";
    script.async = true;

    ref.current.appendChild(script);
  }, []);

  useEffect(() => {
    const theme = resolvedTheme === "dark" ? "dark" : "light";
    const iframe = ref.current?.querySelector<HTMLIFrameElement>(
      "iframe.giscus-frame"
    );
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(
        { giscus: { setConfig: { theme } } },
        "https://giscus.app"
      );
    }
  }, [resolvedTheme]);

  return <div ref={ref} />;
}
