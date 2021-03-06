# ExpressTest

node.js & mongodb environment using Vagrant

Vagrantfile providing an ubuntu 12.04 LTS development environment for node.js and mongodb with a sample node.js RESTful web service demo.

Provisioning script 'bootstrap.js' installs node.js, mongodb and a few useful command line tools (curl, vim, etc).  Once the provisioning script is complete, it useds the node package manager 'npm' to install the necessary node packages.

Port 8080 on the host is set to be forwarded to port 3000 on the guest, which is the port used in the node.js application.

You need to install:

* Vagrant - https://www.vagrantup.com/
* VirtualBox - https://www.virtualbox.org/

Once these are installed, clone the git repository into a directory on your machine, open a command line and navigate to the project directory and issue 

`$ vagrant up`

to build the environment. When the VM is running, connect to it with

`$ vagrant ssh`

from within the directory containing the Vagrantfile.

Once connectedi to the guest, start the application by

`$ cd /vagrant`
`$ node server.js`

You can then interact with the RESTful webservice from the host machine with:

`$ curl -X OPTIONS http://localhost:8080/user`

