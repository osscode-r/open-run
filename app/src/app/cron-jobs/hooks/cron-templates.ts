import { CreateCronJobRequest } from '../types';

export const weeklyLogRotation: CreateCronJobRequest = {
    name: "Weekly Log Rotation",
    schedule: "0 0 * * 0",
    command: "/usr/sbin/logrotate /etc/logrotate.conf",
    description: "Rotate logs every Sunday at midnight",
    bash_script: undefined
};

export const monthlySystemUpdate: CreateCronJobRequest = {
    name: "Monthly System Update",
    schedule: "0 3 1 * *",
    command: "apt update && apt upgrade -y",
    description: "Update system packages on the 1st of every month at 3 AM",
    bash_script: undefined
};

export const dailyDiskCheck: CreateCronJobRequest = {
    name: "Daily Disk Space Check",
    schedule: "30 23 * * *",
    command: "df -h > /var/log/disk_space.log",
    description: "Check disk space usage daily at 11:30 PM",
    bash_script: undefined
};

export const weeklyCleanup: CreateCronJobRequest = {
    name: "Weekly File Cleanup",
    schedule: "0 2 * * 6",
    command: "find /tmp -type f -atime +7 -delete",
    description: "Delete files in /tmp older than 7 days every Saturday at 2 AM",
    bash_script: undefined
};

export const dailyDatabaseBackup: CreateCronJobRequest = {
    name: "Daily Database Backup",
    schedule: "0 1 * * *",
    command: "pg_dump -U postgres mydatabase > /backups/mydatabase_$(date +\\%Y\\%m\\%d).sql",
    description: "Create a daily backup of the PostgreSQL database at 1 AM",
    bash_script: undefined
};

export const hourlySyncFiles: CreateCronJobRequest = {
    name: "Hourly File Sync",
    schedule: "0 * * * *",
    command: "rsync -avz /source/directory/ /destination/directory/",
    description: "Sync files between directories every hour",
    bash_script: undefined
};

export const weeklySystemReboot: CreateCronJobRequest = {
    name: "Weekly System Reboot",
    schedule: "0 4 * * 7",
    command: "shutdown -r now",
    description: "Reboot the system every Sunday at 4 AM",
    bash_script: undefined
};

export const dailyMemoryCheck: CreateCronJobRequest = {
    name: "Daily Memory Usage Check",
    schedule: "0 8 * * *",
    command: "free -h > /var/log/memory_usage.log",
    description: "Log memory usage daily at 8 AM",
    bash_script: undefined
};

export const monthlyUserAudit: CreateCronJobRequest = {
    name: "Monthly User Audit",
    schedule: "0 2 1 * *",
    command: "awk -F: '{print $1}' /etc/passwd > /var/log/user_list_$(date +\\%Y\\%m).log",
    description: "Generate a list of all system users on the 1st of every month at 2 AM",
    bash_script: undefined
};

export const dailyNetworkCheck: CreateCronJobRequest = {
    name: "Daily Network Check",
    schedule: "0 7 * * *",
    command: "ping -c 4 google.com >> /var/log/network_check.log",
    description: "Check network connectivity daily at 7 AM",
    bash_script: undefined
};

export const weeklySoftwareAudit: CreateCronJobRequest = {
    name: "Weekly Software Audit",
    schedule: "0 5 * * 1",
    command: "dpkg -l > /var/log/installed_packages_$(date +\\%Y\\%m\\%d).log",
    description: "Log all installed packages every Monday at 5 AM",
    bash_script: undefined
};

export const dailyTempFilesCleanup: CreateCronJobRequest = {
    name: "Daily Temp Files Cleanup",
    schedule: "0 2 * * *",
    command: "find /tmp -type f -atime +1 -delete",
    description: "Delete temporary files older than 24 hours daily at 2 AM",
    bash_script: undefined
};

export const hourlyLoadAverage: CreateCronJobRequest = {
    name: "Hourly Load Average Check",
    schedule: "0 * * * *",
    command: "uptime >> /var/log/load_average.log",
    description: "Log system load average every hour",
    bash_script: undefined
};

export const dailySSHLoginAttempts: CreateCronJobRequest = {
    name: "Daily SSH Login Attempts",
    schedule: "59 23 * * *",
    command: "grep 'sshd' /var/log/auth.log | grep 'Failed password' > /var/log/failed_ssh_$(date +\\%Y\\%m\\%d).log",
    description: "Log failed SSH login attempts daily at 11:59 PM",
    bash_script: undefined
};

export const weeklyDockerCleanup: CreateCronJobRequest = {
    name: "Weekly Docker Cleanup",
    schedule: "0 1 * * 0",
    command: "docker system prune -af --volumes",
    description: "Clean up unused Docker resources weekly on Sunday at 1 AM",
    bash_script: undefined
};

export const monthlySSLCertCheck: CreateCronJobRequest = {
    name: "Monthly SSL Certificate Check",
    schedule: "0 0 1 * *",
    command: "openssl x509 -enddate -noout -in /etc/ssl/certs/your-cert.pem >> /var/log/ssl_expiry.log",
    description: "Check SSL certificate expiration date monthly",
    bash_script: undefined
};

