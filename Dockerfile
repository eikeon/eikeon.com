#
FROM iojs:latest
MAINTAINER Daniel Krech <eikeon@eikeon.com>
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get -qq update && apt-get -qqy install git imagemagick graphicsmagick && apt-get clean
RUN npm install -g bower gulp npm-check-updates && npm cache clear
#
RUN adduser --system --disabled-password --shell /bin/bash --group eikeon --uid 1000
RUN mkdir -p /home/eikeon && chown -R eikeon:eikeon /home/eikeon
WORKDIR /opt/eikeon
RUN chown -R eikeon:eikeon /opt/eikeon
USER eikeon
COPY bower.json /opt/eikeon/
RUN bower install --config.interactive=false
COPY package.json /opt/eikeon/
RUN npm install
COPY . /opt/eikeon
USER root
RUN chown -R eikeon:eikeon /opt/eikeon
USER eikeon
RUN gulp
EXPOSE  3000
CMD npm start
