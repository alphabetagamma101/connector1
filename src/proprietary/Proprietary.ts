// src/proprietary/Proprietary.ts
export class Proprietary {
  async fetchStepsJsonByUrl(url: string): Promise<string> {
    // TODO: Implement your proprietary logic to fetch JSON based on URL
    // This could involve:
    // - Reading from a database
    // - Making an API call
    // - Reading from files
    // - Any custom logic specific to your use case

    // For now, returning a sample JSON string based on URL matching
    if (url.includes('chatgpt.com')) {
      return this.get_json_for_chatgpt(url)
    }

    // Default fallback
    throw new Error(`No workflow JSON found for URL: ${url}`);
  }

  get_json_for_chatgpt(url: string) {
      return JSON.stringify({
        url: url,
        "steps" : [
          {
            "type" : "type_content",
            "locator" : "div[contenteditable='true']",
            "content" : "PH_CONTENT"
          },
          {
            "type" : "wait",
            "waitTimeInMillis" : "2000"
          },
          {
            "type": "move_mouse_and_click",
            "locator": "button[id='composer-submit-button']"
          },
          {
            "type" : "wait_till_appears",
            "locatorIndex" : "last",
            "locator" : "button[aria-label='Start voice mode']",
            "timeout" : "180000"
          },
          {
            "type" : "scroll_rightmost_to_bottom"
          },
          {
            "type" : "wait",
            "waitTimeInMillis" : "2000"
          },
          {
            "type" : "move_mouse_and_click",
            "locatorIndex" : "last",
            "locator" : "button[aria-label='Copy']"
          },
          {
            "type" : "wait",
            "waitTimeInMillis" : "2000"
          },
          {
            "type" : "result",
            "content" : "clipboard"
          }
        ]
      });
    }
}