# Stage de build
FROM node:20-alpine AS builder

WORKDIR /app

# Installer les dépendances système nécessaires
RUN apk add --no-cache libc6-compat

# Copier les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installer les dépendances
RUN npm install

# Générer le client Prisma
RUN npx prisma generate

# Copier le reste des fichiers du projet
COPY . .

# Construire l'application
RUN npm run build

# Stage de production
FROM node:20-alpine AS runner

WORKDIR /app

# Installer les dépendances système nécessaires
RUN apk add --no-cache libc6-compat

# Copier les fichiers nécessaires depuis le stage de build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Copier les dossiers nécessaires
COPY --from=builder /app/public ./public

# Créer le dossier uploads s'il n'existe pas
RUN mkdir -p /app/public/uploads && \
    chmod -R 777 /app/public/uploads

# Exposer le port
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"]