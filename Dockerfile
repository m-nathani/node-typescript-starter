FROM node:8.9.3

WORKDIR /src

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "build"]
CMD ["npm", "start"]