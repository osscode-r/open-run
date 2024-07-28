# process

* user will use the installation script and optionally passes the domain name as an argument to run this script
* install ansible on detected operating system - `DONE`
* deploys our backend and frontend on the host system
* if the user has provided an domain name then url will be returned with https://hostman.domain.tld else the http://ip:port is printed on to the terminal
* To make the application more secure we can create an vpn service on the host system, and user must be connected to vpn, inorder to access the dashboard , only that ip will be whitelisted. since our application is web-based.


```
graph TD
    A[Client Browser] -->|HTTPS| B[Nginx Reverse Proxy]
    B --> C[Frontend: Next.js + Tailwind CSS]
    B --> D[Backend API: Rust]
    D --> E[Docker Engine]
    D --> F[GitHub Webhook Receiver]
    F --> G[CI/CD Pipeline]
    G --> E
    D --> H[Database]
    I[Installation Script] --> J[VPS Setup]