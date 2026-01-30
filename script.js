const res = await fetch(GOOGLE_SHEETS_URL, {
  method: "POST",
  body: JSON.stringify(payload)
});

const json = await res.json();

if (json.status === "erro") {
  alert(json.mensagem);
  return;
}

resultado.innerHTML = `
🎉 Cadastro confirmado!<br>
Seu número da sorte é<br>
<strong>${json.sorteio}</strong>
`;
