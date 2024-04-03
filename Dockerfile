FROM node:lts as dependencies
WORKDIR /parking-fe
COPY package.json package-lock.json ./
#RUN yarn install --frozen-lockfile
RUN yarn install 

FROM node:lts as builder
WORKDIR /parking-fe
COPY . .
COPY --from=dependencies /parking-fe/node_modules ./node_modules
RUN yarn build

FROM node:lts as runner
WORKDIR /parking-fe
ENV NODE_ENV production
# If you are using a custom next.config.js file, uncomment this line.
COPY --from=builder /parking-fe/next.config.js ./
COPY --from=builder /parking-fe/public ./public
COPY --from=builder /parking-fe/.next ./.next
COPY --from=builder /parking-fe/node_modules ./node_modules
COPY --from=builder /parking-fe/package.json ./package.json
COPY --from=builder /parking-fe/jsconfig.json ./jsconfig.json

EXPOSE 3000
CMD ["yarn", "start"]