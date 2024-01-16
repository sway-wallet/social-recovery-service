ARG appPort
ARG nodeVersion
FROM node:${nodeVersion}-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json ./
COPY next.config.docker.js ./next.config.js
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder

# Create app directory
WORKDIR /app

#
# Copy the lock file and app manifest, then install
# the dependencies, including the dev dependencies
#
COPY package.json ./
COPY next.config.docker.js ./next.config.js

RUN yarn install --frozen-lockfile

COPY . .

RUN rm -rf next.config.js
COPY next.config.docker.js ./next.config.js

RUN yarn build

FROM base AS runner

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create app directory
WORKDIR /app

COPY package.json ./

RUN yarn install --production --frozen-lockfile

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/package.json .
COPY --from=builder /app/next.config.docker.js ./next.config.js
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE $appPort
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["yarn", "start"]