let seguiuInstagram = localStorage.getItem("seguiuInstagram") === "true";
let numeroSorteio = localStorage.getItem("numeroSorteio");

function marcarSeguiu(){
  localStorage.setItem("seguiuInstagram","true");
  seguiuInstagram = true;
}

// CEP automático
const cep = document.getElementById("cep");
const endereco = document.getElementById("endereco");

cep.addEventListener("blur",()=>{
  fetch(`https://viacep.com.br/ws/${cep.value}/json/`)
    .then(r=>r.json())
    .then(d=>{
      endereco.value = `${d.logradouro}, ${d.bairro}, ${d.localidade}-${d.uf}`;
    });
});

// Submit
document.getElementById("leadForm").addEventListener("submit",e=>{
  e.preventDefault();

  if(!seguiuInstagram){
    alert("⚠️ Para participar do sorteio, siga @sagazmotors no Instagram.");
    return;
  }

  if(!numeroSorteio){
    numeroSorteio = Math.floor(Math.random()*20000+1)
      .toString().padStart(5,"0");
    localStorage.setItem("numeroSorteio",numeroSorteio);
  }

  document.getElementById("resultado").innerHTML =
    `🎉 Seu número da sorte é<br><strong>${numeroSorteio}</strong>`;
});

// Compartilhar
function compartilharWhats(){
  const texto = encodeURIComponent(
    "🔥 Sorteio Moto Elétrica Sagaz Motors!\nParticipe agora:\n"+location.href
  );
  window.open("https://wa.me/?text="+texto,"_blank");
}

function copiarLink(){
  navigator.clipboard.writeText(location.href);
  alert("Link copiado!");
}

// Contador regressivo
const countdownEl = document.getElementById("countdown");
const sorteioData = new Date("2026-02-14T23:59:59-03:00").getTime();

setInterval(()=>{
  const agora = new Date().getTime();
  const diff = sorteioData - agora;

  if(diff <= 0){
    countdownEl.innerHTML = "SORTEIO ENCERRADO";
    return;
  }

  const d = Math.floor(diff/(1000*60*60*24));
  const h = Math.floor((diff%(1000*60*60*24))/(1000*60*60));
  const m = Math.floor((diff%(1000*60*60))/(1000*60));
  const s = Math.floor((diff%(1000*60))/1000);

  countdownEl.innerHTML = `${d}d ${h}h ${m}m ${s}s`;
},1000);