export const dailyFirewallLog: CreateCronJobRequest = {
    name: "Daily Firewall Log",
    schedule: "59 23 * * *",
    command: "iptables -L -n > /var/log/firewall_rules_$(date +\\%Y\\%m\\%d).log",
    description: "Log firewall rules daily at 11:59 PM",
    bash_script: undefined
};

export const dailyApacheLogRotate: CreateCronJobRequest = {
    name: "Daily Apache Log Rotate",
    schedule: "0 0 * * *",
    command: "mv /var/log/apache2/access.log /var/log/apache2/access.log.$(date +\\%Y\\%m\\%d) && touch /var/log/apache2/access.log && systemctl reload apache2",
    description: "Rotate Apache access logs daily at midnight",
    bash_script: undefined
};

export const weeklyDatabaseOptimize: CreateCronJobRequest = {
    name: "Weekly Database Optimize",
    schedule: "0 2 * * 0",
    command: "mysqlcheck -o --all-databases -u root -p$(cat /root/.mysql_password)",
    description: "Optimize all MySQL databases weekly on Sunday at 2 AM",
    bash_script: undefined
};

export const dailyNginxErrorLog: CreateCronJobRequest = {
    name: "Daily Nginx Error Log Check",
    schedule: "0 7 * * *",
    command: "grep 'error' /var/log/nginx/error.log | tail -n 50 > /var/log/nginx_errors_$(date +\\%Y\\%m\\%d).log",
    description: "Check and log the last 50 Nginx errors daily at 7 AM",
    bash_script: undefined
};

export const hourlyActiveConnections: CreateCronJobRequest = {
    name: "Hourly Active Connections",
    schedule: "0 * * * *",
    command: "netstat -tun | grep ESTABLISHED | wc -l >> /var/log/active_connections.log",
    description: "Log the number of active network connections hourly",
    bash_script: undefined
};

export const dailyCPUTemperature: CreateCronJobRequest = {
    name: "Daily CPU Temperature Log",
    schedule: "*/10 * * * *",
    command: "sensors | grep 'Core 0' | awk '{print $3}' >> /var/log/cpu_temp.log",
    description: "Log CPU temperature every 10 minutes",
    bash_script: undefined
};

export const weeklyUpdateMalwareDatabase: CreateCronJobRequest = {
    name: "Weekly Update Malware Database",
    schedule: "0 1 * * 1",
    command: "freshclam",
    description: "Update ClamAV malware database weekly on Monday at 1 AM",
    bash_script: undefined
};

export const dailyCheckZombieProcesses: CreateCronJobRequest = {
    name: "Daily Check for Zombie Processes",
    schedule: "0 4 * * *",
    command: "ps aux | awk '{if ($8==\"Z\") {print $2}}' | xargs -r sudo kill -9",
    description: "Check and kill zombie processes daily at 4 AM",
    bash_script: undefined
};

export const monthlySendDiskUsageReport: CreateCronJobRequest = {
    name: "Monthly Disk Usage Report",
    schedule: "0 7 1 * *",
    command: "df -h | mail -s 'Monthly Disk Usage Report' admin@example.com",
    description: "Send monthly disk usage report via email on the 1st of each month at 7 AM",
    bash_script: undefined
};

export const weeklyCheckForReboot: CreateCronJobRequest = {
    name: "Weekly Check for Reboot Requirement",
    schedule: "0 3 * * 0",
    command: "if [ -f /var/run/reboot-required ]; then wall 'A system reboot is required!'; fi",
    description: "Check if a system reboot is required weekly on Sunday at 3 AM",
    bash_script: undefined
};

export const dailyUpdateDNSBLOCKLIST: CreateCronJobRequest = {
    name: "Daily Update DNS Blocklist",
    schedule: "0 5 * * *",
    command: "wget -O /etc/dnsmasq.d/blocklist.conf https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts && systemctl restart dnsmasq",
    description: "Update DNS blocklist daily at 5 AM",
    bash_script: undefined
};

export function getAllTemplates(): CreateCronJobRequest[] {
    return [
        weeklyLogRotation,
        monthlySystemUpdate,
        dailyDiskCheck,
        weeklyCleanup,
        dailyDatabaseBackup,
        hourlySyncFiles,
        weeklySystemReboot,
        dailyMemoryCheck,
        monthlyUserAudit,
        dailyNetworkCheck,
        weeklySoftwareAudit,
        dailyTempFilesCleanup,
        hourlyLoadAverage,
        dailySSHLoginAttempts,
        weeklyDockerCleanup,
        monthlySSLCertCheck,
        dailyFirewallLog,
        dailyApacheLogRotate,
        weeklyDatabaseOptimize,
        dailyNginxErrorLog,
        hourlyActiveConnections,
        dailyCPUTemperature,
        weeklyUpdateMalwareDatabase,
        dailyCheckZombieProcesses,
        monthlySendDiskUsageReport,
        weeklyCheckForReboot,
        dailyUpdateDNSBLOCKLIST
    ];
}

export function getTemplateByName(name: string): CreateCronJobRequest | undefined {
    const templates = getAllTemplates();
    return templates.find(template => template.name.toLowerCase() === name.toLowerCase());
}