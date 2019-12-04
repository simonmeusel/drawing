FROM alpine

RUN apk add nodejs npm
# Create app dir
WORKDIR /app
# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

RUN npm run build:prod
#binds to port 8080
EXPOSE 8080
# start the application
CMD [ "npm", "run", "start:backend" ]

