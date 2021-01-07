FROM node:latest

# Install system dependencies
RUN npm install -g pm2
RUN npm install -g nodemon

# App setup
WORKDIR /home/src/bot

COPY ./ ./

RUN npm install

# EXPOSE 3000

CMD [ "pm2-runtime", "npm", "--", "start" ]
