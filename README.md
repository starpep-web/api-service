# API - Service

This repository contains the code for the API service that communicates to the Database and exposes endpoints to interact with it.

No endpoint documentation is available yet since this API is not meant to be used publicly.

## Requirements

In order to develop for this repository you need:

* [Node.js v20.18.0](https://nodejs.org/en) (but any `v20` should work fine)
* [Docker](https://www.docker.com/products/docker-desktop/)
* Have [env-development](https://github.com/starpep-web/env-development) running locally.

## Development

First, clone this repository:

```bash
git clone https://github.com/starpep-web/api-service
```

Install the dependencies:

```bash
npm install
```

Create an `.env` file with the following contents:

```text
PORT=4000
NEO4J_DB_URI=bolt://localhost:7687
```

Run the `dev:watch` script:

```bash
npm run dev:watch
```

And done, the service should be reachable at `http://localhost:4000`.

## Testing

Some testing commands are available to you:

### `npm run type-check`

This command will run the TypeScript type checker for any compile errors.

### `npm run lint`

This command will run the linter to check for any styling errors.

### `npm run lint:fix`

This command will run the linter and fix any fixable styling errors.

### `npm run test`

This command will run unit tests once.

### `npm run test:watch`

This command will run the unit test runner in watch-mode.

## Building

If you're developing this on your local machine, consider building the Docker image with the following command:

```bash
docker build -t local-starpep/api-service:latest .
```

You can create a new container to try it out with the following command:

```bash
docker run -it --rm -p 4000:4000 -e NEO4J_DB_URI=bolt://localhost:7687 local-starpep/api-service:latest
```

And done, the service should be reachable at `http://localhost:4000`.

## Production

Consider checking this [docker-compose.yml](https://github.com/starpep-web/env-production/blob/main/docker-compose.yml) for an example on how to run this image in production.
