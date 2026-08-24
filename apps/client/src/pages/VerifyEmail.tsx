import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:5000";

type Status = "loading" | "success" | "error";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();

  const [status, setStatus] =
    useState<Status>("loading");

  const [message, setMessage] = useState(
    "Verifying your email address..."
  );

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage(
        "This verification link is missing a token."
      );
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/auth/verify-email`,
          {
            params: { token },
          }
        );

        setStatus("success");
        setMessage(
          response.data?.message ??
            "Your email has been verified successfully."
        );
      } catch (error) {
        setStatus("error");

        if (axios.isAxiosError(error)) {
          setMessage(
            error.response?.data?.message ??
              "We could not verify your email. The link may be invalid or expired."
          );
        } else {
          setMessage(
            "Something went wrong while verifying your email."
          );
        }
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        backgroundColor: "#f5f7fb",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          padding: "40px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          textAlign: "center",
          boxShadow:
            "0 10px 30px rgba(0, 0, 0, 0.08)",
        }}
      >
        <h1
          style={{
            marginTop: 0,
            marginBottom: "16px",
            color: "#111827",
          }}
        >
          {status === "loading"
            ? "Verifying your email..."
            : status === "success"
              ? "Email verified!"
              : "Verification failed"}
        </h1>

        <p
          style={{
            color: "#6b7280",
            lineHeight: 1.6,
            marginBottom: "28px",
          }}
        >
          {message}
        </p>

        {status === "loading" && (
          <div
            style={{
              width: "32px",
              height: "32px",
              margin: "0 auto",
              border: "3px solid #e5e7eb",
              borderTopColor: "#2563eb",
              borderRadius: "50%",
              animation:
                "spin 1s linear infinite",
            }}
          />
        )}

        {status === "success" && (
          <Link
            to="/login"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: 600,
            }}
          >
            Go to Login
          </Link>
        )}

        {status === "error" && (
          <Link
            to="/login"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: 600,
            }}
          >
            Go to Login
          </Link>
        )}

        <style>
          {`
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }

              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
      </div>
    </div>
  );
}