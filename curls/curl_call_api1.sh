#!/bin/bash

# curls/curl_call_api1.sh
# Sample curl command to call the /api/invoke endpoint

curl -X POST http://localhost:3000/api/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "content": "hello",
    "url": "https://www.cnn.com"
  }'