const SELETOR = ".vertical-list-container .list-group-item";

function textos($itens) {
  return [...$itens].map((el) => el.innerText.trim());
}

export class SortablePage {
  visitar() {
    cy.visit("/sortable");
    cy.get(".vertical-list-container").should("be.visible");
  }

  ordenar(desejada) {
    const cadeia = cy.wrap(null, { log: false }).then(() => {
      return this.desordenarSeJaEstiver(desejada);
    });
    return desejada.reduce(
      (atual, texto, indice) => atual.then(() => this.colocar(texto, indice)),
      cadeia
    );
  }

  itens() {
    return cy.get(SELETOR);
  }

  desordenarSeJaEstiver(desejada) {
    return cy.get(SELETOR).then(($itens) => {
      const atual = textos($itens);
      if (atual.join("|") !== desejada.join("|")) {
        return;
      }
      const ultimo = atual.length - 1;
      return this.arrastar($itens[ultimo], $itens[0], false).then(() => {
        return cy.get(SELETOR).then(($depois) => {
          const novo = textos($depois).join("|");
          if (novo === atual.join("|")) {
            throw new Error("O arraste não moveu a lista");
          }
        });
      });
    });
  }

  colocar(texto, indice) {
    return cy.get(SELETOR).then(($itens) => {
      const atual = textos($itens);
      const origem = atual.indexOf(texto);
      if (origem < 0) {
        throw new Error(`Item ${texto} não está na lista`);
      }
      if (origem === indice) {
        return;
      }
      return this.arrastar($itens[origem], $itens[indice], indice > origem);
    });
  }

  // react-dnd neste sortable escuta dragover, não o ponteiro do cypress-real-events.
  arrastar(origem, destino, descendo) {
    return cy.wrap(origem).then(($origem) => {
      const dataTransfer = new DataTransfer();
      const rect = destino.getBoundingClientRect();
      const clientX = Math.round(rect.left + rect.width / 2);
      const clientY = Math.round(rect.top + rect.height * (descendo ? 0.75 : 0.25));
      const evento = { dataTransfer, clientX, clientY, force: true };

      return cy
        .wrap($origem)
        .trigger("dragstart", evento)
        .window()
        .then((win) => new Promise((resolve) => win.setTimeout(resolve, 0)))
        .then(() => cy.wrap(destino).trigger("dragenter", evento).trigger("dragover", evento))
        .window()
        .then(
          (win) =>
            new Promise((resolve) => {
              win.requestAnimationFrame(() => win.requestAnimationFrame(resolve));
            })
        )
        .then(() => cy.wrap($origem).trigger("dragend", { dataTransfer, force: true }));
    });
  }
}
