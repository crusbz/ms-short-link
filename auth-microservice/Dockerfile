# Estágio de construção
FROM node:20.12.2 AS build

# Atualização de pacotes
RUN apt-get update && apt-get install

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia os arquivos de configuração e de dependências
COPY ./package.json ./package-lock.json ./

# Instala as dependências
RUN npm install

# Copia o código-fonte da aplicação
COPY . .

# Constrói a aplicação
RUN npm run build

# Estágio final
FROM node:20.12.2

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia os arquivos de construção da etapa anterior
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules

# Expõe a porta da aplicação
EXPOSE 4000

# Comando de inicialização da aplicação
CMD ["node", "dist/main"]