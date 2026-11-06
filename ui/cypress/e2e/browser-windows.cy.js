import { BrowserWindowsPage } from "../pages/BrowserWindowsPage";

const page = new BrowserWindowsPage();

describe("Browser Windows", () => {
  // Deck: clicar em "new Windows". O botão da tela é "New Window".
  // Confirmar a página nova com "This is a sample page" e encerrar esse contexto.
  // Passa quando o clique pede /sample e essa página mostra a mensagem.
  // O Cypress observa o window.open, confere o destino e abre /sample na mesma aba.
  it("abre a amostra pela nova janela e lê a mensagem", () => {
    page.visitar();
    page.clicarNovaJanela();
    page.abertura().should("have.been.calledWithMatch", /\/sample/);
    page.abrirSampleNaMesmaAba();
    page.mensagemDaAmostra().should("be.visible").and("have.text", "This is a sample page");
  });
});
