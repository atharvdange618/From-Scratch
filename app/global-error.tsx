"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <h1 style={{ fontSize: "4rem", margin: 0 }}>⚠️</h1>
          <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
            Critical Error
          </h2>
          <p style={{ marginBottom: "2rem", color: "#666" }}>
            {error.message || "Something went wrong"}
          </p>
          <button
            onClick={reset}
            style={{
              padding: "12px 24px",
              fontSize: "1rem",
              fontWeight: "bold",
              border: "3px solid black",
              background: "white",
              cursor: "pointer",
              boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
