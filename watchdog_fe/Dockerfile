FROM node:alpine as builder

WORKDIR /home
COPY ./package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /home/build /var/www
COPY --from=builder /home/nginx.conf /etc/nginx/nginx.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]
