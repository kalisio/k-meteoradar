ARG KRAWLER_TAG

# 
# Make a Krawler image alias to be able to take into account the KRAWLER_TAG argument
#
FROM kalisio/krawler:${KRAWLER_TAG} AS krawler

#
# Make the job image using the krawler image alias
#
FROM node:16-buster-slim
LABEL maintainer="Kalisio <contact@kalisio.xyz>"

ENV CRON="0 */15 * * * *"

# Install GDAL
RUN apt-get update && apt-get -y install gdal-bin

# Copy Krawler
COPY --from=krawler /opt/krawler /opt/krawler
WORKDIR /opt/krawler
RUN yarn link
# Required as yarn does not seem to set it correctly
RUN chmod u+x /usr/local/bin/krawler

# Copy the job and install the dependencies
COPY jobfile.js transform.sh package.json yarn.lock /opt/job/
WORKDIR /opt/job
RUN chmod +x transform.sh && yarn && yarn link @kalisio/krawler

# Run the job
CMD krawler --cron "$CRON" jobfile.js
