FROM node:10.16.3
WORKDIR /front-end
COPY package*.json /front-end/
RUN npm install
COPY . /front-end/
EXPOSE 3001
CMD ["npm", "start"]