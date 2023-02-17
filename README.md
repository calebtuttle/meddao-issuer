Issuer for Holonym <-> MedDAO integration.

## Requirements

- Node.js ^16.15.1
- Docker ^20.10.18

(Other versions might work too, but the above versions were the ones used for testing.)

## Local environment setup

### 1. Install Node dependencies

        npm install

### 2. Environment variables

#### Create .env files

Copy .env.example to .env.

        cp .env.example .env

You also need a .env.docker.dev file.

        cp .env .env.docker.dev

(We use a separate .env.docker.\<ENVIRONMENT> file for every environment we run.)

## Run

Open a terminal window, navigate to the directory of this repo, and run:

        npm run start:dev

## Test

We use mocha for tests. Run tests with:

        npm test
