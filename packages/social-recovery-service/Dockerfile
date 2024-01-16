ARG appPort
FROM node:lts-slim as builder

# Create app directory
WORKDIR /usr/src/app

RUN echo "appPort: " $appPort

#
# Copy the lock file and app manifest, then install
# the dependencies, including the dev dependencies
#
COPY package.json ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM node:lts-slim

ENV NODE_ENV production

USER node

# Create app directory
WORKDIR /usr/src/app

COPY package.json ./

RUN yarn install --production --frozen-lockfile

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE $appPort

CMD [ "node", "dist/main.js" ]