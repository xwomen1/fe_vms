FROM node:18-alpine3.19 as dependencies
WORKDIR /access-fe
COPY package.json ./
#RUN yarn install --frozen-lockfile
RUN yarn install 

FROM node:18-alpine3.19 as builder
WORKDIR /access-fe
COPY . .
COPY --from=dependencies /access-fe/node_modules ./node_modules
RUN yarn build

FROM node:18-alpine3.19 as runner
WORKDIR /access-fe
ENV NODE_ENV production
# If you are using a custom next.config.js file, uncomment this line.
COPY --from=builder /access-fe/next.config.js ./
COPY --from=builder /access-fe/public ./public
COPY --from=builder /access-fe/.next ./.next
COPY --from=builder /access-fe/node_modules ./node_modules
COPY --from=builder /access-fe/package.json ./package.json
COPY --from=builder /access-fe/jsconfig.json ./jsconfig.json

EXPOSE 3000
CMD ["yarn", "start"]
