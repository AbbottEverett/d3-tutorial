const h = 350;
const w = 400;

const monthlySales = [
    {"month": 10, "sales": 100},
    {"month": 20, "sales": 130},
    {"month": 30, "sales": 250},
    {"month": 40, "sales": 300},
    {"month": 50, "sales": 265},
    {"month": 60, "sales": 225},
    {"month": 70, "sales": 180},
    {"month": 80, "sales": 120},
    {"month": 90, "sales": 140},
    {"month": 100, "sales": 130},
];

//KPI
function salesKPI(d) {
    if (d>=250) return '#33CC66';
    return '#666666';
}

function showMinMax(ds, col, val, type) {
    let max = d3.max(ds, d => d[col]);
    let min = d3.min(ds, d => d[col]);
    if (type ==='minmax' && (val === max || val === min)) return val;
    if (type === 'all') return val;
}

const svg = d3.select('body').append('svg').attr({ width: w, height: h});

const dots = svg.selectAll('circle')
    .data(monthlySales)
    .enter()
    .append('circle')
    .attr({
        cx: (d) => d.month*3,
        cy: (d) => h-d.sales,
        r: 5,
        "fill": (d) => salesKPI(d.sales)
    });

const labels = svg.selectAll('text')
    .data(monthlySales)
    .enter()
    .append('text')
    .text(d => showMinMax(monthlySales, 'sales', d.sales, 'minmax'))
    .attr({
        x: d => d.month*3 - 25,
        y: d => h-d.sales,
        "font-size": "12px",
        "font-family": "sans-serif",
        "fill": "#666",
        "text-anchor": "start"
    });

    d3.select('select')
        .on('change', (d) => {
            let select = d3.select('#label-option').node().value;
            svg.selectAll('text')
                .data(monthlySales)
                .text((d) => showMinMax(monthlySales, 'sales', d.sales, select))
        })