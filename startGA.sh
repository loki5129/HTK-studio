#!/bin/bash
curl -X POST http://localhost:3000/runGA \
  -H "Content-Type: application/json" \
  -d '{"popSize":100,"generations":50}'
