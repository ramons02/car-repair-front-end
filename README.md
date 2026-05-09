# Car Repair Frontend

Este projeto é a interface de usuário (frontend) para o sistema de gestão de oficinas mecânicas (Car Repair). Foi desenvolvido utilizando as melhores práticas e tecnologias modernas para garantir alta performance e manutenibilidade.

## Tecnologias Utilizadas

*   **Angular:** Framework principal (versão 21)
*   **TypeScript:** Tipagem estática para maior segurança e qualidade do código
*   **TailwindCSS:** Framework utilitário de CSS para estilização rápida e responsiva
*   **Vitest:** Framework de testes unitários
*   **Node.js & npm:** Ambiente de execução e gerenciador de pacotes

## Pré-requisitos

Antes de iniciar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

*   Node.js (versão 20 ou superior recomendada)
*   npm (normalmente instalado com o Node.js) ou outro gerenciador de pacotes equivalente

## Instalação

Siga os passos abaixo para clonar e preparar o ambiente de desenvolvimento local:

1.  Clone o repositório para a sua máquina local.
2.  Navegue até o diretório do projeto:
    ```bash
    cd car-repair-frontend
    ```
3.  Instale as dependências do projeto:
    ```bash
    npm install
    ```

## Servidor de Desenvolvimento

Para rodar a aplicação em ambiente de desenvolvimento, utilize o comando:

```bash
npm start
```
ou
```bash
ng serve
```

A aplicação estará disponível no seu navegador no endereço `http://localhost:4200/`. A página será recarregada automaticamente caso haja qualquer alteração no código fonte.

## Scripts Disponíveis

No arquivo `package.json`, estão configurados os seguintes scripts de atalho:

*   `npm start`: Inicia o servidor de desenvolvimento.
*   `npm run build`: Compila a aplicação para produção.
*   `npm run watch`: Compila a aplicação e assiste às mudanças, ideal para desenvolvimento contínuo.
*   `npm run test`: Executa a suíte de testes unitários utilizando o Vitest.
*   `npm run serve:ssr:car-repair-frontend`: Inicia o servidor Node para Server-Side Rendering (SSR).

## Build para Produção

Para compilar o projeto para o ambiente de produção, execute:

```bash
npm run build
```

Os artefatos gerados (arquivos estáticos otimizados) serão armazenados no diretório `dist/`. O build de produção otimiza a aplicação visando a melhor performance possível.

## Testes Unitários

Este projeto utiliza o Vitest como executor de testes unitários. Para rodar todos os testes, execute o comando:

```bash
npm run test
```

## Estrutura do Projeto

A estrutura principal do projeto segue o padrão do Angular CLI, onde a maior parte do código fonte da aplicação reside na pasta `src/`. O projeto também possui suporte inicial configurado para Server-Side Rendering (SSR).
