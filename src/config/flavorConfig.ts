// src/config/flavorConfig.ts
import { WorkflowDefinition } from '../types/workflow';

export function loadFlavorConfig(): Map<string, WorkflowDefinition> {
  const configs = new Map<string, WorkflowDefinition>();

  // Example flavor configuration
  configs.set('cnn_search', {
    url: 'https://www.cnn.com',
    steps: [
      {
        type: 'type_content',
        locator: 'input[type="search"] || #search-input',
        locatorIndex: 'first',
        content: 'PH_CONTENT'
      },
      {
        type: 'wait',
        waitTimeInMillis: '2000'
      },
      {
        type: 'move_mouse_and_click',
        locator: 'button[type="submit"] || .search-button',
        locatorIndex: 'first'
      }
    ]
  });

  return configs;
}