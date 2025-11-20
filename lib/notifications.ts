import nodemailer from "nodemailer";
import prisma from "./db";

interface SubmissionWithRelations {
  id: string;
  firstName: string;
  familyName: string;
  mobileNumber: string;
  email?: string | null;
  finalPrice: number;
  createdAt: Date;
  city?: { name: string } | null;
  neighborhood?: { name: string } | null;
  package?: { nameAr: string } | null;
}

/**
 * Initialize email transporter based on environment variables
 */
function createTransporter() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;

  // If SMTP is not configured, return null
  if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
    console.warn(
      "SMTP configuration is missing. Email notifications will be disabled."
    );
    return null;
  }

  const port = parseInt(smtpPort, 10);
  const isSecure = port === 465;

  return nodemailer.createTransport({
    host: smtpHost,
    port: port,
    secure: isSecure, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
    // For Plesk and most mail servers, we need to allow self-signed certificates
    tls: {
      rejectUnauthorized: false,
    },
    // Connection timeout settings
    connectionTimeout: 10000, // 10 seconds
    socketTimeout: 10000, // 10 seconds
    greetingTimeout: 10000, // 10 seconds
    // Retry configuration
    pool: true,
    maxConnections: 1,
    maxMessages: 3,
  });
}

/**
 * Send email notification to admin when a new lead is registered
 */
