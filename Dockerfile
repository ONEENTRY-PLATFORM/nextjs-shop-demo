FROM node:22.11.0 as builder

ARG NEXT_PUBLIC_PROJECT_URL
ARG NEXT_PUBLIC_APP_TOKEN

ENV NODE_OPTIONS="--max-old-space-size=2048"

WORKDIR /usr/src/site

COPY ./ ./

RUN yarn

RUN yarn run build

FROM node:22.11.0

WORKDIR /opt/site

COPY --from=builder /usr/src/site/.next/ ./.next/

COPY --from=builder /usr/src/site/node_modules/ ./node_modules/

COPY package.json ./

COPY public ./public

EXPOSE 3000

ENTRYPOINT yarn start