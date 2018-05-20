const h = 100;
const w = 400;
let ds;
let salesTotal = 0.00;
let salesAvg = 0.00;
const metrics = [];

function buildLine() {
    const lineToDraw = d3.svg.line()
        .x(d => (d.month-20130001)/3.25)
        .y(d => h - d.sales)
        .interpolate('linear');
    
    const svg = d3.select('body').append('svg')
        .attr({ width: w, height: h});

    const viz = svg.append('path')
        .attr({ 
            d: lineToDraw(ds),
            'stroke': 'purple',
            'stroke-width': 2,
            'fill': 'none' 
        });
}

function showTotals(){
    const table = d3.select('body').append('table');

    for (let i = 0; i < ds.length; i++) {
        salesTotal += ds[i]['sales']*1;
    }

    salesAvg = salesTotal / ds.length;

    metrics.push("Sales Total: " + salesTotal);
    metrics.push("Sales Avg: " + salesAvg.toFixed());

    const tr = table.selectAll('tr')
        .data(metrics)
        .enter()
        .append('tr')
        .append('td')
        .text(d => d);
}

d3.csv('MonthlySales.csv', (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
        ds = data;
    }
    buildLine();
    showTotals();
});