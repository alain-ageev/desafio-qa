export class WebTablesPage {
  visitar() {
    cy.visit("/webtables");
  }

  criar(dados) {
    cy.get("#addNewRecordButton").click();
    cy.get("#registration-form-modal").should("be.visible");
    cy.get("#firstName").should("be.visible").type(dados.firstName);
    cy.get("#lastName").type(dados.lastName);
    cy.get("#userEmail").type(dados.email);
    cy.get("#age").type(String(dados.age));
    cy.get("#salary").type(String(dados.salary));
    cy.get("#department").type(dados.department);
    cy.get("#submit").click();
    cy.get("#registration-form-modal").should("not.exist");
  }

  buscar(email) {
    cy.get("#searchBox").clear().type(email).should("have.value", email);
  }

  linhas() {
    return cy.get(".web-tables-wrapper tbody").find("tr");
  }

  editarSalarioEDepartamento(email, salario, departamento) {
    this.buscar(email);
    this.linhas().should("have.length", 1).find("span[title='Edit']").click();
    cy.get("#salary").should("be.visible").clear().type(String(salario));
    cy.get("#department").clear().type(departamento);
    cy.get("#submit").click();
    cy.get("#registration-form-modal").should("not.exist");
  }

  deletar(email) {
    this.buscar(email);
    cy.get(".web-tables-wrapper tbody").then(($tbody) => {
      const linha = $tbody.find("tr");
      if (!linha.length) {
        return;
      }
      cy.wrap(linha[0]).find("span[title='Delete']").click();
    });
  }
}
