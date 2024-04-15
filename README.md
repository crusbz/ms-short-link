# Microservice Short Link And Auth

Para rodar esse projeto é necessário a configuração de algumas variáveis de ambiente:

**SECRET_KEY**

**DOMAIN_URL**

**DB_URL**

**JAEGER_URL_GRPC**

**JAEGER_URL_HTTP**

Para facilitar use o arquivo .env.example como .env copiando as variáveis de ambiente.

Após já temos nossa aplicação configurada para rodar os serviços
Para isso garanta que esteje na raiz do projeto e tenha o docker instalado em sua máquina.


Comando de inicialização:
```sh
docker compose up -d
```

Após o build, alguns containers devem estart rodando
- app-microservice
- auth-microservice
- redis
- jaeger