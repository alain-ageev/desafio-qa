import { SortablePage } from "../pages/SortablePage";

const page = new SortablePage();
const ordem = ["One", "Two", "Three", "Four", "Five", "Six"];

describe("Sortable", () => {
  // Deck: só a aba List. Arrastar até a ordem crescente One, Two, Three, Four, Five, Six.
  // A ordem em que a lista abre pode variar. Passa quando a lista lida termina nessa sequência.
  // O componente é react-dnd com backend HTML5 e só reordena no dragover.
  // Evento de ponteiro não move esses itens.
  it("deixa a lista em ordem crescente", () => {
    page.visitar();
    page.ordenar(ordem);
    page.itens().should(($itens) => {
      const textos = [...$itens].map((el) => el.innerText.trim());
      expect(textos).to.deep.equal(ordem);
    });
  });
});
