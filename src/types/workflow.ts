// src/types/workflow.ts
export interface WorkflowDefinition {
  url: string;
  steps: WorkflowStep[];
}

export interface WorkflowStep {
  type: 'type_content' | 'move_mouse_and_click' | 'wait' | 'wait_till_present' | 'wait_till_appears' | 'result' | 'scroll_rightmost_to_bottom';
  locator?: string;
  locatorIndex?: string;
  content?: string;
  waitTimeInMillis?: string;
  timeout?: string;
}