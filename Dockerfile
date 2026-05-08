# build environment
FROM node:24 AS builder
ARG ENV=PROD
ARG VITE_BACKEND_URL
ARG REACT_APP_BACKEND_URL
WORKDIR /usr/src/app
ENV PATH=/usr/src/app/node_modules/.bin:$PATH
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN BACKEND_URL="${VITE_BACKEND_URL:-$REACT_APP_BACKEND_URL}" \
    && if [ "$ENV" = "DEV" ]; then \
        VITE_BACKEND_URL="$BACKEND_URL" REACT_APP_BACKEND_URL="$BACKEND_URL" npm run build:dev; \
    else \
        VITE_BACKEND_URL="$BACKEND_URL" REACT_APP_BACKEND_URL="$BACKEND_URL" npm run build; \
    fi

# production environment
FROM nginx:alpine
RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

WORKDIR /usr/share/nginx/html

RUN mkdir -p -m 777 /logs \
    && chmod -R 777 /var/cache/nginx \
    && chmod -R 777 /usr/share/nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
