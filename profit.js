function loadGrossProfit(instruments) {
  let instrumentsHTML = '';
  instruments.forEach((instrument) => {
    grossProfit =
      (parseInt(instrument.marketP) - parseInt(instrument.openP)) *
      parseInt(instrument.quantity);

    instrumentsHTML += getInvestmensHTML(instrument);
  });
  tBody.innerHTML = instrumentsHTML;
}

const myChart = echarts.init(chartDom);
let option;

function instrumentsResults(instruments) {
  let instrumentsSmb = instruments.map((instrument) => instrument.symbol);
  let instrumentsProfit = instruments.map((instrument) => {
    return (
      ((parseInt(instrument.marketP) - parseInt(instrument.openP)) /
        parseInt(instrument.openP)) *
      100
    );
  });

  option = {
    xAxis: {
      type: 'category',
      data: instrumentsSmb,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: instrumentsProfit,
        type: 'bar',
      },
    ],
  };

  option && myChart.setOption(option);
}
