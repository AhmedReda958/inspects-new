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
  });
}

/**
 * Send email notification to admin when a new lead is registered
 */
export async function sendNewLeadNotification(
  submission: SubmissionWithRelations
): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@inspectex.com";
  const smtpFrom = process.env.SMTP_FROM || process.env.SMTP_USER || adminEmail;

  const transporter = createTransporter();
  if (!transporter) {
    // Log that notification was skipped due to missing configuration
    await prisma.leadNotification.create({
      data: {
        submissionId: submission.id,
        type: "email",
        recipient: adminEmail,
        status: "failed",
        failureReason: "SMTP configuration is missing",
      },
    });
    return;
  }

  // Format the email content
  const customerName = `${submission.firstName} ${submission.familyName}`;
  const packageName = submission.package?.nameAr || "غير محدد";
  const cityName = submission.city?.name || "غير محدد";
  const neighborhoodName = submission.neighborhood?.name || "غير محدد";
  const formattedDate = new Date(submission.createdAt).toLocaleString("ar-SA", {
    dateStyle: "full",
    timeStyle: "short",
  });

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
        ${submission.email ? `
        <div class="info-row">
          <span class="label">البريد الإلكتروني:</span>
          <span class="value">${submission.email}</span>
        </div>
        ` : ""}
        <div class="info-row">
          <span class="label">الباقة:</span>
          <span class="value">${packageName}</span>
        </div>
        <div class="info-row">
          <span class="label">المدينة:</span>
          <span class="value">${cityName}</span>
        </div>
        ${neighborhoodName !== "غير محدد" ? `
        <div class="info-row">
          <span class="label">الحي:</span>
          <span class="value">${neighborhoodName}</span>
        </div>
        ` : ""}
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
    subject: `عميل جديد: ${customerName} - ${submission.finalPrice.toFixed(2)} ريال`,
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
    await prisma.leadNotification.create({
      data: {
        submissionId: submission.id,
        type: "email",
        recipient: adminEmail,
        status: "sent",
        sentAt: new Date(),
      },
    });

    console.log(`✅ Email notification sent successfully for lead ${submission.id}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    console.error("❌ Failed to send email notification:", errorMessage);

    // Log failed notification in database
    await prisma.leadNotification.create({
      data: {
        submissionId: submission.id,
        type: "email",
        recipient: adminEmail,
        status: "failed",
        failureReason: errorMessage,
      },
    });
  }
}

