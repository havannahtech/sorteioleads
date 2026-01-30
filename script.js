const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbyPIULH4CIV37eL9X4Pkht4vzwleIVCTXTNUK9A9RsCHAnsZxka3oKunC3evGINtIXN/exec";

/* =====================
   CONTAGEM REGRESSIVA
===================== */
const alvo = new Date("2026-02-14T23:59:59").getTime();
const countdownEl = document.getElementById("countdown");

setInterval(() => {
  const agora = new Date().getTime();
  const diff = alvo - agora;

  if (diff <= 0) {
    countdownEl.innerHTML = "ENCERRADO";
    return;
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);

  countdownEl.innerHTML = `${d}d ${h}h ${m}m ${s}s`;
}, 1000);

/* =====================
   CEP AUTOMÁTICO
===================== */
const cep = document.getElementById("cep");
const endereco = document.getElementById("endereco");

cep.addEventListener("blur", () => {
  fetch(`https://viacep.com.br/ws/${cep.value}/json/`)
    .then(r => r.json())
    .then(d => {
      if (!d.erro) {
        endereco.value = `${d.logradouro}, ${d.bairro}, ${d.localidade}-${d.uf}`;
      }
    });
});

/* =====================
   VALIDA CPF
===================== */
function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += cpf[i] * (10 - i);
  let r = (soma * 10) % 11;
  if (r === 10) r = 0;
  if (r != cpf[9]) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += cpf[i] * (11 - i);
  r = (soma * 10) % 11;
  if (r === 10) r = 0;

  return r == cpf[10];
}

/* =====================
   SUBMIT FORM
===================== */
const form = document.getElementById("leadForm");
const resultado = document.getElementById("resultado");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validarCPF(cpf.value)) {
    alert("CPF inválido");
    return;
  }

  const beneficio = document.querySelector("input[name='beneficio']:checked");
  if (!beneficio) {
    alert("Escolha uma opção");
    return;
  }

  const payload = {
    nome: nome.value,
    cpf: cpf.value.replace(/\D/g, ""),
    whatsapp: whatsapp.value,
    cep: cep.value,
    numero: numeroCasa.value,
    endereco: endereco.value,
    beneficio: beneficio.parentNode.innerText.trim(),
    data: new Date().toLocaleString("pt-BR")
  };

  resultado.innerHTML = "Enviando...";

  try {
    const res = await fetch(GOOGLE_SHEETS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const json = await res.json();

    if (json.status === "erro") {
      resultado.innerHTML = json.mensagem;
      return;
    }

    resultado.innerHTML = `
      🎉 Cadastro confirmado!<br>
      Seu número da sorte é:<br>
      <strong style="font-size:28px">${json.sorteio}</strong>
    `;

    form.reset();

  } catch (err) {
    resultado.innerHTML = "Erro ao enviar. Tente novamente.";
  }
});

/* =====================
   COMPARTILHAR
===================== */
function compartilharWhats() {
  const texto = encodeURIComponent(
    "Estou participando do sorteio da Moto Elétrica da Sagaz Motors! 🚀\n\nCadastre-se aqui 👉 " + window.location.href
  );
  window.open(`https://wa.me/?text=${texto}`, "_blank");
}

function copiarLink() {
  navigator.clipboard.writeText(window.location.href);
  alert("Link copiado!");
}
