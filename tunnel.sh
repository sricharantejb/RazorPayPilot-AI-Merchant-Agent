#!/usr/bin/env bash
# ==============================================================================
# RazorPayPilot — Live Public Demo Tunnel
# Exposes http://127.0.0.1:5100 to an instant public HTTPS URL
# ==============================================================================

PORT="${1:-5100}"
PROVIDER="${2:-pinggy}"

echo "========================================================"
echo "🚀 Starting RazorPayPilot Public Demo Tunnel (Port ${PORT})"
echo "   Provider: ${PROVIDER}"
echo "   Press Ctrl+C to stop the tunnel"
echo "========================================================"
echo ""

if [ "$PROVIDER" = "localhost.run" ]; then
    while true; do
        echo "Connecting to localhost.run..."
        ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 -R 80:localhost:"${PORT}" nokey@localhost.run
        echo "Tunnel connection dropped. Reconnecting in 3 seconds..."
        sleep 3
    done
else
    while true; do
        echo "Connecting to Pinggy (HTTPS port 443)..."
        ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 -p 443 -R 0:localhost:"${PORT}" a.pinggy.io
        echo "Tunnel connection dropped. Reconnecting in 3 seconds..."
        sleep 3
    done
fi
