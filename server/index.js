require('dotenv').config();
const { createApp } = require('./src/app');

const port = process.env.PORT || 4000;
createApp().listen(port, () => {
  console.log(`[payments-server] listening on http://localhost:${port}`);
});
