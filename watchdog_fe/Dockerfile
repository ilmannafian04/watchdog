FROM node:alpine as builder

ENV GENERATE_SOURCEMAP=false

WORKDIR /home
COPY ./package.json ./package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /home/build /var/www
COPY --from=builder /home/nginx.conf /etc/nginx/nginx.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]
