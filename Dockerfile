FROM node:18-alpine3.18

EXPOSE 8080

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY . .

RUN npm run build
CMD ["npm", "run", "start"]