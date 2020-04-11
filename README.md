# drawing

## Features

-   Real-time collaboration
-   Vector-based drawing
-   Create and share private rooms
-   Offline use of the web application, prefetching and caching of all required resources
-   Open source application, easy deployment due to containerized Backend
-   Continuous deployment to GitHub Pages

## Technologies used

This project is written in [TypeScript](https://www.typescriptlang.org/) and built with [WebPack](https://webpack.js.org/) and [Parcel](https://parceljs.org/).

### Frontend

-   User Interface rendering using [ReactJS](https://reactjs.org/)
-   Management of application state using [Redux](https://redux.js.org/) and [Redux-Saga](https://redux-saga.js.org/)

### Backend

-   Web-socket-based API using [ws](https://www.npmjs.com/package/ws)
-   Serving of static content using [Express](https://expressjs.com/)
-   [Nginx](https://nginx.org/en/) as reverse proxy

## Usage

-   Clone this repository
-   Install [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
-   Run `docker-compose up --build` inside the repository folder to start MongoDB and the application
-   Visit the website at [http://localhost:8080](http://localhost:8080)

To reduce complexity, this application does not support HTTPS out of the box. When deploying this application, you should use a reverse proxy (for example [jwilder/nginx-proxy
](https://github.com/jwilder/nginx-proxy)) to manage certificates, cipher configuration and additional security measures.

## Development

-   Clone this repository
-   Start [MongoDB](https://www.mongodb.com/)
    -   Using Docker
        -   Install [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
        -   Run `docker-compose up mongo` inside the repository folder to start MongoDB
    -   [Directly](https://www.mongodb.com/download-center/community)
-   Configure the [connection string](https://docs.mongodb.com/manual/reference/connection-string/)
    -   By default this application expects a MongoDB server at `mongodb://localhost:27017/db`
    -   This can be changed by setting the `MONGODB_CONNECTION_URI` environment variable
-   Install development dependencies: `npm install`
-   Start the development server and automated Frontend builder: `npm start`
-   Visit the local website at [http://localhost:8080](http://localhost:8080)
