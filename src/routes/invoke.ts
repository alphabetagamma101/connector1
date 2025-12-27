// src/routes/invoke.ts
import { Router, Request, Response } from 'express';
import { BrowserControlManager } from '../managers/BrowserControlManager';
import { validateInvokeRequest } from '../validators/invokeValidator';
import { performInvokemock } from '../handlers/invokemockHandler';

const router = Router();

function processResults(result: any[]): string {
  let finalString = '';

  for (const item of result) {
    if (item !== null && item !== undefined) {
      finalString += item + '\n';
    }
  }

  return finalString;
}

router.post('/invoke', async (req: Request, res: Response) => {
  try {
    console.log('Incoming request to /api/invoke:', JSON.stringify(req.body, null, 2));

    const { content, url } = req.body;

    // Validate request
    const validation = validateInvokeRequest(req.body);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const browserManager: BrowserControlManager = req.app.locals.browserManager;

    // Execute the browser automation
    const result = await browserManager.invoke({
      content,
      url
    });

    // Process results before sending response
    const finalResult = processResults(result);

    // Fetch current URL from puppeteer
    const currentUrl = await browserManager.getCurrentUrl();

    res.json({ success: true, content: finalResult, url: currentUrl });
  } catch (error) {
    console.error('Error in /api/invoke:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/invokemock', async (req: Request, res: Response) => {
  try {
    console.log('Incoming request to /api/invokemock:', JSON.stringify(req.body, null, 2));

    const { content, url } = req.body;

    // Validate request
    const validation = validateInvokeRequest(req.body);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const result = await performInvokemock(content);

    res.json({ success: true, content: result, url: url });
  } catch (error) {
    console.error('Error in /api/invokemock:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as invokeRouter };