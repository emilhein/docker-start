FROM mhart/alpine-node:8

WORKDIR /usr/app

COPY package.json .
RUN npm install --quiet

COPY . .

CMD [ "npm", "start" ]