curl -X POST http://localhost:3000/api/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "content": "write python file to calculate factorial of a number",
    "url": "https://chatgpt.com/"
  }'