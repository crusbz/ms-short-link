# Microservice Short Link And Auth

<div style="display: inline_block"><br>
  <img align="center" alt="joao-ts" height="30" width="40" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg">
  <img align="center" alt="joao-nest" height="30" width="40" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg">
  <img align="center" alt="joao-redis" height="30" width="40" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg">
  <img align="center" alt="joao-otel" height="30" width="40" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/opentelemetry/opentelemetry-original.svg">
  <img align="center" alt="joao-jaeger" height="30" width="40" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jaegertracing/jaegertracing-original.svg">
  <img align="center" alt="joao-postgres" height="30" width="40" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg">
  <img align="center" alt="joao-docker" height="30" width="40" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg">
  <img align="center" alt="joao-jest" height="30" width="40" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jest/jest-plain.svg">
    <img align="center" alt="joao-jest" height="30" width="40" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/swagger/swagger-original.svg">
  <img align="center" alt="joao-bullmq" height="30" width="40" src="https://docs.bullmq.io/~gitbook/image?url=https:%2F%2F1340146492-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F-LUuDmt_xXMfG66Rn1GA%252Ficon%252FHOq80FSJicAlE4bVptC9%252Fbull.png%3Falt=media%26token=10a2ba71-db1f-4d5c-8787-3dbedc8dd3ce&width=32&dpr=1&quality=100&sign=daffcb95d56c1300394e8d49d292dc9dcaf460947676095117dcb5d5d957239b">
</div>

## Como Usar?

Para executar a aplicação, é necessário ter o Docker instalado e configurar algumas variáveis de ambiente. Para facilitar esse processo, deixei o arquivo `.env.example`, que, ao ser renomeado, está pronto para uso. No entanto, é importante ressaltar que, em ambientes de produção, essa prática não é recomendada.

Após realizar essa configuração inicial, basta executar o seguinte comando:

```sh
docker compose up -d
```

Isso iniciará alguns containers, incluindo:

- `app`
- `auth`
- `redis`
- `jaeger`

A aplicação estará rodando em `http://localhost:3000`
Os links para acessar as documentações `http://localhost:3000/docs` `http://localhost:3001/docs`
Para acessar as métricas do Jaeger `http://localhost:16686`

O projeto utiliza o Nest.js com microservices transportados via TCP. Foi implementado encapsulamento nos domínios utilizando entidades para evitar que se tornassem anêmicas. Além disso, para contar os cliques, foi adicionada uma fila. O próprio Nest.js sugere o uso do BullMQ com Redis, facilitando a contagem para evitar perdas e gargalos. Essa contagem é feita de forma assíncrona.

Os testes unitários foram implementados com o Jest. Em relação à observabilidade, foi utilizado o OpenTelemetry integrado ao Jaeger para monitorar métricas e tempos de resposta das requisições.

Para a construção da aplicação, foi utilizado o Docker, juntamente com o Dockerfile de cada aplicação, utilizando o multistage. O Docker Compose foi utilizado para iniciar todos os serviços, exceto o PostgreSQL. Optei por utilizar uma instância em nuvem gratuita, o ElephantSQL, que é fácil de integrar.

Pontos de melhoria incluem:

- Ampliar a cobertura de testes unitários.
- Corrigir as migrações do banco de dados.
- Implementar um monorepositório para facilitar a construção.
- Adicionar validações para o usuário e criar um Controle de Acesso (ACL).
- Alterar a comunicação entre microserviços para gRPC, devido às avaliações dos protobuffers.
- Garantir a entrega dos cliques implementando acknowledged.
- Processar cliques em lotes para melhorar o desempenho em larga escala.
