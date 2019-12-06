# drawing

## Development

### First possibility
-   Install [MongoDB](https://www.mongodb.com/), possibly using [Docker](https://hub.docker.com/_/mongo)
    -   The application expects a MongoDB server at `mongodb://localhost:27017/db`
    -   This can be changed by setting the `MONGODB_CONNECTION_URI` to different [connection string](https://docs.mongodb.com/manual/reference/connection-string/)
-   `npm install` dependencies
-   `npm start` the development server and the Frontend builder
-   Visit the local website at [http://localhost:8080](http://localhost:8080)

### Second possibility
-   Doing everything with [Docker](https://hub.docker.com/_/mongo)
-   Go into the root folder and make sure that the following folders and files are avaible (they should be there, if they are not then something went wrong with cloning this project)
    -   src [folder]
    -   package.json, package-lock.json, tsconfig.json, docker-compose.yml, Dockerfile [files]
-   Then go to the root folder with the Terminal or GitBash
-   `docker build .` builds the docker image
-   `docker-compose up --build` starts the application
-   Visit the local website at [http://localhost:8080](http://localhost:8080)
