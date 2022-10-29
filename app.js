const API = {
  CREATE: {
    URL: 'http://localhost:3000/instruments-json/new',
    // URL: 'http://localhost:3000/investments/create',
    METHOD: 'POST',
  },
  READ: {
    URL: 'http://localhost:3000/instruments-json',
    // URL: 'http://localhost:3000/investments',
    METHOD: 'GET',
  },
  UPDATE: {
    URL: 'http://localhost:3000/instruments-json/update',
    // URL: 'http://localhost:3000/investments/update',
    METHOD: 'PUT',
  },
  DELETE: {
    URL: 'http://localhost:3000/instruments-json/delete',
    // URL: 'http://localhost:3000/investments/delete',
    METHOD: 'DELETE',
  },
};

const isDemo = false || location.host === 'mihai-iusztin.github.io';
const fetchYahooPrices = false;
const inlineChanges = isDemo;
if (isDemo) {
  API.READ.URL = 'data/instruments.json';
  API.DELETE.URL = 'data/delete.json';
  API.CREATE.URL = 'data/new.json';
  API.UPDATE.URL = 'data/update.json';

  API.DELETE.METHOD = 'GET';
  API.CREATE.METHOD = 'GET';
  API.UPDATE.METHOD = 'GET';
}

let allInstruments = [];
let editId;
let grossProfit = 0;

const addInvestmentBtn = $('#addInvestment');
const table = $('table');
const modalInput = $('#modal');
const overlay = $('#overlay');
const title = $('#title');
const tBody = $('table tbody');
const cancelBtn = $('#cancel-btn');
const form = $('#form');
let resetbtn = $('#reset-btn');
let inputs = document.querySelectorAll('input');
const chartDom = $('#main');
var chartDom1 = $('#main1');
const backToTableBtn = $('#back-tb');
const backToTableBtn1 = $('#back-tb1');
const seeResultsBtn = $('#seeResults');
const sectorDistributionBtn = $('#sector_btn');
const profitId = $('#profit_id');
const sectorId = $('#sector_id');

function $(select) {
  return document.querySelector(select);
}

function addNewInstrument() {
  table.classList.add('invisible');
  modalInput.classList.add('active');
  overlay.classList.add('active');
  title.classList.add('invisible');
}

function closeModal() {
  table.classList.remove('invisible');
  modalInput.classList.remove('active');
  overlay.classList.remove('active');
  title.classList.remove('invisible');
  form.reset();
}

function getInvestmensHTML(instrument) {
  return `  <tr>
    <td>${instrument.name}</td>
    <td>${instrument.symbol}</td>
    <td>${instrument.openD}</td>
    <td>${instrument.quantity}</td>
    <td>${instrument.openP}</td>
    <td>${instrument.marketP}</td>
    <td>${grossProfit}</td>
    <td>${instrument.domain}</td>
    <td>${instrument.dividendD}</td>
    <td>${instrument.earningD}</td>
    <td>${instrument.corporation}</td>
    <td>
      <a href="#" data-id = "${instrument.id}" class = "delete-btn">❌</a>
      <a href="#" data-id = "${instrument.id}" class = "edit-btn">>&#9998</a>
    </td>
    </tr>
  `;
}

function getInputValues() {
  const name = $('input[name = name]').value;
  const symbol = $('input[name = symbol]').value;
  const openD = $('input[name = openD]').value;
  const quantity = $('input[name = volum]').value;
  const openP = $('input[name = open]').value;
  const marketP = $('input[name = market]').value;
  const domain = $('#domain').value;
  const dividendD = $('input[name = dividend]').value;
  const earningD = $('input[name = earnings]').value;
  const corporation = $('input[name = corporation]').value;

  const instrument = {
    name: name,
    symbol: symbol,
    openD: openD,
    quantity: quantity,
    openP: openP,
    marketP: marketP,
    domain: domain,
    dividendD: dividendD,
    earningD: earningD,
    corporation: corporation,
  };
  return instrument;
}

function setInputValues(instrument) {
  ($('input[name = name]').value = instrument.name),
    ($('input[name = symbol]').value = instrument.symbol),
    ($('input[name = openD]').value = instrument.openD),
    ($('input[name = volum]').value = instrument.quantity),
    ($('input[name = open]').value = instrument.openP),
    ($('input[name = market]').value = instrument.marketP),
    ($('#domain').value = instrument.domain),
    ($('input[name = dividend]').value = instrument.dividendD),
    ($('input[name = earnings]').value = instrument.earningD),
    ($('input[name = corporation]').value = instrument.corporation);
}

function displayInstruments(instruments) {
  let instrumentsHTML = '';
  instruments.forEach((instrument) => {
    instrumentsHTML += getInvestmensHTML(instrument);
  });
  tBody.innerHTML = instrumentsHTML;
  loadGrossProfit(instruments);
}

