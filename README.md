# Quill

## Website

[http://json.services](http://json.services)

## Todo

* Switch to postgresql and use "with recursive in noderepo"
* Improve logging
* add flyway db migrations  or use evolutions
* Continuous integration
* Prod/Dev/Feather build
* Mocha tests
* App tests

## Start

#### requirements

- postgres database
- java 8
- nodejs

#### configure environment set

* DB_QUILL_URL=jdbc:postgresql://localhost:quill
* DB_QUILL_USER=user
* DB_QUILL_PASSWORD=****

#### initialize database

sbt flyway/flywayMigrate

#### build frontend

cd frontend
npm install
npm publish
cd ..

#### run play 

