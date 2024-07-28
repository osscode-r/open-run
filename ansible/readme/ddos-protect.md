This playbook implements several DDoS mitigation strategies:

* Updates the system and installs necessary packages.
* Configures kernel parameters to harden against SYN floods and other attacks.
* Sets up iptables rules to:

    * Allow legitimate traffic on specified ports.
    * Drop invalid packets.
    * Rate limit incoming TCP connections.


* Configures fail2ban to block IP addresses that show malicious behavior.
* Sets up Nginx with rate limiting to restrict the number of requests from a single IP.