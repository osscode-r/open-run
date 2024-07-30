#!/bin/bash

BACKUP_DIR="/mnt/backups"
DATE=$(date +"%Y%m%d")
BACKUP_PATH="$BACKUP_DIR/full_backup_$DATE.tar.gz"

LOG_FILE="/var/log/full_system_backup.log"

log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

if [ ! -d "$BACKUP_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
fi

log_message "Starting full system backup"

sudo tar -cvpzf "$BACKUP_PATH" --exclude=/proc --exclude=/lost+found --exclude=/mnt --exclude=/sys --exclude=/media --exclude=/dev --exclude=/tmp --exclude=/var/log --exclude=/var/cache/apt/archives --exclude=/usr/src/linux-headers* --exclude=/home/*/.cache --exclude=/home/*/.mozilla / 2>> "$LOG_FILE"

if [ $? -eq 0 ]; then
    log_message "Backup completed successfully: $BACKUP_PATH"
    
    BACKUP_SIZE=$(du -sh "$BACKUP_PATH" | cut -f1)
    log_message "Backup size: $BACKUP_SIZE"
    
    find "$BACKUP_DIR" -name "full_backup_*.tar.gz" -mtime +90 -delete
    log_message "Removed backups older than 90 days"
else
    log_message "Backup failed"
fi

log_message "Backup process completed"