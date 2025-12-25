// src/managers/FlavorManager.ts
import { WorkflowDefinition } from '../types/workflow';
import { loadFlavorConfig } from '../config/flavorConfig';
import { Proprietary } from '../proprietary/Proprietary';

export class FlavorManager {
  private flavorConfigs: Map<string, WorkflowDefinition>;
  private proprietary: Proprietary;

  constructor() {
    this.flavorConfigs = loadFlavorConfig();
    this.proprietary = new Proprietary();
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

  private async getWorkflowByUrl(url: string): Promise<WorkflowDefinition> {
    const jsonString = await this.proprietary.fetchStepsJsonByUrl(url);
    const workflow: WorkflowDefinition = JSON.parse(jsonString);
    return workflow;
  }
}