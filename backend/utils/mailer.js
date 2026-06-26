const nodemailer = require("nodemailer");

const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendAdminBookingNotification = async ({ booking, room }) => {
  const transporter = createTransporter();
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!transporter || !adminEmail) {
    console.warn("Email notification skipped: SMTP settings or ADMIN_EMAIL missing.");
    return;
  }

  const start = new Date(booking.start_time).toLocaleString();
  const end = new Date(booking.end_time).toLocaleString();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: adminEmail,
    subject: `New room booking: ${booking.meeting_title}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.5;">
        <h2 style="margin-bottom: 8px;">New booking request</h2>
        <p>A new conference room booking was created.</p>
        <table cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
          <tr><td><strong>Room</strong></td><td>${room?.name || booking.room_id}</td></tr>
          <tr><td><strong>Meeting</strong></td><td>${booking.meeting_title}</td></tr>
          <tr><td><strong>Booked by</strong></td><td>${booking.full_name}</td></tr>
          <tr><td><strong>Email</strong></td><td>${booking.email}</td></tr>
          <tr><td><strong>Purpose</strong></td><td>${booking.purpose || "Not provided"}</td></tr>
          <tr><td><strong>Start</strong></td><td>${start}</td></tr>
          <tr><td><strong>End</strong></td><td>${end}</td></tr>
          <tr><td><strong>Status</strong></td><td>${booking.status || "pending"}</td></tr>
        </table>
      </div>
    `,
  });
};

module.exports = {
  sendAdminBookingNotification,
};
