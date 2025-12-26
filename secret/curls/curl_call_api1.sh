curl -X POST http://localhost:3000/api/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "content": "hello, what is the current time in PST",
    "url": "https://chatgpt.com/"
  }'