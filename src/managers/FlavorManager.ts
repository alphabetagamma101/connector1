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

  async getWorkflow(url: string): Promise<WorkflowDefinition> {
    return this.getWorkflowByUrl(url);
  }

  private async getWorkflowByUrl(url: string): Promise<WorkflowDefinition> {
    const jsonString = await this.proprietary.fetchStepsJsonByUrl(url);
    const workflow: WorkflowDefinition = JSON.parse(jsonString);
    return workflow;
  }
}