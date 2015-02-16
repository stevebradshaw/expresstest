#!/bin/bash

apt-get update

#apt-get install -y build-essentials

sudo apt-get install -y vim
sudo apt-get install -y curl
sudo apt-get install -y make

sudo apt-get install -y g++
sudo apt-get install -y git
sudo apt-get install -y build-essentials

curl -s https://gist.github.com/stevebradshaw/11dfab199e7b3c247efc/download | tar -zxf - --no-anchored --strip-components=1  --extract .vimrc

cd /tmp
wget -q http://nodejs.org/dist/v0.12.0/node-v0.12.0.tar.gz
tar zxf node-v0.12.0.tar.gz
cd node-v0.12.0/
./configure
make
sudo make install


sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install -y mongodb-org


cd /vagrant
npm install

cd /vagrant/data
# mongoexport --collection users --db test -o basedata.json
mongoimport --db test --collection users < basedata.json 
