ARG KRAWLER_TAG

# 
# Make a Krawler image alias to be able to take into account the KRAWLER_TAG argument
#
FROM kalisio/krawler:${KRAWLER_TAG} AS krawler
LABEL maintainer="Kalisio <contact@kalisio.xyz>"

ENV CRON="0 */15 * * * *"

USER root

# Install GDAL
RUN DEBIAN_FRONTEND=noninteractive && \
  apt-get update && \
  apt-get --no-install-recommends --yes install \
  gdal-bin ca-certificates unzip && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

# Install rclone
RUN curl -k -O https://downloads.rclone.org/rclone-current-linux-amd64.zip \
    && unzip rclone-current-linux-amd64.zip \
    && cd rclone-*-linux-amd64 \
    && cp rclone /usr/bin/ \
    && chown root:root /usr/bin/rclone \
    && chmod 755 /usr/bin/rclone 

USER node

# Copy the job and install the dependencies
COPY --chown=node:node jobfile.js transform.sh package.json yarn.lock /opt/job/
WORKDIR /opt/job
RUN chmod +x transform.sh && yarn && yarn link @kalisio/krawler && yarn cache clean

# Run the job
CMD krawler --cron "$CRON" jobfile.js
