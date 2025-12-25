curl -X POST http://localhost:3000/api/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "content": "### GUIDELINES any file that is modified, show the complete file. no need to include files that are not modified at all. make only the change requested with minimal code changes, no other change to be performed. show all code-files inline only using 3-ticks. each codefile should be properly formatted and not just into a single line code. at the end, add the codeblocks metadata for all included codefiles in your response, in the following format:[codeblocks-metadata][\\{ \"codeblock\" : \"1\", \"filename\" : \"here comes subpath of the file associated with codeblock-1\"\\},\\{ \"codeblock\" : \"2\", \"filename\" : \"here comes subpath of the file associated with codeblock-2\"\\},\\{ \"codeblock\" : \"3\", \"filename\" : \"here comes subpath of the file associated with codeblock-3\"\\}][/codeblocks-metadata] If any code changes are made, provide a small summary of changes (not more than 5-6 lines) after the code-metadata."
   ,
    "url": "https://www.chatgpt.com/"
   }'

