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

function newCoordinate() {
    var newcoor=[];
    var init = true;
    for(var i=0;i<totalNumber;i++) {
        var dx=0;
        var dy=0;
        var din_dropzone=""
        for(var j=0;j<featLength-1;j++){
            dx+=coordinates[i][j]*Tx[j]
            dy+=coordinates[i][j]*Ty[j]
        }
        if(init) {
            curMaxX = dx;
            curMaxY = dy;
            curMinX = dx;
            curMinY = dy;
            init = false;
        } else {
            if(dx < curMinX) curMinX = dx;
            if(dx > curMaxX) curMaxX = dx;
            if(dy < curMinY) curMinY = dy;
            if(dy > curMaxY) curMaxY = dy;
        }
        if(coordinates[i].length===featLength) {
            din_dropzone=coordinates[i][featLength-1];
            newcoor[i]={"cdx":dx,"cdy":dy,"dindex":i,"din_dropzone":din_dropzone, "color": "#A5A5CA"}
        }
        else{
            newcoor[i]={"cdx":dx,"cdy":dy,"dindex":i, "color": "#A5A5CA"}
        }
    }
    return newcoor;
}

function renewScattarplot(data) {
    if(dragged == false) {
        dragged = true;
    }
    data = calculateColor(data);
    var dupWeights = JSON.parse(JSON.stringify(colorWeight));
    dupWeights.sort(function(a, b) {
        var keyA = a.weight,
            keyB = b.weight;
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
    });
    buildTopList(dupWeights);

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
        .style("fill", function (d) {if(d.din_dropzone){
            return "#23ee85"
        } else return d["color"]})
        .call(drag_point)
        .on("mouseover", function(d) {
            //console.log(d.dindex);
            buildTable(d.dindex);
            buildTopList(dupWeights);
            d3.select(this).style("fill-opacity", 1);
        })
        .on("mouseout", function(d){
            d3.select(this).style("fill-opacity",0.2)
        })

}

function calculateColor(data) {
    var hx = (curMaxX - curMinX) / 2;
    var hy = (curMaxY - curMinY) / 2;
    for(var i = 0; i < totalNumber; i++) {
        if(data[i].cdx < curMinX+hx && data[i].cdy < curMinY+hy) {
            colorWeight[i].weight = colorWeight[i].weight + 0;
        }
        else if(data[i].cdx < curMinX+hx && data[i].cdy >= curMinY+hy) {
            colorWeight[i].weight = colorWeight[i].weight + 1;
        }
        else if(data[i].cdx >= curMinX+hx && data[i].cdy < curMinY+hy) {
            colorWeight[i].weight = colorWeight[i].weight + 1;
        }
        else {
            colorWeight[i].weight = colorWeight[i].weight + 2;
        }
    }
    var tempWeights = []
    for(var i = 0; i < totalNumber; i++) {
        tempWeights.push(colorWeight[i].weight);
    }
    var maxw = Math.max.apply(null, tempWeights);
    var minw = Math.min.apply(null, tempWeights);
    var step = (maxw - minw) / 5;
    console.log(maxw, minw, step);
    for(var i = 0; i < totalNumber; i++) {
        if(colorWeight[i].weight <= minw+step) {
            colorValue.push(colorList[0]);
            data[i]["color"] = colorList[0];
        }
        else if(colorWeight[i].weight <= minw+step*2) {
            colorValue.push(colorList[1]);
            data[i]["color"] = colorList[1];
        }
        else if(colorWeight[i].weight <= minw+step*3) {
            colorValue.push(colorList[2]);
            data[i]["color"] = colorList[2];
        }
        else if(colorWeight[i].weight <= minw+step*4) {
            colorValue.push(colorList[3]);
            data[i]["color"] = colorList[3];
        }
        else {
            colorValue.push(colorList[4]);
            data[i]["color"] = colorList[4];
        }
    }
    return data;
}