"use client";

import { useEffect, useRef } from "react";

export function GiscusComments() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", process.env.NEXT_PUBLIC_GISCUS_REPO || "");
    script.setAttribute(
      "data-repo-id",
      process.env.NEXT_PUBLIC_GISCUS_REPO_ID || ""
    );
    script.setAttribute(
      "data-category",
      process.env.NEXT_PUBLIC_GISCUS_CATEGORY || ""
    );
    script.setAttribute(
      "data-category-id",
      process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || ""
    );
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "light");
    script.setAttribute("data-lang", "en");
    script.setAttribute("data-loading", "lazy");
    script.crossOrigin = "anonymous";
    script.async = true;

    ref.current.appendChild(script);
  }, []);

  return <div ref={ref} />;
}
