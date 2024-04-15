FROM node:20.12.2

WORKDIR /www/app/auth-microservice

COPY . .

RUN apt-get update && apt-get install

RUN npm install

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start:prod"]