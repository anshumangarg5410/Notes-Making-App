const ContactMessage = require('../models/ContactMessage');

class ContactController {
  /**
   * POST /api/contact
   * Submit a contact message
   */
  async submitMessage(req, res, next) {
    try {
      const { name, email, subject, message } = req.body;

      // Basic field presence validation
      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Please provide your full name'
        });
      }

      if (!email || !email.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Please provide your email address'
        });
      }

      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }

      if (!subject || !subject.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a message subject'
        });
      }

      if (!message || !message.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a message'
        });
      }

      if (message.trim().length < 5) {
        return res.status(400).json({
          success: false,
          message: 'Message must be at least 5 characters long'
        });
      }

      // Prevent duplicate submissions within 60 seconds
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
      const duplicate = await ContactMessage.findOne({
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        createdAt: { $gte: oneMinuteAgo }
      });

      if (duplicate) {
        return res.status(429).json({
          success: false,
          message: 'A message with identical content was recently submitted. Please wait a moment before sending again.'
        });
      }

      // Collect client metadata
      const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
      const userAgent = req.headers['user-agent'] || '';

      // Persist contact message
      const contactRecord = await ContactMessage.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        ip,
        userAgent
      });

      console.log(`[Contact] New message received from ${contactRecord.name} <${contactRecord.email}>: "${contactRecord.subject}"`);

      return res.status(201).json({
        success: true,
        message: "Thank you! Your message has been received. We'll get back to you as soon as possible.",
        data: {
          id: contactRecord.id,
          name: contactRecord.name,
          createdAt: contactRecord.createdAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/contact/messages
   * (Protected admin view of submitted contact messages)
   */
  async getMessages(req, res, next) {
    try {
      const messages = await ContactMessage.find()
        .sort({ createdAt: -1 })
        .limit(100);

      return res.status(200).json({
        success: true,
        count: messages.length,
        data: messages
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ContactController();

