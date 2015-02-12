#!/bin/bash

apt-get update

#apt-get install -y build-essentials


sudo apt-get install -y make

sudo apt-get install -y g++

cd /tmp
wget http://nodejs.org/dist/v0.12.0/node-v0.12.0.tar.gz
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