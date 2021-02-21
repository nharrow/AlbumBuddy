#!/bin/bash

echo "Cleaning up..."
rm -fR asset-manifest.json buddy.sample.json catalogue.sample.json favicon.ico index.html logo192.png logo512.png manifest.json robots.txt static/

echo "Checking if we have the source repository..."

if [ ! -d .src ]; then
    echo "Cloning from source..."
    git clone git@gh-nharrow:nharrow/AlbumBuddy.git .src
fi

cd .src

echo "Updating repository..."
git fetch

echo "Resetting to origin/trunk..."
git reset --hard origin/trunk

echo "Installing dependencies..."
npm install --prod

echo "Building..."
npm run build

echo "Syncing files..."
rsync -avz ./build/ ../

cd ..

echo "Adding files..."
git add .

echo "Committing and pushing if needed..."
git diff --quiet && git diff --staged --quiet || (git commit -m "$(date '+%Y-%m-%d %H:%M Update')" && git push -u origin release)