function fetchMarketPrice(symbol) {
  const encodedParams = new URLSearchParams();
  encodedParams.append('symbol', symbol);

  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Key': '00000000222222222222',
      'X-RapidAPI-Host': 'yahoo-finance97.p.rapidapi.com',
    },
    body: encodedParams,
  };

  return fetch('https://yahoo-finance97.p.rapidapi.com/stock-info', options)
    .then((response) => response.json())
    .then((response) => {
      console.log(symbol, response.data.currentPrice);
      return {
        symbol,
        marketP: parseInt(response.data.currentPrice),
      };
    })
    .catch((err) => console.error(err));
}

function loadInstruments() {
  return (
    fetch(API.READ.URL)
      // fetch('data/instruments.json')
      .then((res) => res.json())
      .then((instruments) => {
        allInstruments = instruments;
        return instruments;
      })
  );
}

const method = API.CREATE.METHOD;
function newInstrumentRequest(instrument) {
  return fetch(API.CREATE.URL, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: method === 'GET' ? null : JSON.stringify(instrument),
  });
}

function removeInstrumentRequest(id) {
  const method = API.DELETE.METHOD;
  return fetch(API.DELETE.URL, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: method === 'GET' ? null : JSON.stringify({ id: id }),
  }).then((r) => r.json());
}

function editInstrumentRequest(instrument) {
  const method = API.UPDATE.METHOD;
  return fetch(API.UPDATE.URL, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: method === 'GET' ? null : JSON.stringify(instrument),
  }).then((r) => r.json());
}

function startEditForm(id) {
  const instrument = allInstruments.find((instrument) => instrument.id === id);
  setInputValues(instrument);
  editId = id;
}

function submitForm(event) {
  event.preventDefault();
  const instrument = getInputValues();

  if (editId) {
    instrument.id = editId;

    editInstrumentRequest(instrument).then((status) => {
      if (status.success) {
        if (inlineChanges) {
          allInstruments = allInstruments.map((i) =>
            i.id === editId ? instrument : i
          );
          displayInstruments(allInstruments);
        } else {
          loadInstruments();
          location.reload();
        }
        closeModal();
      }
    });
  } else {
    newInstrumentRequest(instrument)
      .then((r) => r.json())
      .then((status) => {
        if (status.success) {
          if (inlineChanges) {
            allInstruments = [
              ...allInstruments,
              { ...instrument, id: status.id },
            ];

            displayInstruments(allInstruments);
          } else {
            loadInstruments();
            location.reload();
          }
          closeModal();
        }
      });
  }
}

function resultCharts() {
  table.classList.add('invisible');
  title.classList.add('invisible');
  profitId.classList.add('active');
}

function sectorCharts() {
  table.classList.add('invisible');
  title.classList.add('invisible');
  sectorId.classList.add('active');
}

function displayCharts(instruments) {
  displayInstruments(instruments);
  instrumentsResults(instruments);
  domainChart(instruments);
}

function backToTable() {
  table.classList.remove('invisible');
  title.classList.remove('invisible');
  profitId.classList.remove('active');
  sectorId.classList.remove('active');
}

addInvestmentBtn.addEventListener('click', addNewInstrument);
cancelBtn.addEventListener('click', closeModal);
resetbtn.addEventListener('click', (e) => {
  e.preventDefault();

  form.reset();
});

overlay.addEventListener('click', closeModal);
form.addEventListener('submit', submitForm);
form.querySelector('tbody').addEventListener('click', (event) => {
  if (event.target.matches('a.delete-btn')) {
    const id = event.target.getAttribute('data-id');
    removeInstrumentRequest(id).then((status) => {
      if (status.success) {
        if (inlineChanges) {
          allInstruments = allInstruments.filter(
            (instrument) => instrument.id !== id
          );
          displayInstruments(allInstruments);
        }
        loadInstruments();
        location.reload();
      }
    });
  } else if (event.target.matches('a.edit-btn')) {
    const id = event.target.getAttribute('data-id');
    startEditForm(id);
    addNewInstrument();
  }
});

seeResultsBtn.addEventListener('click', resultCharts);
sectorDistributionBtn.addEventListener('click', sectorCharts);
backToTableBtn.addEventListener('click', backToTable);
backToTableBtn1.addEventListener('click', backToTable);

loadInstruments().then((instruments) => {
  console.log(instruments);
  if (!fetchYahooPrices) {
    displayCharts(instruments);
  } else {
    const requests = instruments.map((instrument) => {
      return fetchMarketPrice(instrument.symbol);
    });
    console.log(requests);
    Promise.all(requests).then((newPrices) => {
      const newInstruments = instruments.map((instrument, index) => {
        instrument.marketP = newPrices[index].marketP;
        return instrument;
      });
      displayCharts(newInstruments);
    });
  }
});
