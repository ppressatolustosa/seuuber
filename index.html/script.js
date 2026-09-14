function calcularOrcamento() {

    // Pega os dados preenchidos pelo cliente

    const origem =
        document.getElementById("origem").value;

    const destino =
        document.getElementById("destino").value;

    const distancia =
        Number(document.getElementById("distancia").value);

    const retorno =
        document.getElementById("retorno").value;

    const fimSemana =
        document.getElementById("fimSemana").value;

    const passageiros =
        Number(document.getElementById("passageiros").value);


    // Verifica os campos obrigatórios

    if (!origem || !destino) {

        alert(
            "Informe o endereço de saída e o endereço de destino."
        );

        return;
    }


    if (!distancia || distancia <= 0) {

        alert(
            "Informe uma distância válida."
        );

        return;
    }


    // =========================
    // CALCULA DISTÂNCIA
    // =========================

    let distanciaTotal = distancia;


    // Se precisar voltar,
    // dobra a distância

    if (retorno === "sim") {

        distanciaTotal = distancia * 2;

    }


    // =========================
    // VALOR POR KM
    // =========================

    let valorPorKm;


    if (distanciaTotal <= 10) {

        valorPorKm = 3.50;

    }

    else if (distanciaTotal <= 20) {

        valorPorKm = 3.30;

    }

    else if (distanciaTotal <= 40) {

        valorPorKm = 3.10;

    }

    else if (distanciaTotal <= 60) {

        valorPorKm = 2.90;

    }

    else if (distanciaTotal <= 100) {

        valorPorKm = 2.70;

    }

    else if (distanciaTotal <= 150) {

        valorPorKm = 2.60;

    }

    else if (distanciaTotal <= 200) {

        valorPorKm = 2.50;

    }

    else {

        valorPorKm = 2.40;

    }


    // =========================
    // CALCULA VALOR
    // =========================

    let valor = distanciaTotal * valorPorKm;


    // =========================
    // FORMATA DINHEIRO
    // =========================

    const valorFormatado =
        valor.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );


    // =========================
    // MOSTRA RESULTADO
    // =========================

    const resultado =
        document.getElementById("resultado");


    resultado.innerHTML = `

        <h3>
            💰 Orçamento estimado
        </h3>

        <div class="valor-final">

            ${valorFormatado}

        </div>


        <div class="detalhes">

            <p>
                📍 ${origem}
            </p>

            <p>
                🏁 ${destino}
            </p>

            <p>
                📏 ${distanciaTotal} km
            </p>

            <p>
                👥 ${passageiros} passageiro(s)
            </p>

            <p>
                🔄 Retorno:
                ${retorno === "sim" ? "Sim" : "Não"}
            </p>

            <p>
                🗓️ Fim de semana:
                ${fimSemana === "sim" ? "Sim" : "Não"}
            </p>

        </div>


        <p class="observacao">

            * Valor estimado.
            Pedágios são cobrados separadamente.
            O valor final deve ser confirmado pelo motorista.

        </p>


        <a
            href="#"
            id="whatsappOrcamento"
            class="btn-whatsapp-orcamento"
            target="_blank"
        >

            💬 Solicitar este orçamento pelo WhatsApp

        </a>

    `;


    // =========================
    // WHATSAPP
    // =========================

    const mensagem =

        `Olá! Gostaria de solicitar um orçamento.

📍 Saída: ${origem}

🏁 Destino: ${destino}

📏 Distância: ${distanciaTotal} km

🗓️ Fim de semana: ${fimSemana === "sim" ? "Sim" : "Não"}

🔄 Retorno: ${retorno === "sim" ? "Sim" : "Não"}

👥 Passageiros: ${passageiros}

💰 Valor estimado: ${valorFormatado}`;


    const numeroWhatsApp =
        "5511964650645";


    const linkWhatsApp =

        `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;


    document
        .getElementById("whatsappOrcamento")
        .href = linkWhatsApp;

}
