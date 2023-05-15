#!/bin/bash

IB_DIR=$(pwd)
EDGE_DIR=$IB_DIR/../edge-frontend
CLOUD_CONFIG_DIR=$IB_DIR/../cloud-services-config

EDGE_REPO='https://github.com/mgold1234/edge-frontend.git'
CLOUD_CONFIG_REPO='https://github.com/RedHatInsights/cloud-services-config.git'

if [ ! -d $EDGE_DIR ]
then
  cd $IB_DIR/.. && git clone $EDGE_REPO &&
  cd $EDGE_DIR && npm install
fi
if [ ! -d $CLOUD_CONFIG_DIR ]
then
  cd $IB_DIR/.. && git clone $CLOUD_CONFIG_REPO &&
  cd $CLOUD_CONFIG_DIR && mkdir -p "beta/config" && cp -R chrome "beta/config"
fi

cd $CLOUD_CONFIG_DIR && npx http-server -p 8889 &
cd $EDGE_DIR && BETA=true npm run start:federated &
cd $IB_DIR && STAGE=true npm run prod-beta