ARG KRAWLER_TAG

# 
# Make a Krawler image alias to be able to take into account the KRAWLER_TAG argument
#
FROM kalisio/krawler:${KRAWLER_TAG} AS krawler

#
# Make the job image using the krawler image alias
#
FROM node:12-buster-slim
LABEL maintainer="Kalisio <contact@kalisio.xyz>"

# Install GDAL
RUN apt-get update && apt-get -y install gdal-bin

# Copy Krawler
COPY --from=krawler /opt/krawler /opt/krawler
RUN cd /opt/krawler && yarn link && yarn link @kalisio/krawler

# Install the job
COPY jobfile.js .
COPY transform.sh .
RUN chmod +x transform.sh

# Run the job
ENV NODE_PATH=/opt/krawler/node_modules
CMD node /opt/krawler --cron "$CRON" jobfile.js

