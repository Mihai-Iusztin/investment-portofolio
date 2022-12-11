# investment-portofolio

Investment Portofolio

## Team

- [Mihai Iusztin](https://github.com/Mihai-Iusztin)
- [Dan Atanasoaie](https://github.com/AtanasoaieD)

## Live

[Demo](https://mihai-iusztin.github.io/investment-portofolio/)

## Investment Portofolio : trading and investing in the Financial Matkets

<img src = "/media/investment_portofolio.jpg" alt = "Investment-portofolio" title = "Investment Portofolio">

The goal of this App is to track your financial instruments synchronizing with Yahoo-finance.

## Chart representation

Visual representation of instruments profitability with Apache ECharts:

<img src = "/media/profit_loss_chart.jpg" alt = "Profit-loss" title = " Profit Loss">

Sector distribution :

<img src = "/media/sector_distribution_chart.jpg" alt = "Sector distribution" title = " Sector Distribution">

## Synchronizing with Yahoo-Finance API

You should set your RapidAPI - Key in order to connect with Yahoo - Finance :

function fetchMarketPrice(symbol) {
const encodedParams = new URLSearchParams();
encodedParams.append('symbol', symbol);

const options = {
method: 'POST',
headers: {
'content-type': 'application/x-www-form-urlencoded',
'X-RapidAPI-Key': '00000022222',
'X-RapidAPI-Host': 'yahoo-finance97.p.rapidapi.com',
},
body: encodedParams,
};

return fetch('https://yahoo-finance97.p.rapidapi.com/stock-info', options)
.then((response) => response.json())
.then((response) => {
return {
symbol,
marketP: parseInt(response.data.currentPrice),
};
})
.catch((err) => console.error(err));
}

- [x] connect to DB

Current app can connect with external [investment-portofolio-api](https://github.com/Mihai-Iusztin/investment-portofolio-api) to store data in DB .

## Steps

- [x] Clone api
- [x] npm instal
- [x] Start API - npm start
- [x] From current UI make request to investment-portofolio-api
