#!/bin/bash
export PATH="/opt/homebrew/Cellar/node/25.9.0_1/bin:/opt/homebrew/bin:$PATH"
cd /Users/nirsala/adi-bergman-jewelry
exec node node_modules/.bin/next dev --port 3333
