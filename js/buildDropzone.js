function updateDropzone(position,data){
    var layout=[];
    if(data.length>1){
        switch(position){
            case "HighX":
                layout=calcCircularLayout(HighX.length,{x:1160,y:600},30);
                for(var i=0;i<HighX.length;i++){
                    HighX[i].dropcx=layout[i].x;
                    HighX[i].dropcy=layout[i].y;
                }
                d3.select("#highendX").selectAll("circle").remove();
                d3.select("#highendX").selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("cx", function (d) { return d.dropcx } )
                    .attr("cy", function (d) { return d.dropcy } )
                    .attr("r", 5.0)
                    .style("cursor", "resize")
                    .on("mouseover", function(d) {
                        //console.log(d.dindex);
                        buildTable(d.dindex);
                        d3.select(this).style("fill-opacity", 1);
                    })
                    .on("mouseout", function(d){
                        d3.select(this).style("fill-opacity",0.2)
                    })
                break;
            case "LowX":
                layout=calcCircularLayout(LowX.length,{x:440,y:600},30);
                for(var i=0;i<LowX.length;i++){
                    LowX[i].dropcx=layout[i].x;
                    LowX[i].dropcy=layout[i].y;
                }
                d3.select("#lowendX").selectAll("circle").remove();
                d3.select("#lowendX").selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("cx", function (d) { return d.dropcx } )
                    .attr("cy", function (d) { return d.dropcy } )
                    .attr("r", 5.0)
                    .style("cursor", "resize")
                    .on("mouseover", function(d) {
                        //console.log(d.dindex);
                        buildTable(d.dindex);
                        d3.select(this).style("fill-opacity", 1);
                    })
                    .on("mouseout", function(d){
                        d3.select(this).style("fill-opacity",0.2)
                    })
                break;
            case "HighY":
                layout=calcCircularLayout(HighY.length,{x:320,y:60},30);
                for(var i=0;i<HighY.length;i++){
                    HighY[i].dropcx=layout[i].x;
                    HighY[i].dropcy=layout[i].y;
                }
                d3.select("#highendY").selectAll("circle").remove();
                d3.select("#highendY").selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("cx", function (d) { return d.dropcx } )
                    .attr("cy", function (d) { return d.dropcy } )
                    .attr("r", 5.0)
                    .style("cursor", "resize")
                    .on("mouseover", function(d) {
                        //console.log(d.dindex);
                        buildTable(d.dindex);
                        d3.select(this).style("fill-opacity", 1);
                    })
                    .on("mouseout", function(d){
                        d3.select(this).style("fill-opacity",0.2)
                    })
                break;
            case "LowY":
                layout=calcCircularLayout(LowY.length,{x:320,y:500},30);
                for(var i=0;i<LowY.length;i++){
                    LowY[i].dropcx=layout[i].x;
                    LowY[i].dropcy=layout[i].y;
                }
                d3.select("#lowendY").selectAll("circle").remove();
                d3.select("#lowendY").selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("cx", function (d) { return d.dropcx } )
                    .attr("cy", function (d) { return d.dropcy } )
                    .attr("r", 5.0)
                    .style("cursor", "resize")
                    .on("mouseover", function(d) {
                        //console.log(d.dindex);
                        buildTable(d.dindex);
                        d3.select(this).style("fill-opacity", 1);
                    })
                    .on("mouseout", function(d){
                        d3.select(this).style("fill-opacity",0.2)
                    })
                break;
        }
    }else{
        switch(position) {
            case "HighX":
                d3.select("#highendX").selectAll("circle").remove();
                d3.select("#highendX").selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("cx", function(d){ return d.dropcx=1160})
                    .attr("cy", function(d){ return d.dropcy=600})
                    .attr("r", 5.0)
                    .style("fill", "#000000")
                    .on("mouseover", function(d) {
                        //console.log(d.dindex);
                        buildTable(d.dindex);
                        d3.select(this).style("fill-opacity", 1);
                    })
                    .on("mouseout", function(d){
                        d3.select(this).style("fill-opacity",0.2)
                    })
                break;
            case "LowX":
                d3.select("#lowendX").selectAll("circle").remove();
                d3.select("#lowendX").selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("cx", function(d){ return d.dropcx=440})
                    .attr("cy", function(d){ return d.dropcy=600})
                    .attr("r", 5.0)
                    .style("fill", "#000000")
                    .on("mouseover", function(d) {
                        //console.log(d.dindex);
                        buildTable(d.dindex);
                        d3.select(this).style("fill-opacity", 1);
                    })
                    .on("mouseout", function(d){
                        d3.select(this).style("fill-opacity",0.2)
                    })
                break;
            case "HighY":
                d3.select("#highendY").selectAll("circle").remove();
                d3.select("#highendY").selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("cx", function(d){ return d.dropcx=320})
                    .attr("cy", function(d){ return d.dropcy=60})
                    .attr("r", 5.0)
                    .style("fill", "#000000")
                    .on("mouseover", function(d) {
                        //console.log(d.dindex);
                        buildTable(d.dindex);
                        d3.select(this).style("fill-opacity", 1);
                    })
                    .on("mouseout", function(d){
                        d3.select(this).style("fill-opacity",0.2)
                    })
                break;
            case "LowY":
                d3.select("#lowendY").selectAll("circle").remove();
                d3.select("#lowendY").selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("cx", function(d){ return d.dropcx=320})
                    .attr("cy", function(d){ return d.dropcy=500})
                    .attr("r", 5.0)
                    .style("fill", "#000000")
                    .on("mouseover", function(d) {
                        //console.log(d.dindex);
                        buildTable(d.dindex);
                        d3.select(this).style("fill-opacity", 1);
                    })
                    .on("mouseout", function(d){
                        d3.select(this).style("fill-opacity",0.2)
                    })
                break;
        }
    }
}

function calcCircularLayout(nodeSize, center, radius) {
    var layouts = [];
    for(var i = 0; i< nodeSize; i ++) {
        var x = center.x + radius * Math.cos(2 * Math.PI * i / nodeSize),
            y = center.y + radius * Math.sin(2 * Math.PI * i / nodeSize);

        layouts.push({'x': x, 'y': y});
    }
    return layouts;
}
