#!/bin/bash

set -e

print_message() {
    echo -e "\e[1;34m$1\e[0m"
}

if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 
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
    print_message "Error: USERNAME and PASSWORD must be set in the .env file."
    exit 1
fi

print_message "Creating user $USERNAME..."
useradd -m -s /bin/bash "$USERNAME"
echo "$USERNAME:$PASSWORD" | chpasswd
usermod -aG sudo "$USERNAME"
echo "$USERNAME ALL=(ALL) NOPASSWD: ALL" > "/etc/sudoers.d/$USERNAME"
chmod 0440 "/etc/sudoers.d/$USERNAME"

print_message "Creating application directory structure..."
mkdir -p $APP_DIR/{app,configs,logs,data}
chown -R $USERNAME:$USERNAME $APP_DIR

print_message "Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

print_message "Installing Rust..."
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

print_message "Creating initial configuration..."
cat << EOF > $APP_DIR/configs/system.yaml
installation_path: $APP_DIR
max_projects: 10
EOF

print_message "Cloning project repository..."
git clone https://github.com/yourusername/cloud-run-alternative.git $APP_DIR/app
cd $APP_DIR/app

print_message "Building the application..."
sudo -u "$USERNAME" cargo build --release
cp target/release/cloud-run-alternative $APP_DIR/

print_message "Setting up systemd service..."
cat << EOF > /etc/systemd/system/cloud-run-alternative.service
[Unit]
Description=Cloud Run Alternative
After=network.target

[Service]
ExecStart=$APP_DIR/cloud-run-alternative
WorkingDirectory=$APP_DIR
User=$USERNAME
Group=$USERNAME
Restart=always

[Install]
WantedBy=multi-user.target
EOF

systemctl enable cloud-run-alternative
systemctl start cloud-run-alternative

SERVER_IP=$(ip -4 addr show scope global | grep inet | awk '{print $2}' | cut -d / -f 1 | head -n 1)

print_message "Installation complete!"
echo "You can now access your application at http://$SERVER_IP:8080"

print_message "Available IP addresses:"
ip -4 addr show scope global | grep inet | awk '{print $2}' | cut -d / -f 1