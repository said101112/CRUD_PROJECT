FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

# Vite requires the --host flag to expose the server to the Docker network
CMD ["npm", "run", "dev", "--", "--host"]
