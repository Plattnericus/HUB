#!/bin/zsh
# Rebuild the static export, (re)serve it, and screenshot one or more URLs.
# Usage: scripts/shot.sh [hash1 hash2 ...]   e.g. scripts/shot.sh "" projects portfolio
set -e
cd "$(dirname "$0")/.."

npm run build >/tmp/build.log 2>&1 || { tail -20 /tmp/build.log; exit 1; }

pkill -f "http.server" 2>/dev/null || true
(cd out && python3 -m http.server 4321 >/tmp/pyserve.log 2>&1 &)
sleep 1.5

# ensure chrome+CDP is up
if ! curl -s -o /dev/null http://localhost:9222/json/version; then
  pkill -f "Google Chrome" 2>/dev/null || true
  sleep 1
  rm -rf /tmp/chrome-prof
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-sandbox \
    --user-data-dir=/tmp/chrome-prof --remote-debugging-port=9222 --use-gl=angle \
    --use-angle=swiftshader --enable-webgl --ignore-gpu-blocklist --window-size=1600,1000 \
    about:blank >/tmp/chrome3.log 2>&1 &
  sleep 3
fi

hashes=("$@")
[ ${#hashes[@]} -eq 0 ] && hashes=("")
for h in "${hashes[@]}"; do
  name="${h:-exterior}"
  url="http://localhost:4321/"
  [ -n "$h" ] && url="$url#$h"
  node scripts/cdp-check.mjs "$url" "/tmp/shot-$name.png" 14000 2>&1 | grep -iE 'exception|screenshot' || true
done
echo "done"
