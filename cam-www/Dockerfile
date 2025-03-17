# Use Node.js for build
FROM node:23 AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Use Nginx for serving React
FROM nginx:1.27.4-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
