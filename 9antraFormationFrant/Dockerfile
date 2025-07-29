FROM node:18.20.8-alpine AS build
WORKDIR /app
COPY package.json ./

RUN npm install --force
RUN npm install -g @angular/cli@8.1.2 --force

COPY . .
RUN ng build

FROM nginx:latest

COPY --from=build app/dist/the-bridge /usr/share/nginx/html

EXPOSE 80

