#!/bin/bash

./dependencies/dolphin/install.sh
./dependencies/execption/install.sh
./dependencies/rest-client/install.sh

./@tetras-api/node/install.sh
./@tetras-api/node/script/python/TrailCamLink/install.sh