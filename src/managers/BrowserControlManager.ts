// src/managers/BrowserControlManager.ts
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, Page } from 'puppeteer';
import { FlavorManager } from './FlavorManager';
import { StepExecutor } from '../executors/StepExecutor';
import { WorkflowDefinition } from '../types/workflow';

// Add stealth plugin
puppeteer.use(StealthPlugin());

interface InvokeParams {
  content: string;
  url?: string;
  flavor?: string;
}

export class BrowserControlManager {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private flavorManager: FlavorManager;
  private stepExecutor: StepExecutor;

  constructor() {
    this.flavorManager = new FlavorManager();
    this.stepExecutor = new StepExecutor();
  }

  async initialize(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled'
      ]
    });
    this.page = await this.browser.newPage();
    
    // Additional stealth measures - runs in browser context
    await this.page.evaluateOnNewDocument(() => {
      // @ts-ignore - navigator exists in browser context
      Object.defineProperty(Object.getPrototypeOf(navigator), 'webdriver', {
        get: () => false,
      });
    });
    
    console.log('Puppeteer browser initialized with stealth plugin');
  }

  async invoke(params: InvokeParams): Promise<any> {
    const startTime = Date.now();
    
    if (!this.page || this.page.isClosed()) {
      // Recreate page if it was closed or detached
      if (this.browser) {
        this.page = await this.browser.newPage();
        await this.page.evaluateOnNewDocument(() => {
          // @ts-ignore - navigator exists in browser context
          Object.defineProperty(Object.getPrototypeOf(navigator), 'webdriver', {
            get: () => false,
          });
        });
      } else {
        throw new Error('Browser not initialized');
      }
    }

    // Get workflow definition from FlavorManager
    const workflow = await this.flavorManager.getWorkflow(
      params.url,
      params.flavor
    );

    // Replace placeholders in workflow
    const processedWorkflow = this.replacePlaceholders(workflow, params.content);

    // Navigate to URL
    await this.page.goto(processedWorkflow.url, { waitUntil: 'networkidle0' });

    // Execute steps
    const results = await this.stepExecutor.executeSteps(
      this.page,
      processedWorkflow.steps
    );

    const endTime = Date.now();
    const timeTaken = endTime - startTime;
    console.log(`Invoke execution completed in ${timeTaken}ms (${(timeTaken / 1000).toFixed(2)}s)`);

    return results;
  }

  private replacePlaceholders(workflow: WorkflowDefinition, content: string): WorkflowDefinition {
    // Create a deep copy of the workflow
    const workflowCopy = JSON.parse(JSON.stringify(workflow));
    
    // Recursively replace placeholders in the workflow object
    const replaceInObject = (obj: any): any => {
      if (typeof obj === 'string') {
        return obj.replace(/PH_CONTENT/g, content);
      } else if (Array.isArray(obj)) {
        return obj.map(item => replaceInObject(item));
      } else if (typeof obj === 'object' && obj !== null) {
        const newObj: any = {};
        for (const key in obj) {
          newObj[key] = replaceInObject(obj[key]);
        }
        return newObj;
      }
      return obj;
    };
    
    return replaceInObject(workflowCopy);
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      console.log('Browser closed');
    }
  }
}