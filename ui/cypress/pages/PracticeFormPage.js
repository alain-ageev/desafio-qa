export class PracticeFormPage {
  visitar() {
    cy.visit("/automation-practice-form");
  }

  preencher(dados) {
    cy.get("#firstName").type(dados.firstName);
    cy.get("#lastName").type(dados.lastName);
    cy.get("#userEmail").type(dados.email);
    cy.contains("#genterWrapper label", dados.gender).click();
    cy.get("#userNumber").type(dados.mobile);
    this.escolherDataValida();
    cy.get("#subjectsInput").type(dados.subject);
    cy.get(".subjects-auto-complete__option").contains(dados.subject).click();
    cy.contains("#hobbiesWrapper label", dados.hobby).click();
    this.anexarArquivo();
    cy.get("#currentAddress").type(dados.address);
    this.escolherEstadoECidade(dados.state, dados.city);
  }

  anexarArquivo() {
    cy.get("#uploadPicture").selectFile(
      "cypress/fixtures/upload/arquivo-upload.txt"
    );
  }

  submeter() {
    cy.get("#submit").scrollIntoView().click();
  }

  tituloDoModal() {
    return cy.get("#example-modal-sizes-title-lg");
  }

  fecharModal() {
    cy.get("#closeLargeModal").click();
    // O onClick do site chama ReactDOM.findDOMNode, removido neste build, e o
    // modal não fecha. Escape aciona o onHide do próprio modal.
    cy.get("body").then(($body) => {
      if ($body.find("#example-modal-sizes-title-lg:visible").length) {
        cy.get("body").type("{esc}");
      }
    });
  }

  escolherDataValida() {
    cy.get("#dateOfBirthInput").click();
    cy.get(".react-datepicker__month-select").then(($select) => {
      const meses = [...$select[0].options].map((opcao) => opcao.value);
      const mes = meses[Math.floor(Math.random() * meses.length)];
      cy.get(".react-datepicker__month-select").select(mes);
    });
    cy.get(".react-datepicker__year-select").then(($select) => {
      const anos = [...$select[0].options].map((opcao) => opcao.value);
      const ano = anos[Math.floor(Math.random() * anos.length)];
      cy.get(".react-datepicker__year-select").select(ano);
    });
    const dia = String(1 + Math.floor(Math.random() * 28));
    cy.get(".react-datepicker__day")
      .not(".react-datepicker__day--outside-month")
      .filter((_, el) => el.innerText.trim() === dia)
      .first()
      .click();
  }

  escolherEstadoECidade(estado, cidade) {
    const campos = () => cy.get("#stateCity-wrapper").find("input");
    campos().eq(0).type(`${estado}{enter}`, { force: true });
    campos().eq(1).should("be.enabled").type(`${cidade}{enter}`, { force: true });
  }
}
