const express    = require('express');
const router     = express.Router();
const nodemailer = require('nodemailer');

// ─── Email Transporter ──────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ─── POST /api/contact ──────────────────────
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validate
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email and message are required.'
    });
  }

  try {
    // 1️⃣ Email to YOU
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to:   process.env.EMAIL_TO,
      subject: `📬 New Message: ${subject || 'Contact Form'}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0D0D0D;color:#F0F0F0;border-radius:12px;overflow:hidden;">
          <div style="background:#7C3AED;padding:24px 32px;">
            <h2 style="margin:0;color:#fff;">📬 New Portfolio Message</h2>
          </div>
          <div style="padding:32px;">
            <p><strong style="color:#A78BFA;">From:</strong> ${name}</p>
            <p><strong style="color:#A78BFA;">Email:</strong> <a href="mailto:${email}" style="color:#A78BFA;">${email}</a></p>
            <p><strong style="color:#A78BFA;">Subject:</strong> ${subject || 'No Subject'}</p>
            <div style="margin-top:20px;padding:20px;background:#1A1A1A;border-radius:8px;border-left:3px solid #7C3AED;">
              <p style="margin:0;color:#ccc;line-height:1.7;">${message}</p>
            </div>
          </div>
        </div>
      `
    });

    // 2️⃣ Auto-reply to SENDER
    await transporter.sendMail({
      from: `"Your Name" <${process.env.EMAIL_USER}>`,
      to:   email,
      subject: `Thanks for reaching out, ${name}! 👋`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0D0D0D;color:#F0F0F0;border-radius:12px;overflow:hidden;">
          <div style="background:#7C3AED;padding:24px 32px;">
            <h2 style="margin:0;color:#fff;">Hey ${name}! 👋</h2>
          </div>
          <div style="padding:32px;">
            <p style="color:#ccc;line-height:1.8;">Thanks for getting in touch! I've received your message and will reply within <strong style="color:#fff;">24 hours</strong>.</p>
            <div style="margin:20px 0;padding:16px;background:#1A1A1A;border-radius:8px;border-left:3px solid #7C3AED;">
              <p style="margin:0;color:#999;font-size:.85rem;">Your message:</p>
              <p style="margin:8px 0 0;color:#ccc;">${message}</p>
            </div>
            <p style="color:#A78BFA;font-weight:600;">— Your Name<br/><span style="color:#777;font-weight:400;font-size:.85rem;">Full Stack Developer</span></p>
          </div>
        </div>
      `
    });

    res.status(200).json({
      success: true,
      message: 'Message sent successfully!'
    });

  } catch (error) {
    console.error('Email error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to send email. Please try again.'
    });
  }
});

module.exports = router;
