var myChart1 = echarts.init(chartDom1);
var option1;

function domainChart(instruments) {
  let nameValueInstruments = instruments.map((instrument) => {
    instrument.value =
      parseInt(instrument.marketP) * parseInt(instrument.quantity);
    return { value: instrument.value, name: instrument.domain };
  });
  console.log(nameValueInstruments);

  let domainInstruments = [];

  for (let valInstr of nameValueInstruments) {
    let isSomeInstrument = false;
    for (let domInstr of domainInstruments) {
      if (domInstr.name === valInstr.name) {
        domInstr.value += valInstr.value;
        isSomeInstrument = true;
        break;
      }
    }
    if (isSomeInstrument === false) {
      let clonedValInstr = { ...valInstr };
      domainInstruments.push(clonedValInstr);
    }
  }

  console.log(domainInstruments);

  option1 = {
    backgroundColor: '#2c343c',
    title: {
      text: 'Investments Sectors',
      left: 'left',
      top: 20,
      textStyle: {
        color: '#ccc',
      },
    },
    tooltip: {
      trigger: 'item',
    },
    visualMap: {
      show: false,
      min: 80,
      max: 600,
      inRange: {
        colorLightness: [0, 1],
      },
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '55%',
        center: ['50%', '50%'],
        data: domainInstruments.sort(function (a, b) {
          return a.value - b.value;
        }),
        roseType: 'radius',
        label: {
          color: 'rgba(255, 255, 255, 0.3)',
        },
        labelLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)',
          },
          smooth: 0.2,
          length: 10,
          length2: 20,
        },
        itemStyle: {
          color: '#749f83',
          shadowBlur: 200,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function (idx) {
          return Math.random() * 200;
        },
      },
    ],
  };

  option1 && myChart1.setOption(option1);
}
