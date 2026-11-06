import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { WebTablesPage } from "../../pages/WebTablesPage";

const page = new WebTablesPage();

let registro;
let registros;

function celulas($linha) {
  return [...$linha.find("td")].slice(0, 6).map((td) => td.innerText.trim());
}

function conferirLinha(dados) {
  page.buscar(dados.email);
  page.linhas().should("have.length", 1).should(($linhas) => {
    expect(celulas($linhas)).to.deep.equal([
      dados.firstName,
      dados.lastName,
      String(dados.age),
      dados.email,
      String(dados.salary),
      dados.department,
    ]);
  });
}

Given("que a tabela web está aberta", () => {
  registro = null;
  registros = [];
  page.visitar();
});

When("crio um registro com dados da execução", () => {
  const sufixo = Date.now();
  registro = {
    firstName: "Lia",
    lastName: "Nunes",
    age: "28",
    email: `qa.${sufixo}@example.com`,
    salary: "4200",
    department: "Qualidade",
  };
  page.criar(registro);
});

Then("a busca pelo e-mail mostra os valores enviados", () => {
  conferirLinha(registro);
});

When("edito o salário e o departamento desse registro", () => {
  registro.salary = "9100";
  registro.department = "Pesquisa";
  page.editarSalarioEDepartamento(registro.email, registro.salary, registro.department);
});

Then("a mesma linha mostra os valores novos", () => {
  conferirLinha(registro);
});

When("deleto o registro", () => {
  page.deletar(registro.email);
});

Then("a busca por aquele e-mail não devolve registro", () => {
  page.buscar(registro.email);
  page.linhas().should("have.length", 0);
});

When("crio 12 registros dinâmicos", () => {
  const sufixo = Date.now();
  registros = Array.from({ length: 12 }, (_, indice) => {
    const n = indice + 1;
    return {
      firstName: `Nome${n}`,
      lastName: `Sobrenome${n}`,
      age: String(20 + n),
      email: `qa${n}.${sufixo}@example.com`,
      salary: String(3000 + n),
      department: `Depto${n}`,
    };
  });
  registros.forEach((item) => page.criar(item));
});

Then("cada um dos 12 e-mails aparece na tabela", () => {
  expect(registros, "doze registros").to.have.length(12);
  registros.forEach((item) => {
    page.buscar(item.email);
    page.linhas().should("have.length", 1).and("contain", item.email);
  });
});

When("removo os 12 registros", () => {
  registros.forEach((item) => page.deletar(item.email));
});

Then("nenhum desses e-mails permanece", () => {
  registros.forEach((item) => {
    page.buscar(item.email);
    page.linhas().should("have.length", 0);
  });
});
