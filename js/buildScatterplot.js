function calculateDropzone() {
    var VectorHY = [];
    var VectorLY = [];
    var VectorHX = [];
    var VectorLX = [];

    if(HighY.length>=1&&LowY.length>=1){
        Ty=[];
        for(var i=1;i<featLength;i++){
            var value=0;
            for(var j=0;j<HighY.length;j++){
                //value+=parseInt(rawData[features[i]][HighY[j]['dindex']])
                value+=coordinates[HighY[j]['dindex']][i-1]
            }
            VectorHY.push(value/HighY.length);
        }
        for(var i=1;i<featLength;i++){
            var value=0;
            for(var j=0;j<LowY.length;j++){
                //value+=parseInt(rawData[features[i]][LowY[j]['dindex']])
                value+=coordinates[LowY[j]['dindex']][i-1]
            }
            VectorLY.push(value/LowY.length);
            Ty.push(VectorHY[i-1]-VectorLY[i-1])
        }
        renewScattarplot(newCoordinate());
    }

    if(HighX.length>=1&&LowX.length>=1){
        Tx=[];
        for(var i=1;i<featLength;i++){
            var value=0;
            for(var j=0;j<HighX.length;j++){
                //value+=parseInt(rawData[features[i]][HighX[j]['dindex']])
                value+=coordinates[HighX[j]['dindex']][i-1]
            }
            VectorHX.push(value/HighX.length);
        }

        for(var i=1;i<featLength;i++){
            var value=0;
            for(var j=0;j<LowX.length;j++){
                value+=coordinates[LowX[j]['dindex']][i-1]
                //value+=parseInt(rawData[features[i]][LowX[j]['dindex']])
            }
            VectorLX.push(value/LowX.length);
            Tx.push(VectorHX[i-1]-VectorLX[i-1])
        }

        renewScattarplot(newCoordinate());
    }
}

function sortAbs(T) {
    var X=[];
    for(var i=1;i<featLength;i++){
        X[i-1]={"attr":features[i],"value":T[i-1]}
    }
    X.sort(function(a,b) {
        if (a["value"] == b["value"]) {return d3.ascending(a["attr"], b["attr"])}
        else { return Math.abs(b["value"]) - Math.abs(a["value"]); }
    });

    return X;
}

function updateBarchart() {
    if(HighY.length>=1&&LowY.length>=1) {

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
    }

    if(HighX.length>=1&&LowX.length>=1) {
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
    }
}

function dragBar() {

}

function newCoordinate() {
    var newcoor=[];
    for(var i=0;i<totalNumber;i++) {
        var dx=0;
        var dy=0;
        var din_dropzone=""
        for(var j=0;j<featLength-1;j++){
            dx+=coordinates[i][j]*Tx[j]
            dy+=coordinates[i][j]*Ty[j]
        }
        if(coordinates[i].length===featLength) {
            din_dropzone=coordinates[i][featLength-1];
            newcoor[i]={"cdx":dx,"cdy":dy,"dindex":i,"din_dropzone":din_dropzone}
        }
        else{
            newcoor[i]={"cdx":dx,"cdy":dy,"dindex":i}
        }
    }
    return newcoor;
}

function renewScattarplot(data) {
    var self=this
    this.scplotView.selectAll("g").remove();
    var dx=[];
    var dy=[];
    for(var i=0;i<totalNumber;i++){
        dx.push(data[i].cdx)
        dy.push(data[i].cdy)
    }
    var xMin = Math.min.apply(null, dx);
    var xMax = Math.max.apply(null, dx);
    var yMin = Math.min.apply(null, dy);
    var yMax = Math.max.apply(null, dy);
    this.x = d3.scaleLinear()
        .domain([xMax, xMin])
        .range([this.width, 0]);
    this.scplotView.append("g")
        .attr("transform", "translate("+0+","+(canvasHeight-this.margin.bottom-dropSize*0.25)+")")
        .call(d3.axisBottom(this.x));

    this.y = d3.scaleLinear()
        .domain([yMax, yMin])
        .range([0, this.height]);
    this.scplotView.append("g")
        .attr("transform", "translate("+0+","+0+")")
        .call(d3.axisLeft(this.y));

    this.scplotView.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return self.x(d.cdx); } )
        .attr("cy", function (d) { return self.y(d.cdy); } )
        .attr("r", 5.0)
        .style("cursor", "resize")
        .style("fill", function (d) { if(d.din_dropzone){
            return "#23ee85"
        }})
        .call(drag_point)
        .on("mouseover", function(d) {
            console.log(d.dindex);
            buildTable(d.dindex);
            d3.select(this).style("fill-opacity", 1);
        })
        .on("mouseout", function(d){
            d3.select(this).style("fill-opacity",0.2)
        })
}