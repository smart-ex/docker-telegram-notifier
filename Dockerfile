FROM node:16-alpine as build

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package.json package-lock.json /usr/app/
RUN npm install
COPY . .
RUN npm run build

FROM node:16-alpine as prod
ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /usr/app/dist /app
COPY --from=build /usr/app/package.json /app/
COPY --from=build /usr/app/package-lock.json /app/

RUN npm install --only=production && npm cache clean --force

HEALTHCHECK CMD ["node", "app.js", "healthcheck"]
CMD ["node", "app.js"]
