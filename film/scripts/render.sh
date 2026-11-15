#!/usr/bin/env bash
# MacBook side (light): ship the film source + t3-orbit.json to StarkPC, render there, pull the results into media/.
#   film/scripts/render.sh            full render (16:9 + square + poster)
#   film/scripts/render.sh --stills   half-size layout stills only → film/out/stills/
set -euo pipefail
film=$(cd "$(dirname "$0")/.." && pwd); repo=$(dirname "$film")
ssh starkpc "tasklist | findstr /i \"VALORANT-Win64 VALORANT.exe\"" && { echo "GAME running on StarkPC — not starting"; exit 3; }
tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT
COPYFILE_DISABLE=1 tar -C "$repo" --exclude film/node_modules --exclude film/out -czf "$tmp/src.tgz" t3-orbit.json film
ssh starkpc "if not exist C:\\t3-orbit-film\\repo mkdir C:\\t3-orbit-film\\repo"
scp -q "$tmp/src.tgz" starkpc:C:/t3-orbit-film/src.tgz
ssh starkpc "cd /d C:\\t3-orbit-film\\repo && tar -xzf ..\\src.tgz"
flag=""; [ "${1:-}" = --stills ] && flag="-Stills ${2:-}"; [ "${1:-}" = --kit ] && flag="-KitOnly"
set +e
ssh starkpc "powershell -NoProfile -ExecutionPolicy Bypass -File C:\\t3-orbit-film\\repo\\film\\scripts\\render-starkpc.ps1 $flag"; rc=$?
set -e
[ $rc = 3 ] && { echo "stopped for a game; re-run when it's gone"; exit 3; }
[ $rc != 0 ] && exit $rc
mkdir -p "$film/out"
if [ "${1:-}" = --stills ]; then
  mkdir -p "$film/out/stills"; scp -q "starkpc:C:/t3-orbit-film/repo/film/out/stills/*" "$film/out/stills/"
else
  mkdir -p "$film/out/kit" "$repo/media"
  scp -q "starkpc:C:/t3-orbit-film/repo/film/out/kit/*.gif" "starkpc:C:/t3-orbit-film/repo/film/out/kit/*.png" "$film/out/kit/"
  cp "$film/out/kit/"*.gif "$film/out/kit/before-after.png" "$repo/media/"
  if [ "${1:-}" != --kit ]; then
    scp -q starkpc:C:/t3-orbit-film/repo/film/out/{t3-orbit-film.mp4,t3-orbit-square.mp4,poster.png,final-loudness.txt} "$film/out/"
    cp "$film/out/t3-orbit-film.mp4" "$film/out/poster.png" "$repo/media/"
    cp "$film/out/t3-orbit-square.mp4" "$repo/media/x-post.mp4"   # the square cut, for X
  fi
fi
echo done
