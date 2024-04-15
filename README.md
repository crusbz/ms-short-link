# Microservice Short Link And Auth

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

A aplicação estar'a rodando em `http://localhost:3000`
O link para acessar a documentação é `http://localhost:3000/api`.

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
