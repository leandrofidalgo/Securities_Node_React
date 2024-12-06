# Escolha a imagem base
FROM node:18

# Crie e defina o diretório de trabalho
WORKDIR /usr/src/app

# Copie o package.json e instale as dependências
COPY package*.json ./
RUN npm install

# Copie o restante dos arquivos do projeto
COPY . .

RUN npm run build

# Exponha a porta que a aplicação vai rodar
EXPOSE 5000

# Comando para rodar a aplicação
CMD ["node", "dist/app.js"]