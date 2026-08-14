const calendarModel = require("../models/calendarModel");

const getEvents = async (req, res) => {
  try {
    const data = await calendarModel.getAllEvents();

    res.status(200).json({
      success: true,
      data: data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getEvents
}; 