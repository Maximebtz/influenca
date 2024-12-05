# Stage de build
FROM node:20-alpine AS builder

WORKDIR /app

# Installer les dépendances système nécessaires
RUN apk add --no-cache libc6-compat openssl1.1-compat

# Copier les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installer uniquement les dépendances de production et générer Prisma
RUN npm ci --omit=dev
RUN npx prisma generate

# Copier le reste des fichiers et construire l'application
COPY . .
RUN npm run build

# Stage de production
FROM node:20-alpine AS runner

WORKDIR /app

# Installer les dépendances système nécessaires
RUN apk add --no-cache libc6-compat openssl1.1-compat

# Copier les fichiers nécessaires depuis le stage de build
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Créer le dossier uploads et définir les permissions
RUN mkdir -p /app/public/uploads && chmod 777 /app/public/uploads

# Définir l'environnement de production
ENV NODE_ENV=production

# Exposer le port
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"]