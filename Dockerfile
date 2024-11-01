FROM node:20.18.0-alpine AS base

FROM base AS deps

WORKDIR /tmp/app

COPY package*.json ./
RUN npm ci

FROM base AS build

ENV NODE_ENV=production
WORKDIR /tmp/app

COPY --from=deps /tmp/app/node_modules ./node_modules
COPY . .
RUN npm run build:prod

FROM base AS runner

RUN adduser -D starpep-api-service
USER starpep-api-service

WORKDIR /opt/app

COPY --from=build --chown=starpep-api-service /tmp/app .

ENV PORT=4000
EXPOSE 4000

CMD ["node", "./build/index.js"]
