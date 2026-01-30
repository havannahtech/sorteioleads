/***********************
 * CONFIGURAÇÃO
 ***********************/
const GOOGLE_SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbyPIULH4CIV37eL9X4Pkht4vzwleIVCTXTNUK9A9RsCHAnsZxka3oKunC3evGINtIXN/exec";

/***********************
 * COUNTDOWN
 ***********************/
const countdownEl = document.getElementById("countdown");
const dataFinal = new Date("2026-02-14T23:59:59").getTime();

setInterval(() => {
  const agora = new Date().getTime();
  const diff = dataFinal - agora;

  if (diff <= 0) {
    countdownEl.innerHTML = "SORTEIO ENCERRADO";
    return;
  }

  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diff / (1000 * 60)) % 60);
  const segundos = Math.floor((diff / 1000) % 60);

  countdownEl.innerHTML =
    `${dias}d ${horas}h ${minutos}m ${segundos}s`;
}, 1000);

/***********************
 * CEP AUTOMÁTICO
 ***********************/
const cepInput = document.getElementById("cep");
const enderecoInput = document.getElementById("endereco");

cepInput.addEventListener("blur", () => {
  const cep = cepInput.value.replace(/\D/g, "");
  if (cep.length !== 8) return;

  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(res => res.json())
    .then(data => {
      if (!data.erro) {
        enderecoInput.value =
          `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
      }
    });
});

/***********************
 * FORMULÁRIO
 ***********************/
const form = document.getElementById("leadForm");
const resultado = document.getElementById("resultado");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  resultado.innerHTML = "⏳ Enviando cadastro...";

  const beneficio = document.querySelector(
    "input[name='beneficio']:checked"
  );

  const dados = {
    nome: form.querySelector("input[placeholder='Nome completo']").value,
    whatsapp: form.querySelector("input[placeholder='WhatsApp']").value,
    cep: cepInput.value,
    numero: document.getElementById("numeroCasa").value,
    endereco: enderecoInput.value,
    beneficio: beneficio ? beneficio.parentElement.innerText.trim() : "",
    data: new Date().toLocaleString("pt-BR")
  };

  try {
    const response = await fetch(GOOGLE_SHEETS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    const json = await response.json();

    if (json.status === "ok") {
      resultado.innerHTML = `🎉 Cadastro confirmado!<br>
      Seu número da sorte: <strong>${json.numero || "Gerado"}</strong>`;
      form.reset();
    } else {
      resultado.innerHTML = "❌ Erro ao registrar. Tente novamente.";
    }

  } catch (err) {
    resultado.innerHTML = "❌ Falha de conexão.";
  }
});

/***********************
 * COMPARTILHAMENTO
 ***********************/
function compartilharWhats() {
  const texto =
    "Estou participando do sorteio da Moto Elétrica da Sagaz Motors 🔥🏍️\n\nParticipe também:";
  const url = window.location.href;
  window.open(
    `https://wa.me/?text=${encodeURIComponent(texto + " " + url)}`,
    "_blank"
  );
}

function copiarLink() {
  navigator.clipboard.writeText(window.location.href);
  alert("Link copiado!");
}
