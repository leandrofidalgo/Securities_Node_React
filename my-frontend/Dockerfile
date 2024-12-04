# Usar a imagem oficial do Node.js com TypeScript
FROM node:16-alpine

# Definir o diretório de trabalho
WORKDIR /app

# Copiar os arquivos de dependências
COPY package.json package-lock.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante do código-fonte
COPY . .

# Construir o aplicativo para produção
RUN npm run build

# Servir o app usando um servidor estático
RUN npm install -g serve
CMD ["serve", "-s", "build"]

# Expôr a porta 3000
EXPOSE 3000