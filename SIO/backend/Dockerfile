# Utiliser une image Node.js légère
FROM node:18-alpine

# Installer les dépendances système nécessaires
RUN apk add --no-cache python3 make g++

# Créer le répertoire de l'application
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le reste des fichiers de l'application
COPY . .

# Créer le volume pour la base de données SQLite
VOLUME /app/data

# Exposer le port
EXPOSE 4000

# Commande de démarrage
CMD ["node", "index.js"]
