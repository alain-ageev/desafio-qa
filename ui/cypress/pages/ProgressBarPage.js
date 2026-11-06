export class ProgressBarPage {
  visitar() {
    cy.visit("/progress-bar");
  }

  iniciar() {
    cy.contains("#startStopButton", "Start").click();
  }

  pararNaPrimeiraLeituraAte25() {
    cy.contains("#startStopButton", "Stop").should("be.visible");
    cy.get("[role='progressbar']").then(($barra) => {
      const valor = Number(String($barra.text()).replace(/%/g, "").trim());
      if (Number.isNaN(valor) || valor > 25) {
        throw new Error(`A primeira leitura já passou de 25: ${valor}`);
      }
      $barra[0].ownerDocument.getElementById("startStopButton").click();
    });
  }

  valorExibido() {
    return cy.get("[role='progressbar']");
  }

  aguardarCemPorCento() {
    cy.get("[role='progressbar']", { timeout: 20000 }).should(($barra) => {
      expect($barra.text().trim()).to.eq("100%");
    });
    cy.get("#resetButton").should("be.visible");
  }

  resetar() {
    cy.get("#resetButton").click();
  }

  botaoStart() {
    return cy.get("#startStopButton");
  }
}
