## DEVELOPMENT
FROM node:16-alpine as development

RUN apk add font-noto

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

CMD ["yarn", "dev"]


## TEST
FROM node:16-alpine as test

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

CMD ["yarn", "test", "--watch"]


## PRE-PRODUCTION
FROM node:16-alpine as pre-production

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build


## PRODUCTION
FROM node:16-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN apk add font-noto

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production

COPY --from=pre-production /app/dist ./dist

CMD ["yarn", "start"]