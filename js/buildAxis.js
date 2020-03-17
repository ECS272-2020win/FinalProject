function updateBarchart() {

        var showY
        showY = sortAbs(Ty).slice(0, 14);

        xScale_y = d3.scaleLinear()
            .range([this.margin.left - 120, 0])
            .domain([Math.max.apply(null,Ty),Math.min.apply(null,Ty)]).nice();

        yScale_y = d3.scaleBand()
            .range([0, this.height-dropSize*2-20])
            .domain(showY.map(function(d) {return d["attr"]}))
            .padding(0.04)


        this.yAxisView.selectAll("rect").remove();
        this.yAxisView.selectAll("g").remove();

        this.yAxisView.append("g")
            .attr("transform", "translate(45,20)")
            .call(d3.axisTop(xScale_y));
        this.yAxisView.append("g")
            .attr("transform", "translate(45,20)")
            .call(d3.axisLeft(yScale_y));
        this.yAxisView.append("g")
            .append("line")
            .attr("x1",xScale_y(0)+45)
            .attr("x2",xScale_y(0)+45)
            .attr("y1",20)
            .attr("y2",360)
            .attr("stroke","#000")

        var dragBarY = this.yAxisView
            .selectAll(".bar")
            .data(showY)
            .enter().append("rect")
            .style("fill",function(d) { return d["value"] < 0 ? "brown":"steelblue"})
            .attr("x", function (d) {
                return xScale_y(Math.min(0, d["value"]))+45 ;
            })
            .attr("y", function (d) {
                return yScale_y(d["attr"])+28 ;
            })
            .attr("width", function (d) {
                if (d["value"] == 0) {
                    return 2;
                } else {
                    return Math.abs(xScale_y(d["value"]) - xScale_y(0));
                }
            })
            .attr("height", 10)
            .attr("fill-opacity", 0.8);

        var dragBarTop = this.yAxisView.selectAll(".dummy")
            .data(showY)
            .enter().append("rect")
            .attr("x", function(d) {
                if (d["value"]>0) {
                    return xScale_y(d["value"])+43;
                } else {
                    return xScale_y(Math.min(0, d["value"]))+45;
                }
            })
            .attr("y", function(d) {
                return yScale_y(d["attr"])+28;
            })
            .attr("width", 2)
            .attr("height", 10)
            .attr("opacity",0)
            .style("cursor", "ew-resize")
            .call(d3.drag().on("drag",function (d) {
                    d3.select(this)
                        .attr("x", function(){
                            return d3.event.x<xScale_y(0)+45?d3.event.x:xScale_y(0)+45
                        })
                        .attr("width", function () {
                            var x=d3.event.x;
                            var sss=xScale_y(x);
                            if(d3.event.x==xScale_y(0)+45) {
                                return 2;
                            }
                            else if(d3.event.x>xScale_y(0)+45){
                                return Math.abs(d3.event.x-xScale_y(0)-45)
                            }
                            else{
                                return  Math.abs(d3.event.x-xScale_y(0)-45)
                            }
                        })
                    var xlength=xScale_y.invert(d3.event.x-45)
                    if(xlength>1){
                        d["value"]=1;
                    }else if(xlength<-1){
                        d["value"]=-1;
                    }else{
                        d["value"]=xlength;
                    }
                    var ylength=this.getAttribute("y")
                    var selectRect=getElementByAttr("rect","y",ylength)
                    d3.select(selectRect)
                        .style("fill",function() { return d3.event.x<xScale_y(0)+45? "brown":"steelblue"})
                        .attr("x", function(){
                            return d3.event.x<xScale_y(0)+45?d3.event.x:xScale_y(0)+45
                        })
                        .attr("width", function () {
                            var x=d3.event.x;
                            var sss=xScale_y(x);
                            if(d3.event.x==xScale_y(0)+45) {
                                return 2;
                            }
                            else if(d3.event.x>xScale_y(0)+45){
                                return Math.abs(d3.event.x-xScale_y(0)-45)
                            }
                            else{
                                return  Math.abs(d3.event.x-xScale_y(0)-45)
                            }
                        })
                }).on("end",function (d) {
                    for(var i=1;i<featLength;i++){
                        if (d["attr"]===features[i]){
                            Ty[i-1]=d["value"]
                            break;
                        }
                    }
                    updateBarchart();
                    renewScattarplot(newCoordinate());
                })
            )


        var showX
        showX = sortAbs(Tx).slice(0, 14);

        xScale_x = d3.scaleLinear()
            .range([this.width-dropSize*2-120, 0])
            .domain([Math.max.apply(null,Tx),Math.min.apply(null,Tx)]);

        yScale_x = d3.scaleBand()
            .range([0, this.margin.bottom-40])
            .domain(showX.map(function(d) {return d["attr"]}))
            .padding(0.015)


        this.xAxisView.selectAll("rect").remove();
        this.xAxisView.selectAll("g").remove();

        this.xAxisView.append("g")
            .attr("transform", "translate(60,20)")
            .call(d3.axisTop(xScale_x));
        this.xAxisView.append("g")
            .attr("transform", "translate(60,20)")
            .call(d3.axisLeft(yScale_x));
        this.xAxisView.append("g")
            .append("line")
            .attr("x1",xScale_x(0)+60)
            .attr("x2",xScale_x(0)+60)
            .attr("y1",20)
            .attr("y2",220)
            .attr("stroke","#000")

        var dragBarX = this.xAxisView
            .selectAll(".bar")
            .data(showX)
            .enter().append("rect")
            .style("fill",function(d) { return d["value"] < 0 ? "brown":"steelblue"})
            .attr("x", function (d) {
                return xScale_x(Math.min(0, d["value"]))+60 ;
            })
            .attr("y", function (d) {
                return yScale_x(d["attr"])+22 ;
            })
            .attr("width", function (d) {
                if (d["value"] == 0) {
                    return 2;
                } else {
                    return Math.abs(xScale_x(d["value"]) - xScale_x(0));
                }
            })
            .attr("height", 10)
            .attr("fill-opacity", 0.8);

        var dragBarTop = this.xAxisView.selectAll(".dummy")
            .data(showX)
            .enter().append("rect")
            .attr("x", function(d) {
                if (d["value"]>0) {
                    return xScale_x(d["value"])+58;
                } else {
                    return xScale_x(Math.min(0, d["value"]))+60;
                }
            })
            .attr("y", function(d) {
                return yScale_x(d["attr"])+22;
            })
            .attr("width", 2)
            .attr("height", 10)
            .attr("opacity",0)
            .style("cursor", "ew-resize")
            .call(d3.drag().on("drag",function (d) {
                    d3.select(this)
                        .attr("x", function(){
                            return d3.event.x<xScale_x(0)+60?d3.event.x:xScale_x(0)+60
                        })
                        .attr("width", function () {
                            var x=d3.event.x;
                            var sss=xScale_x(x);
                            if(d3.event.x==xScale_x(0)+60) {
                                return 2;
                            }
                            else if(d3.event.x>xScale_x(0)+60){
                                return Math.abs(d3.event.x-xScale_x(0)-60)
                            }
                            else{
                                return  Math.abs(d3.event.x-xScale_x(0)-60)
                            }
                        })
                    var xlength=xScale_x.invert(d3.event.x-60)
                    if(xlength>1){
                        d["value"]=1;
                    }else if(xlength<-1){
                        d["value"]=-1;
                    }else{
                        d["value"]=xlength;
                    }
                    var ylength=this.getAttribute("y")
                    var selectRect=getElementByAttr("rect","y",ylength)
                    d3.select(selectRect)
                        .style("fill",function() { return d3.event.x<xScale_x(0)+60? "brown":"steelblue"})
                        .attr("x", function(){
                            return d3.event.x<xScale_x(0)+60?d3.event.x:xScale_x(0)+60
                        })
                        .attr("width", function () {
                            var x=d3.event.x;
                            var sss=xScale_x(x);
                            if(d3.event.x==xScale_x(0)+60) {
                                return 2;
                            }
                            else if(d3.event.x>xScale_x(0)+60){
                                return Math.abs(d3.event.x-xScale_x(0)-60)
                            }
                            else{
                                return  Math.abs(d3.event.x-xScale_x(0)-60)
                            }
                        })
                }).on("end",function (d) {
                    for(var i=1;i<featLength;i++){
                        if (d["attr"]===features[i]){
                            Tx[i-1]=d["value"]
                            break;
                        }
                    }
                    updateBarchart();
                    renewScattarplot(newCoordinate());
                })
            )
}

function getElementByAttr(tag,attr,value) {
    var aElements=document.getElementsByTagName(tag);
    for(var i=0;i<aElements.length;i++)
    {
        if(aElements[i].getAttribute(attr)==value&&aElements[i].getAttribute("opacity")!=0){
            return aElements[i]
            break;
        }
    }
}

