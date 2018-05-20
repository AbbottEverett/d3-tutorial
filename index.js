const w = 300;
const h = 100;
const padding = 2;
const dataset = [5, 10, 14, 21, 25, 11, 25, 22, 18, 7];
const svg = d3.select('body').append('svg')
                    .attr('width', w)
                    .attr('height', h);

function colorPicker(v) {
    if (v <= 20) return "#666666";
    if (v > 20) return "#FF0033";
}

svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
        .attr({ 
            x: (d, i) => i * (w / dataset.length),
            y: (d) => h - (d*4),
            width: w / dataset.length - padding,
            height: (d) => d*4,
            fill: (d) => colorPicker(d)
        })
        .on('mouseover', function(d) {
            svg.append('text')
                .text(d)
                .attr({
                    "text-anchor": "middle",
                    x: parseFloat(d3.select(this).attr('x')) + parseFloat(d3.select(this).attr('width') / 2),
                    y: parseFloat(d3.select(this).attr('y')) + 12,
                    "font-family": "sans-serif",
                    "font-size": 12,
                    "fill": "#ffffff",
                    "id": "tooltip"
                });
        })
        .on('mouseout', function() {
            d3.select('#tooltip').remove();
        });



