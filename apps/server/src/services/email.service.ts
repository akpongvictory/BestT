import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom =
  process.env.EMAIL_FROM ?? "onboarding@resend.dev";

if (!resendApiKey) {
  console.warn(
    "RESEND_API_KEY is not configured. Email sending will not work."
  );
}

const resend = new Resend(resendApiKey);

interface SendVerificationEmailParams {
  to: string;
  name: string;
  verificationUrl: string;
}

export const sendVerificationEmail = async ({
  to,
  name,
  verificationUrl,
}: SendVerificationEmailParams) => {
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const { data, error } = await resend.emails.send({
    from: `BestT <${emailFrom}>`,
    to: [to],
    subject: "Verify your BestT email address",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Verify your BestT email</title>
        </head>

        <body
          style="
            margin: 0;
            padding: 0;
            background-color: #f5f7fb;
            font-family: Arial, Helvetica, sans-serif;
            color: #1f2937;
          "
        >
          <div
            style="
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 12px;
              padding: 40px;
              box-sizing: border-box;
            "
          >
            <h1 style="margin-top: 0; color: #111827;">
              Welcome to BestT, ${name}!
            </h1>

            <p style="font-size: 16px; line-height: 1.6;">
              Thanks for creating your BestT account.
            </p>

            <p style="font-size: 16px; line-height: 1.6;">
              Please verify your email address by clicking the button below.
            </p>

            <div style="margin: 30px 0;">
              <a
                href="${verificationUrl}"
                style="
                  display: inline-block;
                  background-color: #2563eb;
                  color: #ffffff;
                  text-decoration: none;
                  padding: 14px 24px;
                  border-radius: 8px;
                  font-weight: bold;
                "
              >
                Verify my email
              </a>
            </div>

            <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
              This verification link will expire after 24 hours.
            </p>

            <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
              If you did not create a BestT account, you can safely ignore
              this email.
            </p>

            <hr
              style="
                border: none;
                border-top: 1px solid #e5e7eb;
                margin: 30px 0;
              "
            />

            <p style="font-size: 12px; color: #9ca3af;">
              © ${new Date().getFullYear()} BestT
            </p>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error("Resend email error:", error);
    throw new Error(error.message);
  }

  return data;
};