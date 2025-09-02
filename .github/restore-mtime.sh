#!/bin/bash

is_shallow=$(git rev-parse --is-shallow-repository)
if [ "$is_shallow" != "false" ]; then
  echo "Shallow repository, making it unshallow..."
  git fetch --prune --unshallow
fi

echo "Downloading git-restore-mtime..."

mkdir -p $HOME/.local/bin
curl -o $HOME/.local/bin/git-restore-mtime -fsSL https://raw.githubusercontent.com/MestreLion/git-tools/refs/heads/main/git-restore-mtime

echo "Restoring mtime..."

python3 $HOME/.local/bin/git-restore-mtime || echo "Failed to restore mtime"
