FROM mhart/alpine-node:8

WORKDIR /usr/app

COPY package.json .

# use nodemon for development
RUN npm install --global nodemon

RUN npm install --quiet

COPY . .

CMD ["nodemon", "-L", "/usr/app"]
