# weight-recorder-app

A web application to keep track of your weight.

## technology

- HTML5
- SCSS
- JavaScript
- NodeJS
- Express
- NeDB
- Deployed in [Heroku](https://weight-recording-app.herokuapp.com/)

> This project was made as an introduciton to backend servers, databases, and web-app deployment.
> Version 1.0 | August, 2022

## _IMPORTANT NOTE_

the database used in this web application is NeDB and the hosting is heroku which is an _ephemerical file system_. therefore, the database is refreshed **back to 0 once every 24hrs**. with that being said, using this web application 'online' is **not really effective** as the users' data will be gone daily. i would rewrite this soon in mongoDB probably so it will be usable online, but for now, it is only effective once downloaded.

clone the repository

> cd weight-recording-app <br/>
> npm i <br/>
> nodemon server <br/>
> open http://localhost:3000/ <br/>

use the app as intended, the database will be written locally therefore saving your data in your local computer.
