FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --prefer-offline --no-audit

COPY . .

RUN npm run build || true

EXPOSE 3000

CMD ["npm", "start"]
