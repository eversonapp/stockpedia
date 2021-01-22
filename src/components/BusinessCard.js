import React, { Component } from 'react'
import { Line, HorizontalBar } from 'react-chartjs-2'
import { apiAlphaVantage, apiFinnhub, apiFmp, apiPolygon, apiIex, curConv, apiTwelve } from './Api'
import Brazil from '../pics/flagBrazil.png'
import Euro from '../pics/flagEuro.png'
import USA from '../pics/flagUsa.png'

export default class BusinessCard extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            companyCod: 'AAPL',

            companyCoin: [],
            company: [],
            companyLastDayPrice: [],
            companyFinancials: [],
            companyFinancialsQA: [],
            companyNews: [],
            ChartPrice:{},
            companyRecommendationDate: [],
            companyRecommendation: [],
            IndexsPrices: [],
        }
    }
    
    loadingCompanyCard = async (companyCod) => {
        const urlApi = 'https://financialmodelingprep.com/api/v3/profile/' +
        companyCod +'?apikey=' + apiFmp
        fetch(urlApi)
            .then(res => res.json())
            .then(data =>{
                this.setState({
                    company: data
                })
            })
    }

    loadingLastDayPrice = async (companyCod) => {
        const urlApi = 'https://api.twelvedata.com/time_series?symbol=' + companyCod + '&interval=5min&outputsize=78&apikey=' + apiTwelve
            fetch(urlApi)
                .then(response => response.json())
                .then(data => (
                    this.setState({
                        companyLastDayPrice: data.values
                    })
                ))
    }

    loadingBusinessFinancials = async (companyCod) => {
        const urlApi = 'https://api.polygon.io/v2/reference/financials/'
        + companyCod + '?limit=20&type=YA&sort=-calendarDate&apiKey=' + apiPolygon 
        fetch(urlApi)
        .then(response => response.json())
        .then(data => (
            this.setState({
                companyFinancials: data.results
                })
            ))
        }

    loadingBusinessFinancialsQA = async (companyCod) => {
        const urlApi = 'https://api.polygon.io/v2/reference/financials/'
        + companyCod + '?type=QA&apiKey=' + apiPolygon 
        fetch(urlApi)
        .then(response => response.json())
        .then(data => (
            this.setState({
                companyFinancialsQA: data.results
            })
        ))
    }
        
    loadingChartPrice = async (companyCod) => {
        const pointerToThis = this;
        const urlApi = 'https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=' +
        companyCod + '&apikey=' + apiAlphaVantage
        let dataChart = [];
        let priceChart = [];

        fetch(urlApi)
            .then( response => response.json())
            .then(
                function(data) {

                     for (var key in data['Monthly Adjusted Time Series']) {
                        dataChart.push(key)
                        priceChart.push(data['Monthly Adjusted Time Series'][key]['5. adjusted close']);
                      }

                    pointerToThis.setState({
                        ChartPrice: {
                            labels: dataChart.slice(0,240).reverse(),
                            datasets: [{
                                label:'Stock Price',
                                backgroundColor: 'rgba(66, 133, 244, 0.1)',
                                borderColor: 'rgba(66, 133, 244, 1)',
                                data: priceChart.slice(0,240).reverse()
                            }]
                        }
                    })
                }
            )
    }

    loadingBusinessNews = async (companyCod) => {
        const urlApi = 'https://cloud.iexapis.com/stable/stock/' + companyCod + '/news/last/7/?token=' + apiIex 
        fetch(urlApi)
            .then(res => res.json())
            .then(json => {
                this.setState({
                    companyNews: json
                })
            })
    }

    loadingRecommendation = async (companyCod) => {
        const urlApi = 'https://finnhub.io/api/v1/stock/recommendation?symbol=' + companyCod + '&token=' + apiFinnhub 
        fetch(urlApi)    
            .then(res => res.json())
            .then(data => {
                this.setState({
                    companyRecommendationDate: data,
                    companyRecommendation: {
                        labels: [
                            "Strong Buy",                                                        
                            "Buy",                                                    
                            "Hold",                                                    
                            "Sell",                                                    
                            "Strong Sell",                                                        
                        ],
                        datasets: [{
                            data: [
                                data[0].strongBuy,
                                data[0].buy,
                                data[0].hold,
                                data[0].strongSell,
                                data[0].sell,
                            ],
                            backgroundColor: [
                                'rgba(66, 133, 244, 0.7)',
                                'rgba(219, 68, 55, 0.7)',
                                'rgba(119, 119, 119, 0.7)',
                                'rgba(244, 180, 0, 0.7)',
                                'rgba(15, 157, 88, 0.7)',
                              ],
                              borderColor: [
                                'rgba(66, 133, 244, 1)',
                                'rgba(219, 68, 55, 1)',
                                'rgba(119, 119, 119, 1)',
                                'rgba(244, 180, 0, 1)',
                                'rgba(15, 157, 88, 1)',
                              ],
                              borderWidth: 1,
                        }]
                    }
                })
            })
    }
    
    loadingIndexPrices = async () => {
        const urlApi  = 'https://financialmodelingprep.com/api/v3/quote/%5EDJI,%5EIXIC,^GSPC,^BVSP,^N100?apikey=' + apiFmp
        fetch(urlApi)
        .then(res => res.json())
        .then(data => {
            this.setState({
                IndexsPrices: data.reverse()
            })
        })
    }

    loadingCurrency = async () => {
        const apiUrl = 'https://free.currconv.com/api/v7/convert?q=EUR_USD,BRL_USD&compact=ultra&apiKey=' + curConv
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    companyCoin: data
                })
            })
    }

    formatingLetters = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    formatingValues = (val) => {
        if(val === undefined || val === null || val === ''){
            return '' 
        }
        else{
            const valString = val.toString()
            if(valString.charAt(0) === '-'){
                if(valString.length >= 8 && valString.length <= 10){
                    return new Intl.NumberFormat().format((val).toString().slice(0,-3)) + 'M'
                }
                else if(valString.length >= 11 && valString.length <= 13){
                    return new Intl.NumberFormat().format((val).toString().slice(0,-6)) + 'B'
                }
                else if(valString.length >= 14 && valString.length <= 16){
                    return new Intl.NumberFormat().format((val).toString().slice(0,-9)) + 'T'
                }
                else{
                    return val
                }
            }
            else{
                if(valString.length >= 7 && valString.length <= 9){
                    return new Intl.NumberFormat().format((val).toString().slice(0,-3)) + 'M'
                }
                else if(valString.length >= 10 && valString.length <= 12){
                    return new Intl.NumberFormat().format((val).toString().slice(0,-6)) + 'B'
                }
                else if(valString.length >= 13 && valString.length <= 15){
                    return new Intl.NumberFormat().format((val).toString().slice(0,-9)) + 'T'
                }
                else{
                    return val
                }
            }
        }
    }

    changeHandler = (e) => {
    const companyCod = e.target.value

    this.setState({companyCod})
    this.loadingCompanyCard(companyCod)
    this.loadingLastDayPrice(companyCod)
    this.loadingBusinessFinancials(companyCod)
    this.loadingBusinessFinancialsQA(companyCod)
    this.loadingBusinessNews(companyCod)
    this.loadingChartPrice(companyCod)
    this.loadingRecommendation(companyCod)
    }

    componentDidMount(){
        this.loadingCompanyCard(this.state.companyCod)
        this.loadingLastDayPrice(this.state.companyCod)
        this.loadingBusinessFinancials(this.state.companyCod)
        this.loadingBusinessFinancialsQA(this.state.companyCod)
        this.loadingBusinessNews(this.state.companyCod)
        this.loadingChartPrice(this.state.companyCod)
        this.loadingRecommendation(this.state.companyCod)
        this.loadingCurrency()
        this.loadingIndexPrices()
    }

    render() {
        const {company, companyLastDayPrice, companyFinancials,companyFinancialsQA, companyNews, ChartPrice, companyRecommendation,companyRecommendationDate, IndexsPrices, companyCoin} = this.state
  
        return (
            <div className='content'>
                <div className="btnSearch">
                    <select value={this.state.companyCod} onChange={this.changeHandler}>
                        <option value="AAPL" selected>Select the company</option>
                        <option value="BABA">Alibaba</option>
                        <option value="AMZN">Amazon</option>
                        <option value="TSLA">Tesla</option>
                        <option value="ADBE">Adobe</option>
                        <option value="DIS">Disney</option>
                        <option value="FB">Facebook</option>
                        <option value="MNST">Monster Energy</option>
                        <option value="BKNG">Booking</option>
                    </select>
                </div>

                {company.map(item => (
                <div className="company">
                    <div>
                        <div className="companyProfile">
                            <div className="companyLogo">
                                <img src={item.image} alt='Logo' />
                            </div>
                            <div>
                                <h1> {item.companyName} </h1>
                                <h3>Stock price: {item.price} </h3>
                            </div>
                        </div>
                        <p className="companyDesc"> {item.description} </p>
                    </div>
                    <div className="companySidebar">
                        <ul>
                            <li>{item.exchangeShortName}: <b>{item.symbol}</b></li>
                            <li>IPO: <b>{(item.ipoDate).replaceAll('-','/')}</b></li>
                            <li>Market Cap:<b> {'$' + (new Intl.NumberFormat().format(item.mktCap))}</b></li>
                            <li>Industry:<b> {item.industry}</b></li>
                            <li>Sector:<b> {item.sector}</b></li>
                            <li>CEO:<b> {item.ceo}</b></li>
                            <li>Employees:<b> {new Intl.NumberFormat().format(item.fullTimeEmployees)}</b></li>
                            <li>Headquarters:<b> {this.formatingLetters(item.state)} - {item.country}</b></li>
                            <li>Website:<b> <a href={item.website} target='_blank' rel="noreferrer">{(item.website).toString().slice(0,-1).replaceAll('http://','').replaceAll('https://','').replaceAll('www.','')} </a></b></li>
                        </ul>
                        {companyLastDayPrice.slice(0,1).map( item => (
                        <ul>
                            <li> datetime: {(item.datetime).replaceAll('-','/')} </li>
                            <li> open: {item.open} </li>
                            <li> high: {item.high} </li>
                            <li> low: {item.low} </li>
                            <li> close: {item.close} </li>
                            <li> volume: {item.volume} </li>
                        </ul>
                        ))}
                    </div>
                </div>
                ))}


                <div className="companyFinancials">
                    <button className="ARTitle">
                        <h2>Annual Reports</h2>
                    </button>
                    <div className="companyFInancialTable">
                        <table>
                            <thead>
                                <tr>
                                    <th>Year</th>
                                    <th>Equity</th>
                                    <th>Revenue</th>
                                    <th>EBITDA</th>
                                    <th>Net Income</th>
                                    <th>Net Margin</th>
                                    <th>ROE</th>
                                    <th>Cash</th>
                                    <th>Debt</th>
                                </tr>
                            </thead>
                            <tbody>
                            {companyFinancials.slice(0,10).map(item => (
                                <tr key={item.id}>
                                    <th> {(item.calendarDate).toString().substring(0,4).replace('-','/')} </th>
                                    <th> {this.formatingValues(item.shareholdersEquity)} </th>
                                    <th> {this.formatingValues(item.revenues)} </th>
                                    <th> {this.formatingValues(item.earningsBeforeInterestTaxesDepreciationAmortization)} </th>
                                    <th> {this.formatingValues(item.netIncome)} </th>
                                    <th style={{color: Math.sign((item.netIncome / item.revenues) * 100) === -1 ? "#DB4437" : "#333333"}}>
                                        {(((item.netIncome / item.revenues) * 100) < 0) ? 'LOSS' : (Math.round((item.netIncome / item.revenues) * 100) + '%')}
                                    </th>
                                    <th style={{color: Math.sign(item.returnOnAverageEquity) === -1 ? "#DB4437" : "#333333"}}>
                                        {(item.returnOnAverageEquity === undefined) ? '' : ((item.returnOnAverageEquity < 0) ? 'LOSS' : Math.round(item.returnOnAverageEquity * 100) + '%')}
                                    </th>
                                    <th> {this.formatingValues(item.cashAndEquivalents)} </th>
                                    <th> {this.formatingValues(item.debt)} </th>
                                </tr>
                            ))}
                            </tbody>
                        </table>    
                    </div>
                </div>
                        
                <div className="companyFinancials">
                    <div className="companyFInancialTable">
                        <button
                            id="btnQA"
                            onClick={
                            function showQA() {
                                let x = document.getElementById("QA")
                                if(x.style.display === "none") {
                                    x.style.display = "table"
                                }
                                else{
                                    x.style.display = "none"
                                }
                            }
                            } >
                                <h2>QA Reports - Click here to show</h2> 
                        </button>
                        <table id="QA">
                            <thead>
                                <tr>
                                    <th>Year</th>
                                    <th>Equity</th>
                                    <th>Revenue</th>
                                    <th>EBITDA</th>
                                    <th>Net Income</th>
                                    <th>Net Margin</th>
                                    <th>ROE</th>
                                    <th>Cash</th>
                                    <th>Debt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {companyFinancialsQA.slice(0,40).map(item => (
                                    <tr key={item.id}>
                                        <th> {(item.calendarDate).toString().substring(0,7).replaceAll('-','/')} </th>
                                        <th> {this.formatingValues(item.shareholdersEquity)} </th>
                                        <th> {this.formatingValues(item.revenues)} </th>
                                        <th> {this.formatingValues(item.earningsBeforeInterestTaxesDepreciationAmortization)} </th>
                                        <th> {this.formatingValues(item.netIncome)} </th>
                                        <th style={{color: Math.sign((item.netIncome / item.revenues) * 100) === -1 ? "#DB4437" : "#333333"}}>
                                            {(((item.netIncome / item.revenues) * 100) < 0) ? 'LOSS' : (Math.round((item.netIncome / item.revenues) * 100) + '%')}
                                        </th>
                                        <th style={{color: Math.sign((item.netIncome / item.shareholdersEquity) * 100) === -1 ? "#DB4437" : "#333333"}}> 
                                            {(((item.netIncome / item.shareholdersEquity) * 100) < 0) ? 'LOSS' : (Math.round((item.netIncome / item.shareholdersEquity) * 100) + '%')}
                                        </th>
                                        <th> {this.formatingValues(item.cashAndEquivalents)} </th>
                                        <th> {this.formatingValues(item.debt)} </th>
                                    </tr>
                                ))}
                            </tbody>
                        </table>    
                    </div>
                </div>

                <div className="chartPrice">
                    <div>
                        <h2>Historical Stock Price</h2> <span>12</span> <span>60</span>
                    </div>
                    <Line
                        data={ChartPrice}
                        options={
                            { scales: {
                                xAxes: [
                                    {
                                        ticks: {
                                            fontSize: 10,
                                        }
                                    }
                                ]
                            }}
                            }

                         /> 
                </div>

                <div className="mainContent">
                    <div className="companyNews">
                        {companyNews.map(item => (
                        <a href={item.url} target="_blank" rel="noreferrer" className='companyNews'>
                            <div className="companyNewsImg">
                                <img src={item.image} alt={item.related} title={item.related} />
                            </div>
                            <div className="companyNewsTxt">
                                <h2> {item.headline} </h2>
                                <p> {(item.summary).substring(0,140) + "..."} </p>
                                <h6> {item.source} </h6>
                            </div>
                        </a>
                        ))}
                    </div>

                    <div className="contentSidebar">
                        <div className="recommendation">
                            <span className="sidebarTitles">Recommendations</span>
                            <div className="recommendationContent">
                                <HorizontalBar
                                    data={companyRecommendation} options={{
                                        legend: {
                                            display: false,
                                        },
                                        
                                    }}
                                />
                                {companyRecommendationDate.slice(0,1).map(item => (
                                    <p>{item.symbol} Analyse: <b>{(item.period).replaceAll('-','/')}</b> </p>
                                ))}
                            </div>
                        </div>
                        
                        <div className="indixes">
                            <span className="sidebarTitles">Market Indixes</span>
                            {IndexsPrices.map(item => (
                            <ul>
                                <li className="indexesName"> 
                                    {(item.name).replaceAll(' Composite', '').replaceAll(' Industrial Average', '')}
                                </li>
                                <li className="indexesPrice">
                                    {new Intl.NumberFormat().format(item.price)}
                                </li>
                                <li className="indexesChanges" style={{color: Math.sign(item.change) === -1 ? "#DB4437" : "#0F9D58"}}>
                                    <span>{(((item.change) > 0) ? ("+" + (item.change)) : (item.change))}</span>
                                    <span>{item.changesPercentage}%</span>
                                </li>
                            </ul>
                            ))}
                        </div>
                        <div className="currency">
                            <span className="sidebarTitles">Currencies</span>
                            <ul>
                                <li>
                                <img src={Brazil} alt="BRL/USD" /> <b>/</b> <img src={USA} alt="USA" /> <b>${new Intl.NumberFormat().format(companyCoin.BRL_USD).toString().substring(0,4)}</b>
                                </li>
                                <li>
                                    <img src={Euro} alt="EUR/USD" /> <b>/</b> <img src={USA} alt="USA" /> <b>${new Intl.NumberFormat().format(companyCoin.EUR_USD).toString().substring(0,4)}</b>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

