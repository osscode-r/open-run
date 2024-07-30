#!/bin/bash

LOG_FILE="/var/log/system_health_check.log"

log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2 + $4}')
log_message "CPU Usage: $cpu_usage%"

memory_usage=$(free | awk '/Mem/{printf("%.2f%"), $3/$2*100}')
log_message "Memory Usage: $memory_usage"

disk_usage=$(df -h / | awk '/\/$/ {print $5}')
log_message "Disk Usage: $disk_usage"

high_cpu_processes=$(ps aux | awk '$3 > 50.0 {print $2, $3, $11}' | sort -k2 -nr | head -n 5)
if [ -n "$high_cpu_processes" ]; then
    log_message "High CPU Processes:"
    log_message "$high_cpu_processes"
fi

if command -v apt-get &> /dev/null; then
    updates=$(apt-get -s upgrade | grep -P '^\d+ upgraded' | cut -d" " -f1)
    log_message "Available Updates: $updates"
fi

failed_services=$(systemctl --failed --no-pager)
if [ -n "$failed_services" ]; then
    log_message "Failed Services:"
    log_message "$failed_services"
fi

log_message "System Health Check Completed"