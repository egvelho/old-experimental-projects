#!/bin/bash

SSH_ADDRESS=$1
PROJECT_PATH=$2

if [ -z "$1" ]
  then
    echo "Usage: npm run deploy -- [host@address] [path/to/file]"
    exit
fi

if [ -z "$2" ]
  then
    echo "Usage: npm run deploy -- host@address path/to/file"
    exit
fi

SSH_COMMAND="
cd $PROJECT_PATH &&
git pull &&
pm2 stop all &&
npm install --production --no-save &&
mkdir -p .next &&
mv .next .old-next &&
mv .temp-next .next &&
mv public .old-public &&
mv .temp-public public &&
pm2 start all &&
rm -rf .old-next .old-public" &&

source .env &&

if [ -f .next ]; then
   mv .next .temp-dev-next
fi

mv public .temp-dev-public &&
mkdir public &&

npm run generate-assets &&
npm run load-firebase &&
npm run build &&

mv .next .temp-next &&
mv public .temp-public &&
scp -r .temp-next $SSH_ADDRESS:$PROJECT_PATH &&
scp -r .temp-public $SSH_ADDRESS:$PROJECT_PATH &&

ssh -t $SSH_ADDRESS $SSH_COMMAND &&
rm -rf .temp-next &&
rm -rf .temp-public &&
mv .temp-dev-public public

if [ -f .temp-dev-next ]; then
   mv .temp-dev-next .next
fi