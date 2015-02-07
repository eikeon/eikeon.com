#!/bin/bash

sudo service eikeon stop
sudo docker rm -f eikeon.com
sudo docker tag -f eikeon/eikeon.com:dev eikeon/eikeon.com:prod
sudo docker rmi eikeon/eikeon.com:dev
sudo docker create --name="eikeon.com" -p 3001:3000 -t eikeon/eikeon.com:prod
sudo service eikeon start
