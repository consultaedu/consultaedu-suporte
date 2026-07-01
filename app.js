const API_URL = "https://script.google.com/macros/s/AKfycbz0ll4v-IGyc7Mq3LAxqckz4Gom3XzgKEM4XCFBVnO3sVAt34DK4vMcomXpCiTV5tFm1Q/exec";

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

  if (!confirmar) {
    return;
  }

  if (navigator.vibrate) {
    navigator.vibrate(200);
  }

  btnChamar.disabled = true;
  btnChamar.innerHTML = "<span>⏳</span> ENVIANDO...";
  msgStatus.style.color = "#64748b";
  msgStatus.textContent = "Enviando chamado para o suporte...";

  const dados = new URLSearchParams();
  dados.append("professor", professor);
  dados.append("instituicao", instituicao);
  dados.append("problema", tipoProblema);
  dados.append("observacao", textoObservacao || "Sem observação");

  fetch(API_URL, {
    method: "POST",
    mode: "no-cors",
    body: dados
  });

  const agora = new Date();
  const hora = agora.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const textoUltimo = "Hoje às " + hora;
  localStorage.setItem("ultimoChamado", textoUltimo);
  ultimoChamado.textContent = textoUltimo;

  msgStatus.style.color = "#006b3f";
  msgStatus.textContent = "Chamado enviado! Aguarde o atendimento.";

  observacao.value = "";

  setTimeout(() => {
    btnChamar.disabled = false;
    btnChamar.innerHTML = "<span>🚨</span> CHAMAR SUPORTE";
  }, 6000);
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

carregarCadastro();
