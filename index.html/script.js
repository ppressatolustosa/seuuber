// ==========================================
// CONFIGURAÇÃO
// ==========================================

const API_URL =
  "https://seu-uber-api.ppressatolustosa.workers.dev";


// ==========================================
// CALCULAR ORÇAMENTO
// ==========================================

async function calcularOrcamento() {

  const origem =
    document
      .getElementById("origem")
      .value
      .trim();

  const destino =
    document
      .getElementById("destino")
      .value
      .trim();

  const passageiros =
    Number(
      document
        .getElementById("passageiros")
        .value
    );

  const fimSemana =
    document
      .getElementById("fimSemana")
      .value;

  const retorno =
    document
      .getElementById("retorno")
      .value;

  const resultado =
    document.getElementById("resultado");


  // ========================================
  // VALIDAÇÕES
  // ========================================

  if (!origem) {

    alert(
      "Digite o destino inicial."
    );

    return;
  }


  if (!destino) {

    alert(
      "Digite o destino final."
    );

    return;
  }


  if (
    !passageiros ||
    passageiros < 1 ||
    passageiros > 6
  ) {

    alert(
      "Informe entre 1 e 6 passageiros."
    );

    return;
  }


  // ========================================
  // MOSTRAR CARREGANDO
  // ========================================

  resultado.style.display = "block";

  resultado.innerHTML = `
    <h3>🔄 Calculando...</h3>

    <p>
      Estamos calculando a distância
      entre os endereços.
    </p>
  `;


  try {

    // ======================================
    // ENVIAR PARA CLOUDFLARE
    // ======================================

    const resposta =
      await fetch(API_URL, {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({

          origem: origem,

          destino: destino

        })

      });


    const dados =
      await resposta.json();


    // ======================================
    // VERIFICAR ERRO
    // ======================================

    if (
      !resposta.ok ||
      !dados.sucesso
    ) {

      throw new Error(
        dados.erro ||
        "Erro ao calcular rota."
      );

    }


    // ======================================
    // DISTÂNCIA
    // ======================================

    let distancia =
      Number(
        dados.distanciaKm
      );


    // ======================================
    // RETORNO
    // ======================================

    if (retorno === "sim") {

      distancia =
        distancia * 2;

    }


    // ======================================
    // PREÇO POR KM
    // ======================================

    const precoKm =
      calcularPrecoKm(
        distancia
      );


    // ======================================
    // VALOR BASE
    // ======================================

    let valor =
      distancia * precoKm;


    // ======================================
    // VALOR MÍNIMO
    // ======================================

    if (valor < 35) {

      valor = 35;

    }


    // ======================================
    // FIM DE SEMANA
    // ======================================

    if (fimSemana === "sim") {

      valor =
        valor * 1.10;

    }


    // ======================================
    // ARREDONDAMENTO
    // ======================================

    valor =
      Math.ceil(valor);


    // ======================================
    // MOSTRAR RESULTADO
    // ======================================

    resultado.innerHTML = `

      <h3>
        📋 Orçamento estimado
      </h3>

      <p>
        <strong>📍 Origem:</strong><br>
        ${escaparHTML(origem)}
      </p>

      <p>
        <strong>🏁 Destino:</strong><br>
        ${escaparHTML(destino)}
      </p>

      <p>
        <strong>📏 Distância:</strong>
        ${distancia.toFixed(1)} km
      </p>

      <p>
        <strong>⏱️ Tempo estimado:</strong>
        ${formatarTempo(
          dados.duracaoMinutos
        )}
      </p>

      <p>
        <strong>👥 Passageiros:</strong>
        ${passageiros}
      </p>

      <p>
        <strong>🔄 Retorno:</strong>
        ${
          retorno === "sim"
            ? "Sim"
            : "Não"
        }
      </p>

      <p>
        <strong>🗓️ Fim de semana:</strong>
        ${
          fimSemana === "sim"
            ? "Sim (+10%)"
            : "Não"
        }
      </p>

      <p>
        <strong>💰 Valor por km:</strong>
        R$
        ${formatarMoeda(precoKm)}
      </p>

      <div class="valor">

        R$
        ${formatarMoeda(valor)}

      </div>


      <a
        href="#"
        class="btn-whatsapp"
        id="btnWhatsApp"
      >
        💬 SOLICITAR PELO WHATSAPP
      </a>

    `;


    // ======================================
    // WHATSAPP
    // ======================================

    const telefone =
      "5511964650645";


    const mensagem = `

Olá! Gostaria de solicitar um orçamento.

📍 Origem:
${origem}

🏁 Destino:
${destino}

📏 Distância:
${distancia.toFixed(1)} km

👥 Passageiros:
${passageiros}

🔄 Retorno:
${retorno === "sim" ? "Sim" : "Não"}

🗓️ Fim de semana:
${fimSemana === "sim" ? "Sim" : "Não"}

💰 Valor estimado:
R$ ${formatarMoeda(valor)}

`;


    const whatsappURL =
      "https://wa.me/" +
      telefone +
      "?text=" +
      encodeURIComponent(
        mensagem
      );


    document
      .getElementById("btnWhatsApp")
      .href = whatsappURL;


  } catch (erro) {

    console.error(
      "Erro:",
      erro
    );


    resultado.innerHTML = `

      <h3>
        ❌ Não foi possível calcular
      </h3>

      <p>
        Confira se os endereços
        foram digitados corretamente
        e tente novamente.
      </p>

    `;

  }

}


// ==========================================
// TABELA DE PREÇOS
// ==========================================

function calcularPrecoKm(
  distancia
) {

  if (distancia <= 10) {

    return 3.50;

  }


  if (distancia <= 20) {

    return 3.30;

  }


  if (distancia <= 40) {

    return 3.10;

  }


  if (distancia <= 60) {

    return 2.90;

  }


  if (distancia <= 100) {

    return 2.70;

  }


  if (distancia <= 150) {

    return 2.60;

  }


  if (distancia <= 200) {

    return 2.50;

  }


  return 2.40;

}


// ==========================================
// FORMATAR TEMPO
// ==========================================

function formatarTempo(
  minutos
) {

  const horas =
    Math.floor(
      minutos / 60
    );


  const minutosRestantes =
    Math.round(
      minutos % 60
    );


  if (horas === 0) {

    return (
      minutosRestantes +
      " minutos"
    );

  }


  return (
    horas +
    "h " +
    minutosRestantes +
    "min"
  );

}


// ==========================================
// FORMATAR MOEDA
// ==========================================

function formatarMoeda(
  valor
) {

  return Number(valor)
    .toFixed(2)
    .replace(".", ",");

}


// ==========================================
// SEGURANÇA
// ==========================================

function escaparHTML(
  texto
) {

  const div =
    document.createElement(
      "div"
    );

  div.textContent = texto;

  return div.innerHTML;

}
