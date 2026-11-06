export class BrowserWindowsPage {
  visitar() {
    cy.visit("/browser-windows");
  }

  clicarNovaJanela() {
    cy.window().then((win) => {
      cy.stub(win, "open").as("novaJanela");
    });
    cy.get("#windowButton").click();
  }

  abertura() {
    return cy.get("@novaJanela");
  }

  abrirSampleNaMesmaAba() {
    cy.visit("/sample");
  }

  mensagemDaAmostra() {
    return cy.get("#sampleHeading");
  }
}
