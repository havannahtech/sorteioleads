const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbyPIULH4CIV37eL9X4Pkht4vzwleIVCTXTNUK9A9RsCHAnsZxka3oKunC3evGINtIXN/exec";

const cep = document.getElementById("cep");
const endereco = document.getElementById("endereco");

cep.addEventListener("blur", ()=>{
 fetch(`https://viacep.com.br/ws/${cep.value}/json/`)
 .then(r=>r.json()).then(d=>{
   if(!d.erro){
     endereco.value = `${d.logradouro}, ${d.bairro}, ${d.localidade}-${d.uf}`;
   }
 });
});

function validarCPF(cpf){
 cpf = cpf.replace(/\D/g,'');
 if(cpf.length!==11 || /(\d)\1{10}/.test(cpf)) return false;
 let s=0;for(let i=0;i<9;i++)s+=cpf[i]*(10-i);
 let r=(s*10)%11;if(r===10)r=0;if(r!=cpf[9])return false;
 s=0;for(let i=0;i<10;i++)s+=cpf[i]*(11-i);
 r=(s*10)%11;if(r===10)r=0;if(r!=cpf[10])return false;
 return true;
}

document.getElementById("leadForm").addEventListener("submit", async e=>{
 e.preventDefault();

 if(!validarCPF(cpf.value)){
   alert("CPF inválido");return;
 }

 const payload = {
   nome:nome.value,
   cpf:cpf.value.replace(/\D/g,''),
   whatsapp:whatsapp.value,
   cep:cep.value,
   numero:numeroCasa.value,
   endereco:endereco.value,
   beneficio:document.querySelector('input[name="beneficio"]:checked').parentNode.innerText.trim(),
   data:new Date().toLocaleString("pt-BR")
 };

 const res = await fetch(GOOGLE_SHEETS_URL,{
   method:"POST",
   headers:{"Content-Type":"application/json"},
   body:JSON.stringify(payload)
 });

 if(!res.ok){
   alert("Erro ao enviar");return;
 }

 const json = await res.json();
 if(json.status==="erro"){
   alert(json.mensagem);return;
 }

 resultado.innerHTML = `🎉 Cadastro confirmado!<br>Seu número da sorte é<br><strong>${json.sorteio}</strong>`;
 leadForm.reset();
});
