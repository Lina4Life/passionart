# PowerShell script to add copyright headers to source files
# Usage: .\add_copyright_headers.ps1

$copyrightHeaderJS = @"
/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */

"@

$copyrightHeaderCSS = @"
/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */

"@

# Function to add header to a file if it doesn't already exist
function Add-Header {
    param(
        [string]$FilePath,
        [string]$Header
    )
    
    $content = Get-Content $FilePath -Raw
    if ($content -notmatch "Copyright \(c\) 2025 Youssef Mohamed Ali") {
        Write-Host "Adding copyright header to: $FilePath"
        $newContent = $Header + $content
        Set-Content -Path $FilePath -Value $newContent -NoNewline
    } else {
        Write-Host "Copyright header already exists in: $FilePath"
    }
}

# Add headers to JavaScript files
Get-ChildItem -Path . -Filter "*.js" -Recurse | 
    Where-Object { $_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "\.git" } |
    ForEach-Object { Add-Header -FilePath $_.FullName -Header $copyrightHeaderJS }

# Add headers to JSX files
Get-ChildItem -Path . -Filter "*.jsx" -Recurse | 
    Where-Object { $_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "\.git" } |
    ForEach-Object { Add-Header -FilePath $_.FullName -Header $copyrightHeaderJS }

# Add headers to CSS files
Get-ChildItem -Path . -Filter "*.css" -Recurse | 
    Where-Object { $_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "\.git" } |
    ForEach-Object { Add-Header -FilePath $_.FullName -Header $copyrightHeaderCSS }

Write-Host "Copyright headers have been added to all source files."
