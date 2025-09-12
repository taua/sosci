#!/bin/bash
npm run build
git add dist
git commit -m "Build and deploy: $(date '+%Y-%m-%d %H:%M:%S')"
git push