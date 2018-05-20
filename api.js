let h= 100;
let w= 300;
let padding = 20;             
    
function getDate(d) {
    let strDate = new String(d);
    let year = strDate.substr(0,4)
    let month = strDate.substr(4,2)-1
    let day = strDate.substr(6,2)
    return new Date (year, month, day)
}

//build line
function buildLine(ds) {

    // console.log('xscale-max: '+ d3.max(ds.monthlySales, (d) => d.month ));
    // console.log('yscale-max: '+ d3.max(ds.monthlySales, (d) => d.sales ));

    let minDate = getDate(ds.monthlySales[0]['month'])
    let maxDate = getDate(ds.monthlySales[ds.monthlySales.length-1]['month'])

    // console.log(minDate, maxDate);

    // add tooltip
    let tooltip = d3.select('body').append('div')
                    .attr('class', 'tooltip')
                    .style('opacity', 0)
    //scales
    let xScale = d3.time.scale()
                .domain([minDate, maxDate])                
                .range([padding+5, w-padding])      

    let yScale = d3.scale.linear()
                .domain([0, d3.max(ds.monthlySales, (d) => d.sales)])
                .range([h-padding,10])
                
    
    let xAxisGen = d3.svg.axis().scale(xScale).orient('bottom').tickFormat(d3.time.format('%b'));
    let yAxisGen = d3.svg.axis().scale(yScale).orient("left").ticks(4);

    
    let lineFun = d3.svg.line()
        .x( (d) =>  xScale(getDate(d.month)))
        .y( (d) =>  yScale(d.sales))
        .interpolate("linear");
        
    let svg = d3.select("body").append("svg").attr({ width:w, height:h, "id": "svg-"+ds.category});
    
    let yAxis = svg.append("g").call(yAxisGen)
                        .attr('class', 'y-axis')
                        .attr('transform', 'translate(' + padding + ', 0)')

    let xAxis = svg.append('g').call(xAxisGen)
                        .attr('class', 'x-axis')
                        .attr('transform', 'translate(0,' + (h-padding) + ')')

    let viz = svg.append("path")
                .attr({
                    d: lineFun(ds.monthlySales),
                    "stroke" : "purple",
                    "stroke-width": 2,
                    "fill" : "none",
                    "class": "path-"+ds.category
                });

    let dots = svg.selectAll('circle')
                    .data(ds.monthlySales)
                    .enter()
                    .append('circle')
                    .attr({
                        cx: (d) =>  xScale(getDate(d.month)),
                        cy: (d) =>  yScale(d.sales),
                        r: 4,
                        "fill": "#666666",
                        class: "circle-"+ds.category
                    })
                    .on('mouseover', function(d){
                        tooltip.transition()
                            .duration(500)
                            .style('opacity', .85)
                        tooltip.html('<strong>Sales $' + d.sales + "K</strong>")
                            .style('left', (d3.event.pageX) + "px")
                            .style('top', (d3.event.pageY-28) + "px");
                    })
                    .on('mouseout', function(d) {
                        tooltip.transition()
                            .duration(300)
                            .style('opacity', 0)
                    })

}

function updateLine(ds) {

    let minDate = getDate(ds.monthlySales[0]['month'])
    let maxDate = getDate(ds.monthlySales[ds.monthlySales.length-1]['month'])

    //scales
    let xScale = d3.time.scale()
                .domain([minDate, maxDate])                
                .range([padding+5, w-padding])      

    let yScale = d3.scale.linear()
                .domain([0, d3.max(ds.monthlySales, (d) => d.sales)])
                .range([h-padding,10])
                
    
    let xAxisGen = d3.svg.axis().scale(xScale)
                .orient('bottom')
                .tickFormat(d3.time.format('%b'))
                .ticks(ds.monthlySales.length-1);

    let yAxisGen = d3.svg.axis().scale(yScale)
                .orient("left")
                .ticks(4);

    let lineFun = d3.svg.line()
        .x( (d) =>  xScale(getDate(d.month)))
        .y( (d) =>  yScale(d.sales))
        .interpolate("linear");
        
    let svg = d3.select("body").select("#svg-"+ds.category);
    
    let yAxis = svg.selectAll("g.y-axis").call(yAxisGen)
                        
    let xAxis = svg.selectAll('g.x-axis').call(xAxisGen)
                    
    let viz = svg.selectAll(".path-"+ds.category)
                .transition()
                .duration(1000)
                .ease("bounce")
                .attr({
                    d: lineFun(ds.monthlySales)
                });
    
}

//show header
function showHeader(ds) {
    d3.select("body").append("h1")
        .text(ds.category + " Sales (2013)");
}


//get data and draw things  
d3.json("https://api.github.com/repos/bsullins/d3js-resources/contents/monthlySalesbyCategoryMultiple.json", function(error, data) {
    
    if(error) {
        console.log(error);
    } else {
        console.log(data); //we're golden!
    }

    let decodedData = JSON.parse(window.atob(data.content));

    // console.log(decodedData.contents);

    
    decodedData.contents.forEach((content) =>{
        ds=content;
        // console.log(ds);
        showHeader(ds);
        buildLine(ds);                    
    })
    
    // add event listener
    d3.select('select')
        .on('change', (d, i) => {
            let sel = d3.select('#date-option').node().value;
            let decodedData = JSON.parse(window.atob(data.content));
            decodedData.contents.forEach((content) =>{
                ds=content;
                ds.monthlySales.splice(0, ds.monthlySales.length-sel)
                updateLine(ds);                    
            })
        })

});  