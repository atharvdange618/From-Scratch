import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "From Scratch";
    const description =
      searchParams.get("description") ||
      "Building tools and apps, one commit at a time";
    const type = searchParams.get("type") || "blog"; // blog, project, or page

    // Color scheme based on type
    const colors = {
      blog: { bg: "#60B5FF", accent: "#FF9149" },
      project: { bg: "#AFDDFF", accent: "#60B5FF" },
      page: { bg: "#E0FFF1", accent: "#FF9149" },
    };

    const color = colors[type as keyof typeof colors] || colors.blog;

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: "#fff",
            padding: "80px",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "600px",
              height: "600px",
              background: color.bg,
              border: "8px solid black",
              borderRadius: "50%",
              transform: "translate(30%, -30%)",
            }}
          />

          {/* Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              zIndex: 10,
            }}
          >
            {/* Logo/Brand */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  background: color.bg,
                  border: "6px solid black",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "36px",
                  fontWeight: "bold",
                }}
              >
                FS
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                }}
              >
                From Scratch
              </div>
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: "64px",
                fontWeight: "bold",
                lineHeight: 1.2,
                maxWidth: "900px",
                color: "#000",
              }}
            >
              {title}
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: "32px",
                color: "#666",
                maxWidth: "800px",
                lineHeight: 1.4,
              }}
            >
              {description}
            </div>
          </div>

          {/* Footer Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "16px 32px",
              background: color.accent,
              border: "6px solid black",
              borderRadius: "16px",
              fontSize: "24px",
              fontWeight: "bold",
              zIndex: 10,
            }}
          >
            {type === "blog" && "Blog Post"}
            {type === "project" && "Project"}
            {type === "page" && "Page"}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error("Error generating OG image:", e);
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    });
  }
}
