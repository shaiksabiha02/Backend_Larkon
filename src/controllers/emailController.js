import * as emailModel from '../models/emailModel.js';

const getAllEmails = async (req, res) => {
  try {
    const emails = await emailModel.getAllEmails();

    res.status(200).json({
      success: true,
      data: emails
    });
  } catch (error) {
    console.error('Error fetching emails:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch emails'
    });
  }
};

export { getAllEmails };