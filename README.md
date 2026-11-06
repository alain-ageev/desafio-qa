# Desafio QA

Da raiz deste diretório, com JDK 17, Maven, Node LTS e Chrome:

```bash
cd api && mvn test
cd ui && npm ci && npx cypress run --browser chrome
```

Um fluxo de tela, ou só as tabelas:

```bash
cd ui && npx cypress run --browser chrome --spec cypress/e2e/practice-form.cy.js
cd ui && npx cypress run --browser chrome --spec cypress/e2e/web-tables.feature
```
