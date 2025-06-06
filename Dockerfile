FROM node:20

WORKDIR /app

COPY package.json package.json

RUN yarn

COPY . .

CMD [ "yarn", "dev" ]
