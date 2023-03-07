ARG KRAWLER_TAG

# 
# Make a Krawler image alias to be able to take into account the KRAWLER_TAG argument
#
FROM kalisio/krawler:${KRAWLER_TAG} AS krawler
LABEL maintainer="Kalisio <contact@kalisio.xyz>"

ENV CRON="0 */15 * * * *"

USER root

# Install GDAL, rclone, unzip
RUN DEBIAN_FRONTEND=noninteractive && \
  apt-get update && \
  apt-get --no-install-recommends --yes install \
  gdal-bin ca-certificates unzip rclone && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

USER node

# Copy the job and install the dependencies
COPY --chown=node:node jobfile.js transform.sh package.json yarn.lock /opt/job/
WORKDIR /opt/job
RUN chmod +x transform.sh && yarn && yarn link @kalisio/krawler && yarn cache clean

# Run the job
CMD krawler --cron "$CRON" jobfile.js
