FROM node:22-alpine
# RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
ENV PATH=/app/node_modules/.bin:$PATH

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY . .

RUN chown -R node:node /app
USER node
RUN npm run build

EXPOSE 1337
CMD ["npm", "run", "start"]
