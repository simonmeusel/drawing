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

WORKDIR /app

# Install production dependencies
RUN apk add nodejs npm
COPY package*.json ./
RUN npm install --only=production

# Copy Backend source
COPY src/backend src/backend
COPY src/shared src/shared
COPY tsconfig.json ./

# Copy built Frontend
COPY --from=builder /app/dist /app/dist

CMD npm run start:backend

