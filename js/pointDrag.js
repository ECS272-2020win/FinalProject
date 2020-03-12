drag_point= d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);

function dragstarted(d) {
    document.onselectstart = function() { return false; };
    d3.select(this).attr("stroke", "black");
    if(d.oldy==null&&d.oldx==null) {
        d.oldx=d3.event.x;
        d.oldy=d3.event.y;
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
        HighY.push(d);
    }
    else if(d.x<=-40&&d.x>=-120&&d.y>=440&&d.y<=520)
    {
        d.in_dropzone="LowY";
        LowY.push(d);
    }
    else if(d.x<=80&&d.x>=0&&d.y>=540&&d.y<=620)
    {
        d.in_dropzone="LowX";
        LowX.push(d);
    }
    else if(d.x<=800&&d.x>=720&&d.y>=540&&d.y<=620)
    {
        d.in_dropzone="HighX";
        HighX.push(d);
    }
    else
    {
        d.in_dropzone=null;
    }
//if point isn't in the dropzone, return to the original position
    if(d.in_dropzone===null)
    {
        d3.select(this).attr("stroke", null)
            .attr("transform","translate("+(d.oldx-d.x)+","+(d.oldy-d.y)+")")
    }
    else
    {
        d3.select(this).attr("stroke", null)
            .attr("transform","translate("+(d.oldx-d.x)+","+(d.oldy-d.y)+")")
            .style("fill", "#23ee85");
        calculateDropzone();
    }
}

