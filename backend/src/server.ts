import dotenv from 'dotenv';
// Load environment variables before importing app
dotenv.config();

import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 PavanxDCL Server is running on port ${PORT}`);
  console.log(`⚡ API base path: http://localhost:${PORT}/api`);
  console.log(`⚙️ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=========================================`);
});
