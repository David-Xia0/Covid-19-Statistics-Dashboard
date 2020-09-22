const selectGraph = (elementID) => {

    for (element of document.getElementsByClassName('tab')) {
        element.style.backgroundColor = "transparent";
    }

    for (element of document.getElementsByClassName('graph')) {
        element.style.display = "none";
    }
    document.getElementById(elementID).style.display = "block";
    document.getElementById(elementID + "Tab").style.backgroundColor = "lightgrey";
}

selectGraph('newCasesGraph');

let totalCases = 0;
let totalActiveCases = 0;
let totalDeaths = 0;
let totalRecoveries = 0;

let largestActiveDay = 0;
let largestDeathDay = 0;

let dayCount = 0;
let lastUpdate;
let casesByDay = new Array();
let deathByDay = new Array();
let days = new Array();

let newActiveCases = 0;
let newDeaths = 0;


const getData = () => {

    const fetchpromise = fetch("https://api.thevirustracker.com/free-api?countryTimeline=NZ", {
        headers: {
            "Accept": "application/json",
        },
    });
    const streampromise = fetchpromise.then((response) => response.json())
    streampromise.then((data) => {

        let count = 0;
        for (const date in data.timelineitems[0]) {



            if (!isNaN(data.timelineitems[0][date].new_daily_cases)) {
                newActiveCases = data.timelineitems[0][date].new_daily_cases;
                if (newActiveCases > largestActiveDay) {
                    largestActiveDay = newActiveCases;
                }
            }



            if (!isNaN(data.timelineitems[0][date].new_daily_deaths)) {
                newDeaths = data.timelineitems[0][date].new_daily_deaths;
                if (newDeaths > largestDeathDay) {
                    largestDeathDay = newDeaths;
                }
            }


            if (!isNaN(data.timelineitems[0][date].total_deaths)) {
                totalDeaths = data.timelineitems[0][date].total_deaths;
            }
            if (!isNaN(data.timelineitems[0][date].total_cases)) {
                totalCases = data.timelineitems[0][date].total_cases;
            }
            if (!isNaN(data.timelineitems[0][date].total_recoveries)) {
                totalRecoveries = data.timelineitems[0][date].total_recoveries;
            }

            if (data.timelineitems[0][date].new_daily_cases <= 0 || data.timelineitems[0][date].new_daily_cases == null) {
                casesByDay[dayCount] = 0;
            } else {
                casesByDay[dayCount] = data.timelineitems[0][date].new_daily_cases;
            }

            if (data.timelineitems[0][date].new_daily_deaths == 0 || data.timelineitems[0][date].new_daily_deaths == null) {
                deathByDay[dayCount] = 0;
            } else {
                deathByDay[dayCount] = data.timelineitems[0][date].new_daily_deaths;
            }


            if (date.length > 6) {
                dayCount++;
                lastUpdate = date;
                days[count] = date.toString();
                count++;
            }

        }


        graphActiveData();
        graphDeathData();
        graphTotalCasesData()
        setStatistics();
    });




}

const setStatistics = () => {
    let statistics = "";
    statistics += '<p class="statHeading">Total Cases</p>'
    statistics += '<p class="statValue">' + totalCases + '</p><hr>'
    statistics += '<p class="statHeading">Recent Active Cases</p>'
    statistics += '<p class="statValue"> +' + newActiveCases + '</p><hr>'
    statistics += '<p class="statHeading">Total Deaths</p>'
    statistics += '<p class="statValue">' + totalDeaths + '</p><hr>'
    statistics += '<p class="statHeading">New Deaths</p>'
    statistics += '<p class="statValue"> +' + newDeaths + '</p><hr>'
    statistics += '<p class="statHeading">Total Recovered</p>'
    statistics += '<p class="statValue">' + totalRecoveries + '</p><hr>'
    statistics += '<p class="statHeading">Last Updated</p>'
    statistics += '<p class="statValue">' + lastUpdate + '</p>'
    document.getElementById("statistics").innerHTML = statistics;
}


