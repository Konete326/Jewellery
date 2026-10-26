param(
    [string]$Message = "Live update"
)

$ErrorActionPreference = "Stop"

node sync-dist.js
git add .
git commit -m $Message
git push origin main
