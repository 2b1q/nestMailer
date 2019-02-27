<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

*nestMailer* is simple APP for education purpose based on [Nest](https://github.com/nestjs/nest) framework.
It has: 
- REST API with CRUD operations and JWT auth behavior to manage user and mail entities
- typeORM for Postgres DB with tables/entities relations functionality
- 2 microservices. 1st ms is core GW and 2nd is a mail fetcher   

## Project Timeline
- &#9745; docker containers for PG DB and PG admin web console
- &#9745; CRUD users entities 
- &#9745; CRUD mail entities
- &#9745; AUTH users by JWT
- &#9745; custom middleware, AuthGuard, validation pipes, ExceptionFilter, RTT LoggerInterceptor
- &#9745; TypeORM entities relations
- &#9744; mail fetcher microservice
- &#9744; RPC between microservices
- &#9744; GMAIL google API pub/sub message handler

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

  Nest is [MIT licensed](LICENSE).
