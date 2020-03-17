drag_point= d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);

function dragstarted(d) {
    document.onselectstart = function() { return false; };
    d3.select(this).attr("stroke", "black");
    if(d.oldy==null&&d.oldx==null) {
        d.oldx=this.getAttribute("cx")
        d.oldy=this.getAttribute("cy")
    }
}

function dragged(d) {
    d3.select(this).raise().attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
}

function dragended(d) {
//Determine if point is in the dropzone
    if(d.x<=-40&&d.x>=-120&&d.y>=0&&d.y<=80)
    {
        d.in_dropzone="HighY";
        coordinates[d.dindex][featLength-1]="HighY"
        HighY.push(d);
        updateDropzone("HighY",HighY);
    }
    else if(d.x<=-40&&d.x>=-120&&d.y>=440&&d.y<=520)
    {
        d.in_dropzone="LowY";
        coordinates[d.dindex][featLength-1]="LowY"
        LowY.push(d);
        updateDropzone("LowY",LowY)
    }
    else if(d.x<=80&&d.x>=0&&d.y>=540&&d.y<=620)
    {
        d.in_dropzone="LowX";
        coordinates[d.dindex][featLength-1]="LowX"
        LowX.push(d);
        updateDropzone("LowX",LowX)
    }
    else if(d.x<=800&&d.x>=720&&d.y>=540&&d.y<=620)
    {
        d.in_dropzone="HighX";
        coordinates[d.dindex][featLength-1]="HighX"
        HighX.push(d);
        updateDropzone("HighX",HighX)
    }
    else
    {
        d.in_dropzone=null;
    }
//if point isn't in the dropzone, return to the original position
    if(d.in_dropzone===null)
    {
        d3.select(this).attr("stroke", null)
            .attr("cx",d.oldx)
            .attr("cy",d.oldy)
    }
    else
    {
        d3.select(this).attr("stroke", null)
            .attr("cx",d.oldx)
            .attr("cy",d.oldy)
            .style("fill", "#23ee85");
        if((HighY.length>=1&&LowY.length>=1)||(HighX.length>=1&&LowX.length>=1)){
            calculateDropzone();
            updateBarchart();
        }
    }
}



