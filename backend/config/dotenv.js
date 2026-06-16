const dotenv = require('dotenv');
const path = require('path');

// Load .env.local first (priority), then .env
// Note: dotenv will NOT overwrite existing process.env variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
