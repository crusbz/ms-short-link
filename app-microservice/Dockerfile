FROM node:20.12.2

WORKDIR /www/app/app-microservice

COPY . .

RUN apt-get update && apt-get install

RUN npm install

RUN npm run build

EXPOSE 4010
EXPOSE 3000

CMD ["npm", "run", "start:prod"]