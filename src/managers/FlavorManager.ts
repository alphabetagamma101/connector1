// src/managers/FlavorManager.ts
import { WorkflowDefinition } from '../types/workflow';
import { loadFlavorConfig } from '../config/flavorConfig';

export class FlavorManager {
  private flavorConfigs: Map<string, WorkflowDefinition>;

  constructor() {
    this.flavorConfigs = loadFlavorConfig();
  }

  async getWorkflow(url?: string, flavor?: string): Promise<WorkflowDefinition> {
    if (flavor && this.flavorConfigs.has(flavor)) {
      return this.flavorConfigs.get(flavor)!;
    }

    if (url) {
      return this.getWorkflowByUrl(url);
    }

    throw new Error('No valid workflow found for given url or flavor');
  }

  private getWorkflowByUrl(url: string): WorkflowDefinition {
    // Simple URL-based workflow mapping
    // You can extend this with more sophisticated matching
    for (const [key, workflow] of this.flavorConfigs.entries()) {
      if (workflow.url === url || url.includes(key)) {
        return workflow;
      }
    }

    throw new Error(`No workflow found for URL: ${url}`);
  }
}