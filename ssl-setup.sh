#!/bin/sh

# SSL setup script for Nginx
# This script handles SSL certificate generation and renewal

SSL_DIR="/etc/nginx/ssl"
CERT_FILE="$SSL_DIR/cert.pem"
KEY_FILE="$SSL_DIR/key.pem"

# Create SSL directory if it doesn't exist
mkdir -p $SSL_DIR

# Check if certificates already exist
if [ ! -f "$CERT_FILE" ] || [ ! -f "$KEY_FILE" ]; then
    echo "Generating self-signed SSL certificates..."
    
    # Generate self-signed certificate
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout "$KEY_FILE" \
        -out "$CERT_FILE" \
        -subj "/C=KR/ST=Seoul/L=Seoul/O=Teaming/OU=IT/CN=teaming-admin.local"
    
    echo "SSL certificates generated successfully."
else
    echo "SSL certificates already exist."
fi

# Set proper permissions
chmod 600 "$KEY_FILE"
chmod 644 "$CERT_FILE"

# Start nginx
echo "Starting Nginx..."
exec nginx -g "daemon off;"

