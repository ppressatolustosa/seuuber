// ==========================================
// CONFIGURAÇÃO DO CLOUDFLARE WORKER
// ==========================================

const API_URL =
  "https://seu-uber-api.ppressatolustosa.workers.dev";


// ==========================================
// CALCULAR ORÇAMENTO
// ==========================================

async function calcularOrcamento() {

  // ----------------------------------------
  // PEGAR INFORMAÇÕES DO FORMULÁRIO
  // ----------------------------------------

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
    document
      .getElementById("resultado");


  // ----------------------------------------
  // VERIFICAR ORIGEM
  // ----------------------------------------

  if (!origem) {

    resultado.style.display = "block";

    resultado.innerHTML = `
      <h3>⚠️ Informe o destino inicial</h3>
    `;

    return;

  }


  // ----------------------------------------
  // VERIFICAR DESTINO
  // ----------------------------------------

  if (!destino) {

    resultado.style.display = "block";

    resultado.innerHTML = `
      <h3>⚠️ Informe o destino final</h3>
    `;

    return;

  }


  // ----------------------------------------
  // VERIFICAR PASSAGEIROS
  // ----------------------------------------

  if (
    passageiros < 1 ||
    passageiros > 6
  ) {

    resultado.style.display = "block";

    resultado.innerHTML = `
      <h3>⚠️ Informe entre 1 e 6 passageiros</h3>
    `;

    return;

  }


  // ----------------------------------------
  // MOSTRAR CARREGANDO
  // ----------------------------------------

  resultado.style.display = "block";

  resultado.innerHTML = `

    <h3>
      🔄 Calculando rota...
    </h3>

    <p>
      Estamos calculando a distância
      entre os endereços.
    </p>

  `;


  try {

    // ======================================
    // ENVIAR PARA O CLOUDFLARE
    // ======================================

    console.log(
      "Enviando para:",
      API_URL
    );


    console.log(
      "Origem:",
      origem
    );


    console.log(
      "Destino:",
      destino
    );


    const resposta =
      await fetch(
        API_URL,
        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json"

          },

          body:
            JSON.stringify({

              origem:
                origem,

              destino:
                destino

            })

        }
      );


    // ======================================
    // LER RESPOSTA
    // ======================================

    const texto =
      await resposta.text();


    console.log(
      "Status do Worker:",
      resposta.status
    );


    console.log(
      "Resposta do Worker:",
      texto
    );


    // ======================================
    // TRANSFORMAR EM JSON
    // ======================================

    let dados;


    try {

      dados =
        JSON.parse(texto);

    }

    catch (erro) {

      throw new Error(
        "O Worker não retornou uma resposta válida."
      );

    }


    // ======================================
    // VERIFICAR ERRO HTTP
    // ======================================

    if (!resposta.ok) {

      throw new Error(

        dados.erro ||

        dados.detalhe ||

        `Erro HTTP ${resposta.status}`

      );

    }


    // ======================================
    // VERIFICAR SUCESSO
    // ======================================

    if (!dados.sucesso) {

      throw new Error(

        dados.erro ||

        "A rota não foi calculada."

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

    if (
      retorno === "sim"
    ) {

      distancia =
        distancia * 2;

    }


    // ======================================
    // CALCULAR PREÇO POR KM
    // ======================================

    let precoKm =
      calcularPrecoKm(
        distancia
      );


    // ======================================
    // CALCULAR VALOR
    // ======================================

    let valor =
      distancia * precoKm;


    // ======================================
    // VALOR MÍNIMO
    // ======================================

    if (
      valor < 35
    ) {

      valor = 35;

    }


    // ======================================
    // ADICIONAL FIM DE SEMANA
    // ======================================

    if (
      fimSemana === "sim"
    ) {

      valor =
        valor * 1.10;

    }


    // ======================================
    // ARREDONDAR VALOR
    // ======================================

    valor =
      Math.ceil(valor);


    // ======================================
    // MOSTRAR RESULTADO
    // ======================================

    resultado.innerHTML = `

      <h3>
        ✅ Orçamento estimado
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

        ${formatarMoeda(
          precoKm
        )}

      </p>


      <div class="valor">

        R$
        ${formatarMoeda(valor)}

      </div>


      <a
        href="#"
        class="btn-whatsapp"
        id="btnWhatsApp"
        target="_blank"
      >

        💬 SOLICITAR PELO WHATSAPP

      </a>

    `;


    // ======================================
    // WHATSAPP
    // ======================================

    const telefone =
      "5511964650645";


    const mensagem =

      `Olá! Gostaria de solicitar um orçamento.%0A%0A` +

      `📍 Origem:%0A` +
      `${origem}%0A%0A` +

      `🏁 Destino:%0A` +
      `${destino}%0A%0A` +

      `📏 Distância:%0A` +
      `${distancia.toFixed(1)} km%0A%0A` +

      `👥 Passageiros:%0A` +
      `${passageiros}%0A%0A` +

      `🔄 Retorno:%0A` +
      `${
        retorno === "sim"
          ? "Sim"
          : "Não"
      }%0A%0A` +

      `🗓️ Fim de semana:%0A` +
      `${
        fimSemana === "sim"
          ? "Sim"
          : "Não"
      }%0A%0A` +

      `💰 Valor estimado:%0A` +
      `R$ ${formatarMoeda(valor)}`;


    const whatsappURL =
      "https://wa.me/" +
      telefone +
      "?text=" +
      mensagem;


    document
      .getElementById("btnWhatsApp")
      .href =
      whatsappURL;


  }

  catch (erro) {

    console.error(
      "ERRO COMPLETO:",
      erro
    );


    // ====================================
    // MOSTRAR ERRO REAL
    // ====================================

    resultado.innerHTML = `

      <h3>
        ❌ Não foi possível calcular
      </h3>


      <p>
        <strong>Erro:</strong>
      </p>


      <p>
        ${escaparHTML(
          erro.message
        )}
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

  if (
    distancia <= 10
  ) {

    return 3.50;

  }


  if (
    distancia <= 20
  ) {

    return 3.30;

  }


  if (
    distancia <= 40
  ) {

    return 3.10;

  }


  if (
    distancia <= 60
  ) {

    return 2.90;

  }


  if (
    distancia <= 100
  ) {

    return 2.70;

  }


  if (
    distancia <= 150
  ) {

    return 2.60;

  }


  if (
    distancia <= 200
  ) {

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


  if (
    horas === 0
  ) {

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

  return Number(
    valor
  )
    .toFixed(2)
    .replace(
      ".",
      ","
    );

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


  div.textContent =
    texto;


  return div.innerHTML;

}
