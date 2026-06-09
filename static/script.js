const img = document.getElementById("neutro");
const number = document.getElementById("number");

// =========================
// VARIÁVEIS
// =========================

let tempo = 0;
let valorGrafico = 0;
let ultimoClique = 0;

// =========================
// GRÁFICO
// =========================

const ctx = document.getElementById("graficoAcao");

const grafico = new Chart(ctx, {
    type: "line",
    data: {
        labels: [0],
        datasets: [{
            label: "Economia",
            data: [0],
            borderWidth: 4,
            tension: 0.4,
            pointRadius: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,

        plugins: {
            legend: {
                display: false
            }
        },

        scales: {
            x: {
                display: false,
                grid: {
                    display: false
                }
            },
            y: {
                display: false,
                grid: {
                    display: false
                }
            }
        }
    }
});

// =========================
// CLIQUE
// =========================

async function clickar() {

    // Troca imagem
    img.src = "/static/img/rigby_crescente.png";

    setTimeout(() => {
        img.src = "/static/img/rigby_neutro.png";
    }, 250);

    // Marca o instante do clique
    ultimoClique = Date.now();

    // Envia clique para o servidor
    try {
        await fetch("/clicar", {
            method: "POST"
        });
    } catch (erro) {
        console.error("Erro ao registrar clique:", erro);
    }
}

// =========================
// ATUALIZA PLACAR
// =========================

async function atualizarPlacar() {

    try {

        const resposta = await fetch("/placar");

        const dados = await resposta.json();

        number.innerHTML = dados.pontos;

    } catch (erro) {

        console.error("Erro ao atualizar placar:", erro);

    }
}

// Atualiza o placar a cada 300ms
setInterval(atualizarPlacar, 300);

// Atualiza uma vez ao abrir a página
atualizarPlacar();

// =========================
// ATUALIZAÇÃO DO GRÁFICO
// =========================

setInterval(() => {

    tempo++;

    // Cresce somente se houve clique recente
    if (Date.now() - ultimoClique < 500) {
        valorGrafico += 1;
    }

    grafico.data.labels.push(tempo);
    grafico.data.datasets[0].data.push(valorGrafico);

    // Mantém apenas os últimos 40 pontos
    if (grafico.data.labels.length > 40) {

        grafico.data.labels.shift();
        grafico.data.datasets[0].data.shift();

    }

    grafico.update();

}, 100);