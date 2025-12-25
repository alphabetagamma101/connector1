// src/index.ts
import express from 'express';
import { BrowserControlManager } from './managers/BrowserControlManager';
import { invokeRouter } from './routes/invoke';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize browser control manager
let browserManager: BrowserControlManager;

async function startServer() {
  try {
    browserManager = new BrowserControlManager();
    await browserManager.initialize();
    console.log('Browser Control Manager initialized');

    // Make browser manager available to routes
    app.locals.browserManager = browserManager;

    // Register routes
    app.use('/api', invokeRouter);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down...');
  if (browserManager) {
    await browserManager.close();
  }
  process.exit(0);
});

startServer();