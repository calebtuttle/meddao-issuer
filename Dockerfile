# TODO Multistage build?
FROM zokrates/zokrates:0.8.2 AS zokrates
FROM node:18.9.0-bullseye-slim

RUN apt-get update -y
RUN apt-get install -y python3
RUN apt-get install -y python3-pip
RUN apt-get install -y --no-install-recommends dumb-init

COPY --from=zokrates /home/zokrates /home/zokrates
ENV ZOKRATES_HOME=/home/zokrates/.zokrates
ENV PATH=/home/zokrates/.zokrates/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
ENV ZOKRATES_STDLIB=/home/zokrates/.zokrates/stdlib

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm ci --omit=dev

COPY . .

EXPOSE 3000

CMD ["dumb-init", "node", "./src/server"]
