#
FROM nodesource/node:trusty
MAINTAINER Daniel Krech <eikeon@eikeon.com>
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get -qq update && apt-get -qqy install git
ADD . /opt/eikeon
VOLUME /home/ubuntu
RUN adduser --system --disabled-password --shell /bin/bash --uid=1000 --group eikeon
RUN chown -R eikeon:eikeon /opt/eikeon
WORKDIR /opt/eikeon
RUN npm install -g npm
RUN npm install -g bower gulp
USER eikeon
RUN bower install --config.interactive=false && npm install
EXPOSE  3000
CMD gulp
