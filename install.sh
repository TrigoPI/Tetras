#!/bin/bash

chmod u+x ./dependencies/dolphin/install.sh
chmod u+x ./dependencies/exception/install.sh
chmod u+x ./dependencies/rest-client/install.sh

chmod u+x ./@tetras-api/node/install.sh
chmod u+x ./@tetras-api/node/script/python/TrailCamLink/install.sh

echo "installation de dolphin..."
cd ./dependencies/dolphin/install.sh
./dependencies/dolphin/install.sh
cd -

echo "installation de exception..."
cd ./dependencies/exception/install.sh
./dependencies/exception/install.sh
cd -

echo "installation de rest-client..."
cd ./dependencies/rest-client/install.sh
./dependencies/rest-client/install.sh
cd -

echo "installation de tetras-api..."
cd ./@tetras-api/node/install.sh
./@tetras-api/node/install.sh
cd -

echo "installation de TrailCamLink..."
cd ./@tetras-api/node/script/python/TrailCamLink/install.sh
./@tetras-api/node/script/python/TrailCamLink/install.sh
cd -