const graphActiveData = () => {
    let width = dayCount * 11
    let height = width / 2
    let x = dayCount;
    let graphSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + (width + 60) + ' ' + (height + 160) + '">\n';
    for (let i = 0; i < 6; i++) {
        if (i != 0) {
            graphSVG += '<line x1="30" y1="' + (height - (height * i / 5) + 1) + '" x2="' + width + '" y2="' + (height - (height * i / 5) + 1) + '" stroke="grey"/>'
            graphSVG += '<text x="0" y="' + (height - (height * i / 5) + 35) + '" font-size="40">' + parseInt(largestActiveDay * i / 5) + "</text>"
        }
        graphSVG += '<text x="' + width * i / 5 + '" y="' + (height + 25) + '" font-size="40" transform="rotate(90 ' + width * i / 5 + ',' + (height + 25) + ')">' + days[parseInt((dayCount - 1) * i / 5)] + "</text>"
    }

    graphSVG += '<text x="' + width / 2 + '" y="' + (height + 100) + '"font-size="50">Date</text>'

    graphSVG += '<polygon points=" 0,' + height + ' ';

    casesByDay.forEach(cases => {
        graphSVG += x + ',' + (height - (height * cases / largestActiveDay)) + ' '
        x += 10;
    })

    graphSVG += ' ' + (x - 10) + ',' + height + '" style="fill:lightblue;stroke:blue;stroke-width:1"/>\n'
    graphSVG += '</svg>'
    //console.log(graphSVG)
    document.getElementById("newCasesGraph").innerHTML += graphSVG;
}

const graphDeathData = () => {
    let width = dayCount * 11
    let height = width / 2
    let x = dayCount;
    let graphSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + (width + 60) + ' ' + (height + 160) + '">\n';
    for (let i = 0; i < 6; i++) {
        if (i != 0) {
            graphSVG += '<line x1="30" y1="' + (height - (height * i / 5) + 1) + '" x2="' + width + '" y2="' + (height - (height * i / 5) + 1) + '" stroke="grey"/>'
            graphSVG += '<text x="0" y="' + (height - (height * i / 5) + 35) + '" font-size="40">' + parseInt(totalDeaths * i / 5) + "</text>"
        }
        graphSVG += '<text x="' + width * i / 5 + '" y="' + (height + 25) + '" font-size="40" transform="rotate(90 ' + width * i / 5 + ',' + (height + 25) + ')">' + days[parseInt((dayCount - 1) * i / 5)] + "</text>"
    }

    graphSVG += '<text x="' + width / 2 + '" y="' + (height + 100) + '"font-size="50">Date</text>'

    graphSVG += '<polygon points=" 0,' + height + ' ';

    let cumDeath = 0;
    deathByDay.forEach(death => {
        cumDeath += parseInt(death)
        graphSVG += x + ',' + (height - (height * cumDeath / totalDeaths)) + ' '
        x += 10;
    })

    graphSVG += ' ' + (x - 10) + ',' + height + '" style="fill:lightblue;stroke:blue;stroke-width:1"/>'
    graphSVG += '</svg>\n'
    //console.log(graphSVG)
    document.getElementById("totalDeathsGraph").innerHTML += graphSVG;
}

const graphTotalCasesData = () => {
    let width = dayCount * 11
    let height = width / 2
    let x = dayCount;
    let graphSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + (width + 60) + ' ' + (height + 160) + '">\n';
    for (let i = 0; i < 6; i++) {
        if (i != 0) {
            graphSVG += '<line x1="30" y1="' + (height - (height * i / 5) + 1) + '" x2="' + width + '" y2="' + (height - (height * i / 5) + 1) + '" stroke="grey"/>'
            graphSVG += '<text x="0" y="' + (height - (height * i / 5) + 35) + '" font-size="40">' + parseInt(totalCases * i / 5) + "</text>"
        }
        graphSVG += '<text x="' + width * i / 5 + '" y="' + (height + 25) + '" font-size="40" transform="rotate(90 ' + width * i / 5 + ',' + (height + 25) + ')">' + days[parseInt((dayCount - 1) * i / 5)] + "</text>"
    }

    graphSVG += '<text x="' + width / 2 + '" y="' + (height + 100) + '"font-size="50">Date</text>'

    graphSVG += '<polygon points=" 0,' + height + ' ';


    let cumCases = 0;
    casesByDay.forEach(cases => {
        cumCases += parseInt(cases)
        graphSVG += x + ',' + (height - (height * cumCases / totalCases)) + ' '
        x += 10;
    })

    graphSVG += ' ' + (x - 10) + ',' + height + '" style="fill:lightblue;stroke:blue;stroke-width:1"/>'
    graphSVG += '</svg>\n'
    //console.log(graphSVG)
    document.getElementById("totalCasesGraph").innerHTML += graphSVG;
}



getData();