export async function sendNewLeadNotification(
  submission: SubmissionWithRelations
): Promise<void> {
  // This function is fire-and-forget and should never throw errors
  // All errors are caught and logged internally
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@inspectex.com";
    const smtpFrom =
      process.env.SMTP_FROM || process.env.SMTP_USER || adminEmail;

    const transporter = createTransporter();
    if (!transporter) {
      // Log that notification was skipped due to missing configuration
      // Wrap in try-catch to ensure it never throws
      try {
        await prisma.leadNotification.create({
          data: {
            submissionId: submission.id,
            type: "email",
            recipient: adminEmail,
            status: "failed",
            failureReason: "SMTP configuration is missing",
          },
        });
      } catch (dbError) {
        console.error(
          "Failed to log notification status to database:",
          dbError
        );
        // Don't throw - this is a non-critical operation
      }
      return;
    }

    // Format the email content
    const customerName = `${submission.firstName} ${submission.familyName}`;
    const packageName = submission.package?.nameAr || "غير محدد";
    const cityName = submission.city?.name || "غير محدد";
    const neighborhoodName = submission.neighborhood?.name || "غير محدد";
    const formattedDate = new Date(submission.createdAt).toLocaleString(
      "ar-SA",
      {
        dateStyle: "full",
        timeStyle: "short",
      }
    );

    const emailHtml = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>إشعار تسجيل عميل جديد</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #021a60;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background-color: #f9f9f9;
          padding: 20px;
          border: 1px solid #ddd;
        }
        .info-row {
          margin: 15px 0;
          padding: 10px;
          background-color: white;
          border-right: 3px solid #f25b06;
        }
        .label {
          font-weight: bold;
          color: #021a60;
          display: inline-block;
          min-width: 120px;
        }
        .value {
          color: #333;
        }
        .price {
          font-size: 24px;
          font-weight: bold;
          color: #f25b06;
          text-align: center;
          padding: 15px;
          background-color: white;
          border: 2px solid #f25b06;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>إشعار تسجيل عميل جديد</h1>
      </div>
      <div class="content">
        <div class="info-row">
          <span class="label">الاسم:</span>
          <span class="value">${customerName}</span>
        </div>
        <div class="info-row">
          <span class="label">رقم الجوال:</span>
          <span class="value">${submission.mobileNumber}</span>
        </div>
        ${
          submission.email
            ? `
        <div class="info-row">
          <span class="label">البريد الإلكتروني:</span>
          <span class="value">${submission.email}</span>
        </div>
        `
            : ""
        }
        <div class="info-row">
          <span class="label">الباقة:</span>
          <span class="value">${packageName}</span>
        </div>
        <div class="info-row">
          <span class="label">المدينة:</span>
          <span class="value">${cityName}</span>
        </div>
        ${
          neighborhoodName !== "غير محدد"
            ? `
        <div class="info-row">
          <span class="label">الحي:</span>
          <span class="value">${neighborhoodName}</span>
        </div>
        `
            : ""
        }
        <div class="price">
          السعر النهائي: ${submission.finalPrice.toFixed(2)} ريال
        </div>
        <div class="info-row">
          <span class="label">تاريخ التسجيل:</span>
          <span class="value">${formattedDate}</span>
        </div>
      </div>
      <div class="footer">
        <p>تم إرسال هذا الإشعار تلقائياً من نظام إدارة العملاء</p>
        <p>معرف الطلب: ${submission.id}</p>
      </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: smtpFrom,
      to: adminEmail,
      subject: `عميل جديد: ${customerName} - ${submission.finalPrice.toFixed(
        2
      )} ريال`,
      html: emailHtml,
      // Plain text fallback
      text: `
إشعار تسجيل عميل جديد

الاسم: ${customerName}
رقم الجوال: ${submission.mobileNumber}
${submission.email ? `البريد الإلكتروني: ${submission.email}` : ""}
الباقة: ${packageName}
المدينة: ${cityName}
${neighborhoodName !== "غير محدد" ? `الحي: ${neighborhoodName}` : ""}
السعر النهائي: ${submission.finalPrice.toFixed(2)} ريال
تاريخ التسجيل: ${formattedDate}

معرف الطلب: ${submission.id}
      `.trim(),
    };

    try {
      await transporter.sendMail(mailOptions);

      // Log successful notification in database
      // Wrap in try-catch to ensure it never throws
      try {
        await prisma.leadNotification.create({
          data: {
            submissionId: submission.id,
            type: "email",
            recipient: adminEmail,
            status: "sent",
            sentAt: new Date(),
          },
        });
      } catch (dbError) {
        console.error(
          "Failed to log successful notification to database:",
          dbError
        );
        // Don't throw - email was sent successfully, logging is non-critical
      }

      console.log(
        `✅ Email notification sent successfully for lead ${submission.id}`
      );
    } catch (error) {
      let errorMessage = "Unknown error occurred";

      if (error instanceof Error) {
        errorMessage = error.message;

        // Provide more specific error messages for common issues
        if (
          errorMessage.includes("ETIMEDOUT") ||
          errorMessage.includes("timeout")
        ) {
          errorMessage = `Connection timeout: Unable to connect to SMTP server. Please check your network connection and SMTP server settings.`;
        } else if (errorMessage.includes("ECONNREFUSED")) {
          errorMessage = `Connection refused: SMTP server is not accepting connections. Please verify the SMTP host and port.`;
        } else if (errorMessage.includes("EAUTH")) {
          errorMessage = `Authentication failed: Invalid SMTP credentials. Please check your SMTP username and password.`;
        }
      }

      console.error("❌ Failed to send email notification:", errorMessage);

      // Log failed notification in database
      // Wrap in try-catch to ensure it never throws
      try {
        await prisma.leadNotification.create({
          data: {
            submissionId: submission.id,
            type: "email",
            recipient: adminEmail,
            status: "failed",
            failureReason: errorMessage,
          },
        });
      } catch (dbError) {
        console.error(
          "Failed to log failed notification to database:",
          dbError
        );
        // Don't throw - logging is non-critical
      }
    }
  } catch (error) {
    // Catch any unexpected errors in the entire function
    // This ensures the function never throws and blocks the main process
    console.error("Unexpected error in sendNewLeadNotification:", error);
    // Don't throw - this is a fire-and-forget function
  }
}

