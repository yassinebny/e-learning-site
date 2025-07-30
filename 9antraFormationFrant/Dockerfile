FROM node:18.20.8-alpine AS build
WORKDIR /app
COPY . .
RUN npm install -g @angular/cli@8.1.2 --force
RUN npm install --force
CMD ["ng","serve","--host","0.0.0.0"]
EXPOSE 4200

