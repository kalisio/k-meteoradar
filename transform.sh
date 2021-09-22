#!/bin/sh

# https://gis.stackexchange.com/questions/387111/is-it-possible-to-figure-out-the-projection-used-in-a-map

PNG_FILE=$1
TIF_FILE=$2

# -multi -wo NUM_THREADS=ALL_CPUS -> multithread reproject
# -co COMPRESS=DEFLATE -co NUM_THREADS=ALL_CPUS -> deflate compression + multithread compression
# -co TILED=YES -co BLOCKXSIZE=512 -co BLOCKYSIZE=512 -co COPY_SRC_OVERVIEWS=YES -> cloud optimized generation options

# https://gdal.org/drivers/raster/gtiff.html
# https://gdal.org/drivers/raster/cog.html
# https://gdal.org/programs/gdalwarp.html
# https://gdal.org/programs/gdal_translate.html
# https://gdal.org/programs/gdaladdo.html
# https://github.com/cogeotiff/cog-spec/blob/master/spec.md

#-8.56112814973406671 54.0313919517155261 12.4514144028276711 39.4677959434222174 \

# png to geotiff with proper georeferencing
gdal_translate \
  -a_srs "+title=thomas +proj=stere +lat_0=90 +lat_ts=45 +lon_0=0 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs" \
  -a_ullr -619652.074 -3526818.338 916347.926 -5062818.338 \
  -a_nodata 0 \
  -of GTiff -co TILED=YES -co BLOCKXSIZE=512 -co BLOCKYSIZE=512 -co COPY_SRC_OVERVIEWS=YES \
  ${PNG_FILE} ${TIF_FILE}.tmp

# project to 4326
gdalwarp \
  -overwrite \
  -t_srs EPSG:4326 \
  -of GTiff -co TILED=YES -co BLOCKXSIZE=512 -co BLOCKYSIZE=512 -co COPY_SRC_OVERVIEWS=YES \
  -co COMPRESS=DEFLATE \
  ${TIF_FILE}.tmp ${TIF_FILE}

rm ${TIF_FILE}.tmp
