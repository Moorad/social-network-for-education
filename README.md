## Installation

You need node.js and yarn installed

For node.js version < 16.10, install corepack. Otherwise you have it pre-installed with node

```
npm i -g corepack
```

enable corepack

```
corepack enable
```

Install packages

```
yarn install
```

You will also need to setup a mongodb server. If you are using WSL use the mongodb docker image for painless setup.

Create .env file in `packages/node-server` with

```
DB=YOUR_MONGODB_URI
SECRET_TOKEN=RANDOM_STRING_OF_CHARACTERS_FOR_USER_AUTH
PORT=THIS_IS_OPTIONAL
```

Create .env file in `packages/react-app` with

```
NEXT_PUBLIC_API_URL=URL_TO_NODE_SERVER
```

for dev purposes use "http://localhost:4000" for `NEXT_PUBLIC_API_URL` if no `PORT` env variable set

## Usage

On root project folder run

```
yarn start-server
```

Open another terminal instance, run

```
yarn start-react
```

Navigate to http://localhost:4000 (you will be directed there automatically with `yarn start-react`).
