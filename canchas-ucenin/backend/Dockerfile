# backend/Dockerfile
FROM node:18

WORKDIR /app

# Copia las dependencias primero
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del código, incluido .env
COPY . .

# Expone el puerto en que corre Express
EXPOSE 5000

# Ejecuta el backend
CMD ["node", "index.js"]
