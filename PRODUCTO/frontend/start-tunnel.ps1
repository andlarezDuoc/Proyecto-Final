# start-tunnel.ps1
# ------------------------------------------------------------
# PowerShell helper to run the Next.js development server
# and expose it publicly via a temporary tunnel.
# ------------------------------------------------------------

# 1️⃣ Ensure you have Node.js installed and the project dependencies
#    installed (`npm install`).
# 2️⃣ This script uses `localtunnel` (installed on‑the‑fly with npx) to
#    create a public URL that forwards to the local dev server on port 3000.
#    You can change the subdomain (tattoodemo) to any available name.
#
# Usage:   ./start-tunnel.ps1   (run from PowerShell in the frontend directory)
#
# The script opens the dev server in a background process, waits a few
# seconds for it to start, then launches the tunnel.

# Start the Next.js dev server in a new background window
Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WindowStyle Normal

# Give the dev server a moment to boot up
Start-Sleep -Seconds 8

# Open a public tunnel (localtunnel) – the URL will be printed to the console.
# Example output: https://tattoodemo.loca.lt
# If the subdomain is taken, omit the '--subdomain' flag to get a random one.
$npxCommand = "npx -y localtunnel --port 3000 --subdomain tattoodemo"
Write-Host "Launching public tunnel..."
Invoke-Expression $npxCommand
