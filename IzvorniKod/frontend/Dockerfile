FROM node:18 AS build

WORKDIR /app

COPY ./IzvorniKod/frontend/package*.json ./

RUN npm install

COPY ./IzvorniKod/frontend ./

EXPOSE 3000

CMD ["npm", "start"]
