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
    switch (step.type) {
      case 'type_content':
        return await this.executeTypeContent(page, step);
      case 'move_mouse_and_click':
        return await this.executeMoveMouseAndClick(page, step);
      case 'wait':
        return await this.executeWait(step);
      case 'wait_till_present':
        return await this.executeWaitTillPresent(page, step);
      default:
        throw new Error(`Unknown step type: ${step.type}`);
    }
  }

  private async executeTypeContent(page: Page, step: WorkflowStep): Promise<void> {
    const element = await getElementByLocator(page, step.locator!, step.locatorIndex);
    await element.type(step.content || '');
  }

  private async executeMoveMouseAndClick(page: Page, step: WorkflowStep): Promise<void> {
    const element = await getElementByLocator(page, step.locator!, step.locatorIndex);
    const box = await element.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    }
  }

  private async executeWait(step: WorkflowStep): Promise<void> {
    const waitTime = parseInt(step.waitTimeInMillis || '0');
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }

  private async executeWaitTillPresent(page: Page, step: WorkflowStep): Promise<void> {
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
}