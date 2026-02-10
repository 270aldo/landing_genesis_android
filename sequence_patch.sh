#!/bin/bash

# Fix missing frames by copying the previous frame
# Based on the browser agent's finding of missing frames: 072, 082, 085, 091, 098, 101, 102, 106, 116

cd public/sequence || exit

# Helper function to copy if source exists and dest doesn't
copy_frame() {
  src="genesis_$(printf "%03d" $1).webp"
  dest="genesis_$(printf "%03d" $2).webp"
  
  if [ -f "$src" ]; then
    if [ ! -f "$dest" ]; then
      cp "$src" "$dest"
      echo "Created $dest from $src"
    else
      echo "$dest already exists"
    fi
  else
    echo "Warning: Source $src does not exist"
  fi
}

copy_frame 71 72
copy_frame 81 82
copy_frame 84 85
copy_frame 90 91
copy_frame 97 98
copy_frame 100 101
copy_frame 100 102  # 101 might not exist yet if run in parallel, so use 100 or 101 carefully. 
                    # Sequential commands in script are safe.
copy_frame 105 106
copy_frame 115 116

echo "Patch complete."
