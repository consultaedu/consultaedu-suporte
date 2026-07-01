const API_URL = "https://consultaedu-api.marcosdalleprane2.workers.dev/suporte/criar";

const telaCadastro = document.getElementById("telaCadastro");
const telaPrincipal = document.getElementById("telaPrincipal");

const cadProfessor = document.getElementById("cadProfessor");
const cadInstituicao = document.getElementById("cadInstituicao");
const btnSalvarCadastro = document.getElementById("btnSalvarCadastro");
const msgCadastro = document.getElementById("msgCadastro");

const nomeProfessor = document.getElementById("nomeProfessor");
const instituicaoProfessor = document.getElementById("instituicaoProfessor");
const btnEditar = document.getElementById("btnEditar");

const problema = document.getElementById("problema");
const observacao = document.getElementById("observacao");
const btnChamar = document.getElementById("btnChamar");
const iconeBotao = document.getElementById("iconeBotao");
const textoBotao = document.getElementById("textoBotao");
const msgStatus = document.getElementById("msgStatus");
const ultimoChamado = document.getElementById("ultimoChamado");

function carregarCadastro() {
  const professorSalvo = localStorage.getItem("professor");
  const instituicaoSalva = localStorage.getItem("instituicao");

  if (professorSalvo && instituicaoSalva) {
    nomeProfessor.textContent = professorSalvo;
    instituicaoProfessor.textContent = instituicaoSalva;

    telaCadastro.classList.add("hidden");
    telaPrincipal.classList.remove("hidden");

    const ultimo = localStorage.getItem("ultimoChamado");
    if (ultimo) {
      ultimoChamado.textContent = ultimo;
    }
  } else {
    telaCadastro.classList.remove("hidden");
    telaPrincipal.classList.add("hidden");
  }
}

btnSalvarCadastro.addEventListener("click", () => {
  const professor = cadProfessor.value.trim();
  const instituicao = cadInstituicao.value;

  if (!professor || !instituicao) {
    msgCadastro.style.color = "#c62828";
    msgCadastro.textContent = "Preencha nome e instituição.";
    return;
  }

  localStorage.setItem("professor", professor);
  localStorage.setItem("instituicao", instituicao);

  msgCadastro.textContent = "";
  carregarCadastro();
});

btnEditar.addEventListener("click", () => {
  cadProfessor.value = localStorage.getItem("professor") || "";
  cadInstituicao.value = localStorage.getItem("instituicao") || "";

  telaPrincipal.classList.add("hidden");
  telaCadastro.classList.remove("hidden");
});

btnChamar.addEventListener("click", () => {
  const professor = localStorage.getItem("professor");
  const instituicao = localStorage.getItem("instituicao");
  const tipoProblema = problema.value;
  const textoObservacao = observacao.value.trim();

  const confirmar = confirm(
    "Confirmar chamado de suporte?\n\n" +
    "Professor: " + professor + "\n" +
    "Instituição: " + instituicao + "\n" +
    "Problema: " + tipoProblema
  );

  if (!confirmar) return;

  if (navigator.vibrate) {
    navigator.vibrate(200);
  }

  btnChamar.disabled = true;
  btnChamar.style.background = "linear-gradient(135deg,#9ca3af,#6b7280)";
  iconeBotao.innerHTML = '<div class="spinner"></div>';
  textoBotao.textContent = "ENVIANDO...";

  msgStatus.style.color = "#64748b";
  msgStatus.textContent = "Enviando chamado para o suporte...";

  const dados = new URLSearchParams();
  dados.append("professor", professor);
  dados.append("instituicao", instituicao);
  dados.append("problema", tipoProblema);
  dados.append("observacao", textoObservacao || "Sem observação");
  dados.append("acao", "criar_chamado");

  fetch(API_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    professor: professor,
    instituicao: instituicao,
    problema: tipoProblema,
    observacao: textoObservacao || "Sem observação"
  })
})
.then(resposta => resposta.json())
.then(resultado => {
  console.log("Chamado criado:", resultado);

  if (resultado.ok) {
    localStorage.setItem("chamadoAtualLinha", resultado.linha);
    localStorage.setItem("chamadoAtualStatus", resultado.status);
  }
});

  const agora = new Date();
  const hora = agora.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const textoUltimo = "Hoje às " + hora;
  localStorage.setItem("ultimoChamado", textoUltimo);
  ultimoChamado.textContent = textoUltimo;

  setTimeout(() => {
    iconeBotao.textContent = "✅";
    textoBotao.textContent = "CHAMADO ENVIADO";

    btnChamar.style.background =
      "linear-gradient(135deg,#0b7f4f,#18b36b)";

    msgStatus.style.color = "#0b7f4f";
    msgStatus.textContent = "Chamado enviado! Aguarde o atendimento.";

    observacao.value = "";
  }, 900);

  setTimeout(() => {
    iconeBotao.textContent = "🚨";
    textoBotao.textContent = "CHAMAR SUPORTE";

    btnChamar.style.background =
      "linear-gradient(135deg,#d93025,#ef4444)";

    btnChamar.disabled = false;
  }, 3500);
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

carregarCadastro();
