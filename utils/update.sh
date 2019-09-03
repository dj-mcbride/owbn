echo "This script is to help update app-template's functionalities after you set your remote git repo."
echo "Currently supported modules to update: pronghorn.json generator, postman collection generator.\n"
while true; do
    read -p "Do you wish to update pronghorn.json generator? (y/n)" yn
    case $yn in
        [Yy]* ) PG="yes"; break;;
        [Nn]* ) PG="no"; break;;
        * ) echo "Please answer yes or no.";;
    esac
done

while true; do
    read -p "Do you wish to update postman collection generator? (y/n)" yn
    case $yn in
        [Yy]* ) PC="yes"; break;;
        [Nn]* ) PC="no"; break;;
        * ) echo "Please answer yes or no.";;
    esac
done

if [ "$PG" == "no" ] && [ "$PC" == "no" ]; then
    echo "No part selected for update, exit"
    exit 0
fi

echo "Backing up current utils folder..."
timestamp=$(date +%s)
mkdir $timestamp
cp -R ./utils $timestamp
cp bitbucket-pipelines.yml $timestamp

if [ -d "$timestamp/utils/backup" ]; then
  rm -rf "$timestamp/utils/backup"
fi

tar -czf $timestamp.tar.gz $timestamp
rm -rf $timestamp

if [ ! -d "./utils/backup" ]; then
  mkdir "./utils/backup"
fi

mv $timestamp.tar.gz ./utils/backup/
echo "Current utils and bitbucket-pipeline file backed up at utils/backup/$timestamp.tar.gz"

git clone git@bitbucket.org:itential/app-template.git

if [ "$PG" == "yes" ]; then
    echo "updating pronghorn.json generator"
    if [ -d "utils/phJson" ]; then
        rm -rf utils/phJson
    fi
    cp -R app-template/utils/phJson utils
fi

if [ "$PC" == "yes" ]; then
    echo "updating postman collection generator and pipeline file"
    if [ -d "utils/postman" ]; then
        rm -rf utils/postman
    fi
    rm bitbucket-pipelines.yml
    cp app-template/bitbucket-pipelines.yml bitbucket-pipelines.yml
    cp -R app-template/utils/postman utils
fi

rm -rf app-template
echo "Update completed. Exiting..."