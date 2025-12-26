#!/bin/bash

# Takes 1 param: the description of what to create (e.g., "sum two numbers")
TARGET_CONTENT=$1

curl -X POST http://localhost:3000/api/invoke \
  -H "Content-Type: application/json" \
  -d "{
    \"content\": \"write python file to $TARGET_CONTENT\",
    \"url\": \"https://chatgpt.com/\"
  }"