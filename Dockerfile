#
FROM nodesource/node:trusty
MAINTAINER Daniel Krech <eikeon@eikeon.com>
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get -qq update && apt-get -qqy install git imagemagick graphicsmagick
WORKDIR /tmp
RUN npm install -g npm
RUN npm install -g bower gulp
WORKDIR /opt/eikeon
RUN adduser --system --disabled-password --shell /bin/bash --uid=1000 --group eikeon
RUN chown -R eikeon:eikeon /opt/eikeon
USER eikeon
ADD bower.json /opt/eikeon/
RUN bower install --config.interactive=false
ADD package.json /opt/eikeon/
RUN npm install
ADD . /opt/eikeon
EXPOSE  3000
CMD gulp
