// src/utils/locatorHelper.ts
import { Page, ElementHandle } from 'puppeteer';

export async function getElementByLocator(
  page: Page,
  locator: string,
  locatorIndex?: string
): Promise<ElementHandle> {
  const locators = locator.split('||').map(l => l.trim());

  for (const loc of locators) {
    const elements = await page.$$(loc);
    
    if (elements.length > 0) {
      return selectElement(elements, locatorIndex);
    }
  }

  throw new Error(`No element found for locator: ${locator}`);
}

function selectElement(
  elements: ElementHandle[],
  locatorIndex?: string
): ElementHandle {
  if (!locatorIndex || locatorIndex === 'first') {
    return elements[0];
  }

  if (locatorIndex === 'last') {
    return elements[elements.length - 1];
  }

  const index = parseInt(locatorIndex);
  if (!isNaN(index) && index >= 0 && index < elements.length) {
    return elements[index];
  }

  return elements[0];
}