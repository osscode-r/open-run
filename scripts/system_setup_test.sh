#!/bin/bash

set -e

print_message() {
    echo -e "\e[1;34m$1\e[0m"
}

print_error() {
    echo -e "\e[1;31mERROR: $1\e[0m"
}

if [[ $EUID -ne 0 ]]; then
    print_error "This script must be run as root"
    exit 1
fi

APP_DIR="/opt/hostman"

if [ ! -f .env ]; then
    print_message "Creating .env file with default values..."
    cat << EOF > .env
USERNAME=hostman
PASSWORD=hostmanpassphrase
EOF
    chmod 600 .env
else
    print_message "Using existing .env file..."
fi

source .env

if [ -z "$USERNAME" ] || [ -z "$PASSWORD" ]; then
    print_error "USERNAME and PASSWORD must be set in the .env file."
    exit 1
fi

print_message "Creating user $USERNAME..."
if id "$USERNAME" &>/dev/null; then
    print_message "User $USERNAME already exists."
else
    useradd -m -s /bin/bash "$USERNAME" || { print_error "Failed to create user $USERNAME"; exit 1; }
    echo "$USERNAME:$PASSWORD" | chpasswd || { print_error "Failed to set password for $USERNAME"; exit 1; }
    usermod -aG sudo "$USERNAME" || { print_error "Failed to add $USERNAME to sudo group"; exit 1; }
    echo "$USERNAME ALL=(ALL) NOPASSWD: ALL" > "/etc/sudoers.d/$USERNAME" || { print_error "Failed to set sudo privileges for $USERNAME"; exit 1; }
    chmod 0440 "/etc/sudoers.d/$USERNAME" || { print_error "Failed to set permissions on sudoers file"; exit 1; }
fi

print_message "Creating application directory structure..."
mkdir -p $APP_DIR/{app,configs,logs,data} || { print_error "Failed to create directory structure"; exit 1; }
chown -R $USERNAME:$USERNAME $APP_DIR || { print_error "Failed to set ownership of $APP_DIR"; exit 1; }

print_message "Installing Docker..."
if ! command -v docker &> /dev/null; then
    print_message "Downloading Docker installation script..."
    curl -fsSL https://get.docker.com -o get-docker.sh || { print_error "Failed to download Docker installation script"; exit 1; }
    print_message "Running Docker installation script..."
    sh get-docker.sh || { print_error "Docker installation failed"; exit 1; }
    print_message "Docker installation completed."
else
    print_message "Docker is already installed."
fi

print_message "Creating initial configuration..."
cat << EOF > $APP_DIR/configs/system.yaml || { print_error "Failed to create system.yaml"; exit 1; }
installation_path: $APP_DIR
max_projects: 10
EOF

SERVER_IP=$(ip -4 addr show scope global | grep inet | awk '{print $2}' | cut -d / -f 1 | head -n 1)

print_message "Installation complete!"
echo "Server IP: $SERVER_IP"

print_message "Available IP addresses:"
ip -4 addr show scope global | grep inet | awk '{print $2}' | cut -d / -f 1

print_message "Test completed. The following steps were performed:"
echo "1. User creation"
echo "2. Directory structure setup"
echo "3. Docker installation (or verification)"
echo "4. Initial configuration file creation"
echo "Application-specific steps were skipped for this test."