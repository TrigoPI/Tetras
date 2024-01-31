#!/bin/bash

chmod u+x ./dependencies/dolphin/install.sh
chmod u+x ./dependencies/exception/install.sh
chmod u+x ./dependencies/rest-client/install.sh

chmod u+x ./@tetras-api/node/install.sh
chmod u+x ./@tetras-api/node/script/python/TrailCamLink/install.sh

echo "installation de dolphin..."
./dependencies/dolphin/install.sh

echo "installation de exception..."
./dependencies/exception/install.sh

echo "installation de rest-client..."
./dependencies/rest-client/install.sh

echo "installation de tetras-api..."
./@tetras-api/node/install.sh

echo "installation de TrailCamLink..."
./@tetras-api/node/script/python/TrailCamLink/install.sh