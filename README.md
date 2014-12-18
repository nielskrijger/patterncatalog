[![Coverage Status](https://img.shields.io/coveralls/nielskrijger/patterncatalog.svg)](https://coveralls.io/r/nielskrijger/patterncatalog?branch=master) [![Circle CI](https://circleci.com/gh/nielskrijger/patterncatalog/tree/master.svg?style=svg)](https://circleci.com/gh/nielskrijger/patterncatalog/tree/master)

# PatternCatalog

Under development.

## Run

To start a development environment, install Docker and Fig and simply run:

    fig up

Alternatively, to run the application locally (for testing say) you can do the following:

    sudo mkdir p /data/db
    sudo docker run -d -p 127.0.0.1:27017:27017 mongo
    export MONGODB_URL=mongodb://localhost:27017/patterncatalog
    cd ./src
    node app.js
