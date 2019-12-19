# drawing

## Usage

-   Clone this repository
-   Install [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
-   Run `docker-compose up --build` inside the repository folder to start MongoDB and the application
-   Visit the website at [http://localhost:8080](http://localhost:8080)

To reduce complexity, this application does not support HTTPS out of the box. When deploying this application, you should use a reverse proxy (for example [jwilder/nginx-proxy
](https://github.com/jwilder/nginx-proxy)) to manage certificates and cipher configuration and additional security measures.

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
