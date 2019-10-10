FROM node:10.16.3
WORKDIR /front-end
COPY package*.json ./
RUN rm -rf node_modules
RUN npm install
RUN npm install -g @angular/cli
COPY . ./
EXPOSE 3001
CMD ["npm", "start"]