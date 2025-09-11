#!/bin/bash

# Script to add copyright headers to source files
# Usage: ./add_copyright_headers.sh

COPYRIGHT_HEADER_JS="/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */

"

COPYRIGHT_HEADER_CSS="/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */

"

# Function to add header to a file if it doesn't already exist
add_header() {
    local file="$1"
    local header="$2"
    
    if ! grep -q "Copyright (c) 2025 Youssef Mohamed Ali" "$file"; then
        echo "Adding copyright header to: $file"
        echo "$header" | cat - "$file" > temp && mv temp "$file"
    else
        echo "Copyright header already exists in: $file"
    fi
}

# Add headers to JavaScript files
find . -name "*.js" -not -path "./node_modules/*" -not -path "./.git/*" | while read file; do
    add_header "$file" "$COPYRIGHT_HEADER_JS"
done

# Add headers to JSX files
find . -name "*.jsx" -not -path "./node_modules/*" -not -path "./.git/*" | while read file; do
    add_header "$file" "$COPYRIGHT_HEADER_JS"
done

# Add headers to CSS files
find . -name "*.css" -not -path "./node_modules/*" -not -path "./.git/*" | while read file; do
    add_header "$file" "$COPYRIGHT_HEADER_CSS"
done

echo "Copyright headers have been added to all source files."
