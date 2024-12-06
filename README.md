# IFMS Password updater - Web

## Requerimentos

- NodeJS >= 22
- Npm >=10

## Desenvolvimento

### Configurar variáveis de ambiente

Copie o arquivo .env.example para .env e altere as variáveis

### Instalar as dependências:

`npm install`

### Rodar em modo de desenvolvimento com "hot-reload":

`npm run dev`

## Produção

### Instalar as dependências:

`npm install`

### Compilar para produção

`npm run build`

### Rodar em produção

`npm start`

## Docker

### Compilar imagem

`docker build -t ifms/pwd-web .`

### Rodar imagem

````
docker run --rm -p 80:80 \
-e AD_BIND_USER=dominio\usuario_admin \
-e AD_BIND_PASSWORD=senha_do_usuario_admin \
-e AD_URL=ldaps://ip_do_servidor_AD \
-e AD_BASE_DN=dc=ifms,dc=edu,dc=br \
--name ifms-pwd-web ifms/pwd-web```
````

### Parar a execução

`docker stop ifms-pwd-web`

## Docker compose

- Copie o arquivo `docker-compose.example.yml` para `docker-compose.yml`
- Edite o novo arquivo com as variáveis de ambiente corretas.

### Para rodar

`docker compose up -d`

### Para parar

`docker compose down`
