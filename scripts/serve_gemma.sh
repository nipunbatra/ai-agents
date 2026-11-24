#!/bin/sh
# Serve Gemma 4 locally with llama.cpp, for recording the runs the slides show (the notebook itself uses Ollama).
#   sh scripts/serve_gemma.sh 12b     port 8791, alias gemma4:12b
#   sh scripts/serve_gemma.sh e4b     port 8792, alias gemma4:e4b
# The model files live in a Hugging Face cache; set HF_CACHE if yours is elsewhere.
HF_CACHE="${HF_CACHE:-/Volumes/Extreme SSD/hf-cache}"
case "$1" in
  12b) FILE=$(ls "$HF_CACHE"/models--google--gemma-4-12B-it-qat-q4_0-gguf/snapshots/*/gemma-4-12b-it-qat-q4_0.gguf | head -1); PORT=8791 ;;
  e4b) FILE=$(ls "$HF_CACHE"/models--google--gemma-4-E4B-it-qat-q4_0-gguf/snapshots/*/gemma-4-E4B_q4_0-it.gguf | head -1); PORT=8792 ;;
  *) echo "usage: $0 12b|e4b"; exit 1 ;;
esac
exec llama-server -m "$FILE" --alias "gemma4:$1" --port "$PORT" --host 127.0.0.1 -c 16384 -ngl 99 --parallel 1 --reasoning off --log-disable
