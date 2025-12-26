// src/executors/StepExecutor.ts
import { Page } from 'puppeteer';
import { WorkflowStep } from '../types/workflow';
import { getElementByLocator } from '../utils/locatorHelper';

export class StepExecutor {
  async executeSteps(page: Page, steps: WorkflowStep[]): Promise<any[]> {
    const results = [];

    for (const step of steps) {
      const result = await this.executeStep(page, step);
      results.push(result);
    }

    return results;
  }

  private async executeStep(page: Page, step: WorkflowStep): Promise<any> {
    console.log(`Executing step: ${step.type}`, JSON.stringify(step, null, 2));
    
    switch (step.type) {
      case 'type_content':
        return await this.executeTypeContent(page, step);
      case 'move_mouse_and_click':
        return await this.executeMoveMouseAndClick(page, step);
      case 'wait':
        return await this.executeWait(step);
      case 'wait_till_present':
        return await this.executeWaitTillPresent(page, step);
      case 'wait_till_appears':
        return await this.executeWaitTillAppears(page, step);
      case 'result':
        return await this.executeResult(page, step);
      case 'scroll_rightmost_to_bottom':
        return await this.executeScrollRightmostToBottom(page, step);
      default:
        throw new Error(`Unknown step type: ${step.type}`);
    }
  }

  private async executeTypeContent(page: Page, step: WorkflowStep): Promise<any> {
    const element = await getElementByLocator(page, step.locator!, step.locatorIndex);
    await element.type(step.content || '');
  }

  private async executeMoveMouseAndClick(page: Page, step: WorkflowStep): Promise<any> {
    const element = await getElementByLocator(page, step.locator!, step.locatorIndex);
    const box = await element.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    }
  }

  private async executeWait(step: WorkflowStep): Promise<any> {
    const waitTime = parseInt(step.waitTimeInMillis || '0');
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }

  private async executeWaitTillPresent(page: Page, step: WorkflowStep): Promise<any> {
    const locators = step.locator!.split('||').map(l => l.trim());
    
    for (const locator of locators) {
      try {
        await page.waitForSelector(locator, { timeout: 10000 });
        return;
      } catch (e) {
        continue;
      }
    }
    
    // If none of the locators found, log warning and continue
    console.warn(`for executeWaitTillPresent - None of the locators found: ${step.locator}. Continuing execution...`);
  }

  private async executeWaitTillAppears(page: Page, step: WorkflowStep): Promise<any> {
    const locators = step.locator!.split('||').map(l => l.trim());
    const timeout = parseInt(step.timeout || '30000');
    const startTime = Date.now();
    
    // Setup periodic logging
    const logInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      console.log(`Still waiting for element to appear... (${elapsed}s elapsed, timeout: ${timeout / 1000}s)`);
    }, 5000);
    
    try {
      for (const locator of locators) {
        try {
          await page.waitForSelector(locator, { timeout: timeout });
          clearInterval(logInterval);
          console.log(`Element found for locator: ${locator}`);
          return;
        } catch (e) {
          continue;
        }
      }
      
      // If none of the locators found within timeout, throw error to stop further processing
      clearInterval(logInterval);
      throw new Error(`Timeout: None of the locators appeared within ${timeout}ms: ${step.locator}`);
    } catch (error) {
      clearInterval(logInterval);
      throw error;
    }
  }

  private async executeResult(page: Page, step: WorkflowStep): Promise<any> {
    if (step.content === 'clipboard') {
      // Read clipboard content from the browser context
      const clipboardContent = await page.evaluate(async () => {
        try {
          // @ts-ignore - navigator exists in browser context
          return await navigator.clipboard.readText();
        } catch (error) {
          return '';
        }
      });
      console.log('Clipboard content retrieved:', clipboardContent);
      return clipboardContent;
    }
    
    throw new Error(`Unknown result content type: ${step.content}`);
  }

  private async executeScrollRightmostToBottom(page: Page, step: WorkflowStep): Promise<any> {
    await page.evaluate(() => {
      // Get all elements in the document
      // @ts-ignore - document exists in browser context
      const allElements = Array.from(document.querySelectorAll('*'));
      
      // Find the rightmost element
      let rightmostElement: any = null;
      let maxRight = -1;
      
      for (const element of allElements) {
        // @ts-ignore - element has getBoundingClientRect in browser context
        const rect = element.getBoundingClientRect();
        const rightEdge = rect.right;
        
        if (rightEdge > maxRight) {
          maxRight = rightEdge;
          rightmostElement = element;
        }
      }
      
      // Scroll the rightmost element to the bottom
      if (rightmostElement) {
        rightmostElement.scrollTop = rightmostElement.scrollHeight;
      }
    });
  }
}