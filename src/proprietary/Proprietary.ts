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
            "type" : "wait_till_present",
            "locatorIndex" : "last",
            "locator" : "svg path[d='M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm40-112v56a12,12,0,0,1-12,12H100a12,12,0,0,1-12-12V100a12,12,0,0,1,12-12h56A12,12,0,0,1,168,100Z']",
            "waitTimeInMillis" : "5000"
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