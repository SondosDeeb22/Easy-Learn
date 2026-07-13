# ==========================
# Stage 1 - Build
# ==========================
FROM node:22-alpine AS builder

WORKDIR /app

# the varaibles are used from railways varibales 
ARG VITE_BACKEND_API_URL 
ENV VITE_BACKEND_API_URL=$VITE_BACKEND_API_URL

# Copy package files first (better Docker caching)
COPY package*.json ./

RUN npm install

# Copy the rest of the project
COPY . .


# Build the React application
RUN npm run build


# ==========================
# Stage 2 - Production
# ==========================
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy our nginx configuration
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React application
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]