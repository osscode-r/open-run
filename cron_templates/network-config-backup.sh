#!/bin/bash


BACKUP_DIR="/mnt/network_backups"
DATE=$(date +"%Y%m%d")
BACKUP_PATH="$BACKUP_DIR/network_backup_$DATE"

LOG_FILE="/var/log/network_config_backup.log"

DEVICES=(
    "192.168.1.1"
    "192.168.1.2"
    "router.example.com"
)

log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

if [ ! -d "$BACKUP_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
fi

log_message "Starting network configuration backup"

mkdir -p "$BACKUP_PATH"

for device in "${DEVICES[@]}"; do
    log_message "Backing up configuration for device: $device"
    
    scp "admin@$device:/config/config.xml" "$BACKUP_PATH/${device}_config.xml" 2>> "$LOG_FILE"
    
    if [ $? -eq 0 ]; then
        log_message "Successfully backed up configuration for $device"
    else
        log_message "Failed to backup configuration for $device"
    fi
done

tar -czf "${BACKUP_PATH}.tar.gz" -C "$BACKUP_DIR" "$(basename "$BACKUP_PATH")"
rm -rf "$BACKUP_PATH"

log_message "Network configuration backup completed: ${BACKUP_PATH}.tar.gz"

find "$BACKUP_DIR" -name "network_backup_*.tar.gz" -mtime +30 -delete
log_message "Removed network configuration backups older than 30 days"