/**
 * Send password reset email to admin user
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<void> {
  const smtpFrom = process.env.SMTP_FROM || process.env.SMTP_USER;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3008";
  const resetLink = `${appUrl}/admin/reset-password?token=${token}`;

  const transporter = createTransporter();
  if (!transporter) {
    console.warn(
      "SMTP configuration is missing. Password reset email cannot be sent."
    );
    return;
  }

  const emailHtml = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>إعادة تعيين كلمة المرور</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #021a60;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background-color: #f9f9f9;
          padding: 20px;
          border: 1px solid #ddd;
        }
        .button {
          display: inline-block;
          background-color: #f25b06;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
        }
        .button:hover {
          background-color: #d14a05;
        }
        .info {
          background-color: white;
          padding: 15px;
          border-right: 3px solid #f25b06;
          margin: 15px 0;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #666;
          font-size: 12px;
        }
        .warning {
          background-color: #fff3cd;
          border: 1px solid #ffc107;
          padding: 10px;
          border-radius: 5px;
          margin: 15px 0;
          color: #856404;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>إعادة تعيين كلمة المرور</h1>
      </div>
      <div class="content">
        <p>مرحباً،</p>
        <p>لقد تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك في نظام إدارة Inspectex.</p>
        
        <div class="info">
          <p><strong>لإعادة تعيين كلمة المرور، يرجى النقر على الزر أدناه:</strong></p>
          <div style="text-align: center;">
            <a href="${resetLink}" class="button">إعادة تعيين كلمة المرور</a>
          </div>
        </div>

        <div class="warning">
          <p><strong>ملاحظة مهمة:</strong></p>
          <ul>
            <li>ينتهي صلاحية رابط إعادة التعيين خلال ساعة واحدة</li>
            <li>إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد الإلكتروني</li>
            <li>لأسباب أمنية، لا تشارك هذا الرابط مع أي شخص آخر</li>
          </ul>
        </div>

        <p>إذا لم يعمل الزر أعلاه، يمكنك نسخ الرابط التالي ولصقه في متصفحك:</p>
        <p style="word-break: break-all; color: #021a60; font-size: 12px;">${resetLink}</p>
      </div>
      <div class="footer">
        <p>تم إرسال هذا البريد الإلكتروني تلقائياً من نظام إدارة Inspectex</p>
        <p>إذا كان لديك أي استفسارات، يرجى الاتصال بالدعم الفني</p>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: smtpFrom,
    to: email,
    subject: "إعادة تعيين كلمة المرور - Inspectex Admin",
    html: emailHtml,
    text: `
إعادة تعيين كلمة المرور

مرحباً،

لقد تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك في نظام إدارة Inspectex.

لإعادة تعيين كلمة المرور، يرجى زيارة الرابط التالي:
${resetLink}

ملاحظة مهمة:
- ينتهي صلاحية رابط إعادة التعيين خلال ساعة واحدة
- إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد الإلكتروني
- لأسباب أمنية، لا تشارك هذا الرابط مع أي شخص آخر

تم إرسال هذا البريد الإلكتروني تلقائياً من نظام إدارة Inspectex
    `.trim(),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent successfully to ${email}`);
  } catch (error) {
    let errorMessage = "Unknown error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;

      // Provide more specific error messages for common issues
      if (
        errorMessage.includes("ETIMEDOUT") ||
        errorMessage.includes("timeout")
      ) {
        errorMessage = `Connection timeout: Unable to connect to SMTP server. Please check your network connection and SMTP server settings.`;
      } else if (errorMessage.includes("ECONNREFUSED")) {
        errorMessage = `Connection refused: SMTP server is not accepting connections. Please verify the SMTP host and port.`;
      } else if (errorMessage.includes("EAUTH")) {
        errorMessage = `Authentication failed: Invalid SMTP credentials. Please check your SMTP username and password.`;
      }
    }

    console.error("❌ Failed to send password reset email:", errorMessage);
    throw error;
  }
}
