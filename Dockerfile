FROM node:lts

# Install system dependencies
RUN npm install -g pm2

# App setup
WORKDIR /home/src/bot

COPY ./ ./

RUN npm install

CMD [ "pm2-runtime", "npm", "--", "start" ]
