# -----------------------------------------------------------
# Build context: backend/ directory
#   docker build -f backend/Dockerfile -t easy-learn-backend .
#   Build an image named "easy-learn-backend" using "backend/Dockerfile", with the current directory (.) as the build context
# -----------------------------------------------------------

FROM node:22.19.0
WORKDIR /app

# -----------------------------------------------------------

COPY package*.json ./

RUN npm install

COPY . .

#---------------------------------------------------------------------------
# install tzdata (Linux timezone database) to set the container timezone
RUN apt-get update \
&& apt-get install -y tzdata \
&& rm -rf /var/lib/apt/lists/*

ENV TZ=Europe/Istanbul

# -----------------------------------------------------------

ENV IS_DOCKER=true
ENV BACKEND_SERVER_PORT=3000
EXPOSE 3000

# -----------------------------------------------------------

RUN npm run build

CMD ["npm", "run", "start:prod"]