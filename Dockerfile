# --- Build Stage ---
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build config
COPY . .

# Set Vite build arguments
ARG VITE_API_BASE
ENV VITE_API_BASE=$VITE_API_BASE

# Build static files
RUN npm run build

# --- Production Stage ---
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
