import { PracticeFormPage } from "../pages/PracticeFormPage";

const page = new PracticeFormPage();

function letras(quantidade) {
  const alfabeto = "abcdefghijklmnopqrstuvwxyz";
  return Array.from(
    { length: quantidade },
    () => alfabeto[Math.floor(Math.random() * alfabeto.length)]
  ).join("");
}

function dadosAleatorios() {
  const generos = ["Male", "Female", "Other"];
  const hobbies = ["Sports", "Reading", "Music"];
  return {
    firstName: letras(6),
    lastName: letras(8),
    email: `qa.${Date.now()}.${letras(4)}@example.com`,
    gender: generos[Math.floor(Math.random() * generos.length)],
    mobile: String(Math.floor(1000000000 + Math.random() * 9000000000)),
    address: `${letras(8)} ${letras(6)}`,
    subject: "Maths",
    hobby: hobbies[Math.floor(Math.random() * hobbies.length)],
    state: "NCR",
    city: "Delhi",
  };
}

describe("Practice Form", () => {
  // Deck: preencher o formulário inteiro com valores aleatórios, anexar um .txt
  // versionado, submeter, ver o popup e fechá-lo. O conteúdo linha a linha fica de fora.
  // Passa com o título "Thanks for submitting the form" visível e, depois, fora da página.
  // No site, o clique em Close chama findDOMNode, que não existe neste build, e o modal
  // permanece. O page object envia Escape em seguida: é o onHide do próprio modal que fecha.
  it("envia o formulário e fecha o popup", () => {
    page.visitar();
    page.preencher(dadosAleatorios());
    page.submeter();
    page
      .tituloDoModal()
      .should("be.visible")
      .and("have.text", "Thanks for submitting the form");
    page.fecharModal();
    page.tituloDoModal().should("not.exist");
  });
});
