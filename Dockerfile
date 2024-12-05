FROM node:22.12.0

# Create app directory
WORKDIR /app

# Install app dependencies

COPY package*.json ./

RUN npm install

# Bundle app source

COPY . .

# Build app source
RUN npm run build

# Set environment variables
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

ENV PORT=80

EXPOSE 80

CMD [ "npm", "start" ]
