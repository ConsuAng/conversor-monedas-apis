const apiUrl = "https://mindicador.cl/api";
const options = document.querySelector("#coinsOptions");
const button = document.querySelector("#searchButton");
let html = "";
let filteredCoins = [];
let chart;

const getCoins = async () => {
  try {
    const res = await fetch(apiUrl);
    const coins = await res.json();
    return coins;
  } catch (error) {
    alert(error.message);
  }
}

const getCoinsData = async (codigo) => {
  try {
    const response = await fetch(`https://mindicador.cl/api/${codigo}`)
    const serialData = await response.json();

    const fechas = serialData.serie.map((data) => {
      const fecha = new Date(data.fecha);
      return fecha.toLocaleDateString();
    });

    const fechasReverse = fechas.reverse();

    const data = serialData.serie.map((data) => {
      return data.valor;
    });

    const dataReverse = data.reverse();

    const datasets = [
      {
        label: `${codigo}`,
        borderColor: "rgb(255, 99, 132)",
        data: dataReverse
      }
    ];

    if(chart) {
      chart.destroy();
    }
    return { labels: fechasReverse, datasets };
  } catch (error) {
    alert(error.message);
  }
}

const renderCoins = async () => {
  const data = await getCoins();
  const dataValues = Object.values(data);
  const dataValuesArray = [];

  for(index in dataValues) {
    dataValuesArray.push(dataValues[index]);
  }
  const onlyIndicators = dataValuesArray.splice(3,15)
  filteredCoins = onlyIndicators.filter((index) => index.unidad_medida != "Porcentaje");

  for(const coin of filteredCoins) {
    html += `
    <option value="${coin.valor}">${coin.nombre}</option>
    `
  }
  options.innerHTML = html;
}

const converter =  async () => {
  let inputValue = Number(document.querySelector("#input").value);
  let selectValue = document.querySelector("#coinsOptions");
  let numSelectedValue = Number(selectValue.options[selectValue.selectedIndex].value);

  const showResult = document.querySelector("#result");
  const result = inputValue * numSelectedValue;

  showResult.innerHTML = new Intl.NumberFormat('de-DE').format(result);

  let selectedText = selectValue.options[selectValue.selectedIndex].text;

  arr = filteredCoins.filter((index) => index.nombre === selectedText);

  const data = await getCoinsData(arr[0].codigo);
  
  const config = {
    type: "line",
    data
  };

  const myChart = document.getElementById('myChart');
  myChart.style.backgroundColor = "white";
  chart = new Chart(myChart, config);

}

button.addEventListener("click",converter);

window.onload = function () {
  renderCoins();
}