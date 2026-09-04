const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendContactEmail = async ({ name, email, subject, message }) => {
  // Email to YOU (portfolio owner) — notification
  const ownerMail = {
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: `📬 New Message: ${subject || 'Contact Form'}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0D0D0D;color:#F0F0F0;border-radius:12px;overflow:hidden;">
        <div style="background:#7C3AED;padding:24px 32px;">
          <h2 style="margin:0;color:#fff;font-size:1.3rem;">📬 New Portfolio Message</h2>
        </div>
        <div style="padding:32px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 0;color:#999;font-size:.85rem;width:80px;">Name</td>
              <td style="padding:10px 0;font-weight:600;">${name}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#999;font-size:.85rem;">Email</td>
              <td style="padding:10px 0;"><a href="mailto:${email}" style="color:#A78BFA;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#999;font-size:.85rem;">Subject</td>
              <td style="padding:10px 0;">${subject || 'No Subject'}</td>
            </tr>
          </table>
          <div style="margin-top:20px;padding:20px;background:#1A1A1A;border-radius:8px;border-left:3px solid #7C3AED;">
            <p style="margin:0;color:#ccc;line-height:1.7;">${message}</p>
          </div>
          <p style="margin-top:20px;font-size:.8rem;color:#555;">Sent from your portfolio contact form</p>
        </div>
      </div>
    `
  };

  // Auto-reply email to the SENDER
  const senderMail = {
    from: `"Your Name" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Thanks for reaching out, ${name}! 👋`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0D0D0D;color:#F0F0F0;border-radius:12px;overflow:hidden;">
        <div style="background:#7C3AED;padding:24px 32px;">
          <h2 style="margin:0;color:#fff;font-size:1.3rem;">Hey ${name}! 👋</h2>
        </div>
        <div style="padding:32px;">
          <p style="color:#ccc;line-height:1.8;">Thanks for getting in touch! I've received your message and will get back to you within <strong style="color:#fff;">24 hours</strong>.</p>
          <div style="margin:24px 0;padding:20px;background:#1A1A1A;border-radius:8px;border-left:3px solid #7C3AED;">
            <p style="margin:0;color:#999;font-size:.85rem;">Your message:</p>
            <p style="margin:8px 0 0;color:#ccc;">${message}</p>
          </div>
          <p style="color:#ccc;">Looking forward to connecting!</p>
          <p style="color:#A78BFA;font-weight:600;">— Your Name<br/><span style="font-weight:400;color:#777;font-size:.85rem;">Full Stack Developer</span></p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(ownerMail);
  await transporter.sendMail(senderMail);
};

module.exports = { sendContactEmail };
