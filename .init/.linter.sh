#!/bin/bash
cd /home/kavia/workspace/code-generation/chat-app-with-whatsapp-style-tagging--dynamic-autocomplete-209953-210066/BackendAPIService
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

