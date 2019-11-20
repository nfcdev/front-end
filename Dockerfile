FROM node:10.16.3
WORKDIR /front-end
COPY package*.json ./
RUN npm install
RUN npm install -g @angular/cli
RUN npm audit fix
COPY . ./
EXPOSE 3001
CMD npm run start:ci