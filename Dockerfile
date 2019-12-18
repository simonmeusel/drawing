FROM alpine as builder

WORKDIR /app

# Install build dependencies
RUN apk add nodejs npm
COPY package*.json ./
RUN npm install

# Build application
COPY . ./
RUN npm run build:prod

FROM alpine

RUN apk add nodejs npm shadow

RUN useradd --create-home --home /app drawing

WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm install --only=production
RUN rm package*.json

# Copy built Frontend
COPY --from=builder /app/dist dist

USER drawing

CMD node dist/backend/index.js

