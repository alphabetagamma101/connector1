curl -X POST http://localhost:3000/api/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "content": "hello",
    "url": "https://chatgpt.com/"
  }'