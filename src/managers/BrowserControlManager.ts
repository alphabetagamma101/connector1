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
    if (!this.page) {
      throw new Error('Browser not initialized');
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

    return results;
  }

  private replacePlaceholders(workflow: WorkflowDefinition, content: string): WorkflowDefinition {
    const workflowStr = JSON.stringify(workflow);
    const replaced = workflowStr.replace(/PH_CONTENT/g, content);
    return JSON.parse(replaced);
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      console.log('Browser closed');
    }
  }
}