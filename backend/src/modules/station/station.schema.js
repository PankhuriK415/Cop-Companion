const { z } = require('zod');
const stationSchema = z.object({
  Station_Name: z.string().min(3),
  Location: z.string().min(3),
  Contact_No: z.string().min(5)
});
module.exports = { stationSchema };
