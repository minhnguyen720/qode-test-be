FROM node:22-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN npx prisma generate

RUN yarn build

EXPOSE 5000

CMD ["yarn", "start:dev"]
