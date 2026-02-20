const SystemConfig = require('../models/SystemConfig');

const checkRegistrationPeriod = async (req, res, next) => {
  try {
    const config = await SystemConfig.findOne({ key: 'registrationPeriod' });
    
    if (!config) {
      // If no registration period is configured, allow registration
      return next();
    }

    const now = new Date();
    const startDate = new Date(config.value.startDate);
    const endDate = new Date(config.value.endDate);

    if (now < startDate || now > endDate) {
      return res.status(403).json({
        success: false,
        status: 'error',
        error: 'Registration Period Closed',
        message: 'Registration is not currently open',
        period: {
          startDate: config.value.startDate,
          endDate: config.value.endDate
        }
      });
    }

    next();
  } catch (error) {
    console.error('Error checking registration period:', error);
    next(error);
  }
};

module.exports = { checkRegistrationPeriod };
