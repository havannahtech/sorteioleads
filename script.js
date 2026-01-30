let seguiuInstagram = localStorage.getItem("seguiuInstagram") === "true";
let numeroSorteio = localStorage.getItem("numeroSorteio");
let leads = JSON.parse(localStorage.getItem("leadsSagaz")) || [];

/* =========================
   FUNÇÃO VALIDA CPF REAL
========================= */
function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');

  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
}

/* =========================
   VERIFICA CPF DUPLICADO
========================= */
function cpfJaCadastrado(cpf) {
  return leads.some(l => l.cpf === cpf);
}

/* =========================
   ADMIN CSV
========================= */
if (localStorage.getItem("adminSagaz") === "true") {
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("exportarCSV").style.display = "block";
  });
}

/* =========================
   INSTAGRAM
========================= */
function marcarSeguiu() {
  localStorage.setItem("seguiuInstagram", "true");
  seguiuInstagram = true;
}

/* =========================
   CEP AUTOMÁTICO
========================= */
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

/* =========================
   SUBMIT FORM
========================= */
document.getElementById("leadForm").addEventListener("submit", e => {
  e.preventDefault();

  if (!seguiuInstagram) {
    alert("Você precisa seguir @sagazmotors no Instagram.");
    return;
  }

  const cpfLimpo = cpf.value.replace(/\D/g, '');

  if (!validarCPF(cpfLimpo)) {
    alert("CPF inválido. Verifique e tente novamente.");
    return;
  }

  if (cpfJaCadastrado(cpfLimpo)) {
    alert("Este CPF já está participando do sorteio.");
    return;
  }

  if (!numeroSorteio) {
    numeroSorteio = Math.floor(Math.random() * 20000 + 1)
      .toString()
      .padStart(5, "0");
    localStorage.setItem("numeroSorteio", numeroSorteio);
  }

  const lead = {
    nome: nome.value,
    cpf: cpfLimpo,
    whatsapp: whatsapp.value,
    cep: cep.value,
    numero: numeroCasa.value,
    endereco: endereco.value,
    beneficio: document.querySelector('input[name="beneficio"]:checked').parentNode.innerText.trim(),
    sorteio: numeroSorteio,
    data: new Date().toLocaleString("pt-BR")
  };

  leads.push(lead);
  localStorage.setItem("leadsSagaz", JSON.stringify(leads));

  resultado.innerHTML = `
    🎉 Cadastro confirmado!<br>
    Seu número da sorte é<br>
    <strong>${numeroSorteio}</strong>
  `;

  leadForm.reset();
});

/* =========================
   EXPORTAR CSV
========================= */
function exportarCSV() {
  if (leads.length === 0) {
    alert("Nenhum cadastro encontrado.");
    return;
  }

  let csv = "Nome;CPF;WhatsApp;CEP;Número;Endereço;Benefício;Número Sorteio;Data\n";

  leads.forEach(l => {
    csv += `"${l.nome}";"${l.cpf}";"${l.whatsapp}";"${l.cep}";"${l.numero}";"${l.endereco}";"${l.beneficio}";"${l.sorteio}";"${l.data}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "sorteio-sagaz-motors.csv";
  a.click();
}

/* =========================
   COMPARTILHAMENTO
========================= */
function compartilharWhats() {
  window.open(
    "https://wa.me/?text=Sorteio Sagaz Motors - participe aqui: " + location.href,
    "_blank"
  );
}

function copiarLink() {
  navigator.clipboard.writeText(location.href);
  alert("Link copiado!");
}

/* =========================
   CONTADOR REGRESSIVO
========================= */
const alvo = new Date("2026-02-14T23:59:59-03:00").getTime();

setInterval(() => {
  const d = alvo - Date.now();
  if (d <= 0) {
    countdown.innerHTML = "ENCERRADO";
    return;
  }

  countdown.innerHTML =
    Math.floor(d / 86400000) + "d " +
    Math.floor((d % 86400000) / 3600000) + "h " +
    Math.floor((d % 3600000) / 60000) + "m " +
    Math.floor((d % 60000) / 1000) + "s";
}, 1000);
