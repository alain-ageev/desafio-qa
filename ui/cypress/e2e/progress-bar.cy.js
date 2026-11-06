import { ProgressBarPage } from "../pages/ProgressBarPage";

const page = new ProgressBarPage();

function valorDaBarra($barra) {
  return Number(String($barra.text()).replace(/%/g, "").trim());
}

describe("Progress Bar", () => {
  // Deck: Start, parar antes de 25%, validar valor menor ou igual a 25,
  // Start de novo e, em 100%, resetar.
  // Passa com o valor exibido <= 25 depois do stop, a barra em 100% com o botão Reset,
  // e depois do reset a barra em 0% com o botão Start.
  // Quem dispara o stop é a primeira leitura da barra, não uma espera fixa.
  // Se essa leitura já passou de 25, o caso falha.
  it("para em até 25%, chega a 100% e volta ao início", () => {
    page.visitar();
    page.iniciar();
    page.pararNaPrimeiraLeituraAte25();
    page.valorExibido().should(($barra) => {
      expect(valorDaBarra($barra)).to.be.at.most(25);
    });
    page.iniciar();
    page.aguardarCemPorCento();
    page.resetar();
    page.valorExibido().should(($barra) => {
      expect($barra.text().trim()).to.eq("0%");
    });
    page.botaoStart().should("be.visible").and("have.text", "Start");
  });
});
