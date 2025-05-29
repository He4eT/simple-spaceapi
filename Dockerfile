FROM node:22-alpine

ENV PATH=/app/node_modules/.bin:$PATH

WORKDIR /app

COPY package*.json .
RUN npm ci --omit=dev

COPY . .
RUN npm run build

USER node

CMD ["npm", "start"]
