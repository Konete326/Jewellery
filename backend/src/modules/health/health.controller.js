import { sendSuccess } from '../../utils/apiResponse.js';

export const getHealth = (req, res) => {
  const healthData = {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'Khalil & Sons API',
    status: 'healthy'
  };

  return sendSuccess(res, 200, 'API service is running smoothly', healthData);
};
