let w = 750;
let h = 450;

let projection = d3.geo.albersUsa()
                    .translate([w/2, h/2])
                    .scale([750])

let path = d3.geo.path().projection(projection);
let svg = d3.select('body').append('svg').attr({ width: w, height: h})

let color = d3.scale.linear()
                .range(['rgb(255,247,236)','rgb(254,232,200)','rgb(253,212,158)','rgb(253,187,132)','rgb(252,141,89)','rgb(239,101,72)','rgb(215,48,31)','rgb(153,0,0)'])

d3.csv('state-sales.csv', (data) => {
    color.domain([
        0, d3.max(data, (d) => d.sales)
    ])
    
    d3.json('us.json', (json) => {
        for (let i = 0; i < data.length; i++) {
            let salesState = data[i].state;
            let salesVal = parseFloat(data[i].sales)
            for (let j = 0; j < json.features.length; j++) {
                let usState = json.features[j].properties.NAME;
                if (salesState === usState) {
                    json.features[j].properties.value = salesVal;
                    break;
                }
            }
        }

        svg.selectAll('path')
            .data(json.features)
            .enter()
            .append('path')
            .attr('d', path)
            .style('fill', (d) => {
                let value = d.properties.value;
                if (value) {
                    return color(value);
                } else {
                    return "#666666"
                }
            })
        
            d3.csv('sales-by-city.csv', (dataCity) => {
                svg.selectAll('circle')
                    .data(dataCity)
                    .enter()
                    .append('circle')
                    .attr({
                        cx: (d) => projection([d.lon,d.lat])[0],
                        cy: (d) => projection([d.lon,d.lat])[1],
                        r: (d) => Math.sqrt(parseInt(d.sales)*0.00005),
                        "fill": "red",
                    })
            })
    })
})

