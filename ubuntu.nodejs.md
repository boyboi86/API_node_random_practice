#create a new file call nodesource.list

`$ sudo touch /etc/apt/sources.list.d/nodesource.list`

#create content with editor

`$ sudo nano /etc/apt/sources.list.d/nodesource.list`

`deb https://deb.nodesource.com/node_6.x xenial main
deb-src https://deb.nodesource.com/node_6.x xenial main`

#Download GPGkey

`$ curl -s https://deb.nodesource.com/gpgkey/nodesource.gpg.key | sudo apt-key add -`

#Update package

`$ sudo apt-get update`

# Check policy with the below command

`$ apt-cache policy nodejs`

You should see something like below

```
Version table:
    6.2.1-1nodesource1~xenial1 500
       500 https://deb.nodesource.com/node_6.x xenial/main amd64 Packages
    4.2.6~dfsg-1ubuntu4 500
       500 http://archive.ubuntu.com/ubuntu xenial/universe amd64 Packages
```

#Install nodeJS with npm

`$ sudo apt-get install nodejs`

#Check if the node is installed with the latest version

`$ node --version`

#Try the REPL with simple command to see if it is working

`$ node`

##Common Errors

Check path /etc/apt/sources.list.d/ if there are older verion node package, there should only be nodesource.list

Occasionally when there might be errors in linux detecting files so when you try `$ node` it might not work, try `$ nodejs`

#To set up port forwarding after security group and ports are set in the server (http/SSH) && (All TCP)if you have websocket

###Enable IP forward

`$ sudo vim /etc/sysctl.conf`

look for `net.ipv4.ip_forward=1` and uncomment it then run the below command to activate it

`$ sudo sysctl -p /etc/sysctl.conf`

###To foward to a particular port (in this case 80 for http for AWS while app server is listening on 3000)

`$sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 3000`

###To disable firewall so that port 80 can be used on AWS for input

`$ sudo iptables -A INPUT -p tcp -m tcp --sport 80 -j ACCEPT`

###To disable firewall so that port 80 can be used on AWS for output

`$ sudo iptables -A OUTPUT -p tcp -m tcp --dport 80 -j ACCEPT`

###Go to your app folder and run app and test if the public ip can reflect the server (elastic IP)

###Once you confirm it is up and running, open a new console and SSH to server then run the below command (Y to IPV4 N to IPV6)

`$ sudo apt-get install iptables-persistent`

###To confirm installation is correct, restart AWS server then initialize app again. Everything should work fine.

###Remember to run `export NODE_ENV=production` then initialize application.

!Rmb to set up systemd/ upstart so that if your app crash or server shut down you can restart the app automatically

=========================

##Config systemd service for ubuntu

Check your default system `ps -p1 | grep systemd && echo systemd || echo upstart`

Make sure you have a password set up otherwise you will have to use sudo for everything.

Go to `sudo vim /etc/ssh/sshd_config` and look for `PasswordAuthentication` change no to yes then insert `sudo passwd ubuntu`

=========================

##Create a systemd service

key in `sudo vim /lib/systemd/system/application.service`

```
[Unit]
Description=Application
 
[Service]
Type=simple
Restart=always
RestartSec=10
Environment=NODE_ENV=production
ExecStart=/usr/bin/node /home/ubuntu/application/app.js
 
[Install]
WantedBy=multi-user.target
```

Key in the 2 commands with.

`systemctl enable application.service`

`systemctl start application.service`

Check status with the below command

`system status application.service`

========================

##installing Nginx

use command `sudo apt-get install nginx`

your nginx directory should be at `/etc/nginx` for nginx executable try `which nginx` to reveal path

get nginx to reload `sudo service nginx reload` 

to get nginx start `sudo service nginx start`

at `/etc/nginx/sites-enabled/default` the file reconfigure the file to the below:

###the term `server` within `upstream nodeapp` refers to your application server which runs at `port 3000` 

###in this example because it's sitting with nginx so we use `127.0.0.1:3000`

###the `server` object now refers to the actual instance, by stating listening it would mean open port 80 (http) & 8080 (websocket/TCP);

### location tells nginx the root of the application, by using `proxy_pass` pointing to nodeapp. This is considered reverse proxy `proxy_http_version 1.1` is required for websocket to have keep-alive connection

### `map $http_upgrade $connection_upgrade` is for your websocket connection, so that server cano choose between websocket and http

### `expires 200h;` is to ensure the cache files expires after 200 hours, see below.

`
	location ~* \.(css|js|jpg|jpeg|png|gif)$ {
		expires 200h;
	}
`
###due to the fact that static assets will be behind the reverse proxy. `location ~^/static/(.*)$` will not cache all static assets within that folder `remember to change all assets src path to `/static/..`


```
upstream nodeapp {
	server 127.0.0.1:3000;
} 

 map $http_upgrade $connection_upgrade {
    default upgrade;
      ''      close;
}

server {
	listen 80;
	listen 8080;
	location / {
		proxy_pass http://nodeapp;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection $connection_upgrade;
	}

	location ~^/static/(.*)$ {
		alias /home/ubuntu/application/public/$1;
		expires 200h;
	}
}

```