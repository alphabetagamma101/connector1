// src/routes/invoke.ts
import { Router, Request, Response } from 'express';
import { BrowserControlManager } from '../managers/BrowserControlManager';
import { validateInvokeRequest } from '../validators/invokeValidator';

const router = Router();

router.post('/invoke', async (req: Request, res: Response) => {
  try {
    const { content, url, flavor } = req.body;

    // Validate request
    const validation = validateInvokeRequest(req.body);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const browserManager: BrowserControlManager = req.app.locals.browserManager;

    // Execute the browser automation
    const result = await browserManager.invoke({
      content,
      url,
      flavor
    });

    res.json({ success: true, result });
  } catch (error) {
    console.error('Error in /api/invoke:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

export { router as invokeRouter };