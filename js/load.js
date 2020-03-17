var scplot;
var rawData = {};
var coordinates = [];
var initialCoordinates = null;
var datasets = ["Cars", "Pokemon"];
var featureList = {Cars: ["Vehicle Name", "Small/Sporty/", "Compact/Large Sedan", "Sports Car", "SUV", "Wagon", "Minivan", "AWD", "RWD", "Retail Price",
                            "Dealer Cost", "Engine Size (l)", "Cyl", "HP", "City MPG", "Hwy MPG", "Weight", "Wheel Base", "Len", "Width"],
                    Pokemon: ["Name", "HP", "Attack", "Defense", "Sp_Atk", "Sp_Def", "Speed", "Generation", "isLegendary", "hasGender", "Pr_Male",
                        "hasMegaEvolution", "Height_m", "Weight_kg", "Catch_Rate"]};
var nameLabelList = {Cars: "Vehicle Name", Pokemon: "Name"};
var datasetUrlList = {Cars: "dataset/04cars data_clean.csv", Pokemon: "dataset/pokemon_clean.csv"};
var features = null;
var nameLabel = null;
var featLength = null;
var datasetUrl = null;

var totalNumber = 0;
var currentXAxis = 13; // 1 - 19
var currentYAxis = 9;
var defaultXaxis = 13;
var defaultYaxis = 9;
var dropSize = 80;
var dropRad = 15;
var canvasWidth = 1230;
var canvasHeight = 780;

//store the points in dropzone
var HighY=[];
var HighX=[];
var LowY=[];
var LowX=[];
//var Tx=new Array(featLength-1).fill(0)
//var Ty=new Array(featLength-1).fill(0)
var Tx = null;
var Ty = null;

var startColor = "#A5A5CA";
var endColor = "#FE5F2B";
var colorList = null;
var colorWeight = [];
var colorValue = [];
var dragged = false;
var curMinX = 0;
var curMinY = 0;
var curMaxX = 1;
var curMaxY = 1;

var referenceData=[];

function loadData() {
    features = featureList["Cars"];
    nameLabel = nameLabelList["Cars"];
    datasetUrl = datasetUrlList["Cars"];
    featLength = features.length;
    Tx=new Array(featLength-1).fill(0)
    Ty=new Array(featLength-1).fill(0)

    //initialize selections
    //dataset select
    var selectD = document.getElementById("dataset-select");
    for(var i = 0; i < datasets.length; i++) {
        var opt = document.createElement('option');
        opt.appendChild(document.createTextNode(datasets[i]));
        opt.value = datasets[i];
        selectD.appendChild(opt);
    }
    selectD.selectedIndex = 0;

    updateAttributeSelection(0);

    //load data
    loadDataset(datasetUrl);
}

function loadDataset(datasetUrl) {
    coordinates = [];
    referenceData = [];
    rawData = {};
    for(var i = 0; i < featLength; i++) {
        rawData[features[i]] = [];
    }
    console.log(datasetUrl);
    d3.csv(datasetUrl, function(data) {
        totalNumber = data.length;
        //get num of rows
        //console.log(totalNumber)
        for(var i = 0; i< data.length; i++){
            var object = {dindex: i, ditemName: data[i][nameLabel]};
            referenceData.push(object);
            colorWeight.push({weight: 0, index: i});
        }
        for(var i = 0; i < data.length; i++) {
            coordinates.push(new Array());
            for(var j = 0; j < featLength; j++) {
                var feat = features[j];
                rawData[feat].push(data[i][feat])
            }
        }

        for(var i = 1; i < featLength; i++) {
            var featMax = Math.max.apply(null, rawData[features[i]]);
            var featMin = Math.min.apply(null, rawData[features[i]]);
            //console.log(features[i], featMin, featMax);
            for(var j = 0; j < data.length; j++) {
                var cood;
                if(i === 6) cood = 0;
                else cood = (rawData[features[i]][j] - featMin)/(featMax - featMin);
                if(cood < 0 || cood > 1) console.log(cood);
                coordinates[j].push(cood);
            }
        }

        initialCoordinates = copyCoordinates(coordinates);
        draw();
        buildTable(-1);

        colorList = new gradientColor(startColor,endColor, 5);
        console.log(colorList);
        colorList.forEach(function (color, index) {
            var cid = "c-" + index;
            document.getElementById(cid).style.backgroundColor = color;
        });
    })
}

function draw() {
    var cdx = [], cdy = [];
    for(var i = 0; i < totalNumber; i++) {
        cdx.push(coordinates[i][currentXAxis-1]);//加了个-1，因为这个没有第一列的车名，所以要往前数一个
        cdy.push(coordinates[i][currentYAxis-1]);
    }
    var dataToDraw = {featureX: features[currentXAxis], coordsX: cdx,
                      featureY: features[currentYAxis], coordsY: cdy};

    Ty.fill(0);
    Tx.fill(0);
    Ty[currentYAxis-1]=1;
    Tx[currentXAxis-1]=1;

    var conf = {};

    d3.selectAll("svg").remove();
    scplot = ScatterPlot(dataToDraw, conf);
}

updateSelction = function(axis, value) {
    if(axis === 0) {
        var myselect=document.getElementById("x-select")
        var index=myselect.selectedIndex;
        if(index<featLength-1){
            currentXAxis = features.indexOf(value);
            draw();
        }else{
            var stringResult = myselect.options[index].value.split(',');
            Tx=stringResult;
            renewScattarplot(newCoordinate());
            updateBarchart();
        }
    }else{
        var myselect=document.getElementById("y-select")
        var index=myselect.selectedIndex;
        if(index<featLength-1){
            currentYAxis = features.indexOf(value);
            draw();
        }else{
            var stringResult = myselect.options[index].value.split(',');
            Ty=stringResult;
            renewScattarplot(newCoordinate());
            updateBarchart();
        }
    }
}

function updateAttributeSelection(t) {
    //initialize selections
    //x axis select
    var selectX = document.getElementById("x-select");
    if(t == 1) {
        var L = selectX.options.length-1;
        for(var i = L; i >= 0; i--) {
            selectX.options[i] = null;
        }
    }
    for(var i = 1; i < featLength; i++) {
        var opt = document.createElement('option');
        opt.appendChild(document.createTextNode(features[i]));
        opt.value = features[i];
        selectX.appendChild(opt);
    }
    selectX.selectedIndex = currentXAxis-1;
    //y axis select
    var selectY = document.getElementById("y-select");
    if(t == 1) {
        var L = selectY.options.length-1;
        for(var i = L; i >= 0; i--) {
            selectY.options[i] = null;
        }
    }
    for(var i = 1; i < featLength; i++) {
        var opt = document.createElement('option');
        opt.appendChild(document.createTextNode(features[i]));
        opt.value = features[i];
        selectY.appendChild(opt);
    }
    selectY.selectedIndex = currentYAxis-1;
}

selectDataset = function(ds) {
    features = featureList[ds];
    nameLabel = nameLabelList[ds];
    datasetUrl = datasetUrlList[ds];
    featLength = features.length;

    updateAttributeSelection(1);
    loadDataset(datasetUrl);
    resetHistory();
}

ScatterPlot = function (dataToDraw, conf) {
    var self = this;

    this.margin = {top: 20, bottom: 240, left: 400, right: 30};
    this.width = canvasWidth - this.margin.left - this.margin.right;
    this.height = canvasHeight - this.margin.top - this.margin.bottom;

    this.svg = d3.select("#controlPanel")
        .append("svg")
        .attr("id", "canvas")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom);

    //scatterplot
    this.scplotView = this.svg.append("g")
        .attr("id", "scatterplot")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    var xMin = Math.min.apply(null, dataToDraw.coordsX);
    var xMax = Math.max.apply(null, dataToDraw.coordsX);
    var yMin = Math.min.apply(null, dataToDraw.coordsY);
    var yMax = Math.max.apply(null, dataToDraw.coordsY);
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


    this.plot = this.scplotView.append("rect")
        .attr("width", this.width)
        .attr("height", this.height)
        .style("fill", "#EEEEEE")
        .attr("pointer-events", "all");


    var data = [];
    for(var i = 0; i < dataToDraw.coordsX.length; i++) {
        var obj = {dx: dataToDraw.coordsX[i], dy: dataToDraw.coordsY[i], dindex: referenceData[i].dindex, ditemNam: referenceData[i].ditemName};
        data.push(obj);
    }

    this.scplotView.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return self.x(d.dx); } )
        .attr("cy", function (d) { return self.y(d.dy); } )
        .attr("r", 5.0)
        .style("cursor", "resize")
        .call(drag_point)
        .on("mouseover", function(d) {
            console.log(d.dindex);
            buildTable(d.dindex);
            d3.select(this).style("fill-opacity", 1);
        })
        .on("mouseout", function(d){
            d3.select(this).style("fill-opacity",0.2)
        })


    //dropzones
    this.dropzoneView = this.svg.append("g")
        .attr("id", "dropzones");
    this.dropzoneView.append("g")
        .attr("id", "highendY")
        .append("rect")
        .attr("x", this.margin.left-dropSize*1.5)
        .attr("y", this.margin.top)
        .style("fill", "#85cc85");
    this.dropzoneView.append("g")
        .attr("id", "lowendY")
        .append("rect")
        .attr("x", this.margin.left-dropSize*1.5)
        .attr("y", canvasHeight-this.margin.bottom-dropSize)
        .style("fill", "#85cc85")
    this.dropzoneView.append("g")
        .attr("id", "lowendX")
        .append("rect")
        .attr("x", this.margin.left)
        .attr("y", canvasHeight-this.margin.bottom+dropSize*0.25)
        .style("fill", "#85cc85");
    this.dropzoneView.append("g")
        .attr("id", "highendX")
        .append("rect")
        .attr("x", canvasWidth-this.margin.right-dropSize)
        .attr("y", canvasHeight-this.margin.bottom+dropSize*0.25)
        .style("fill", "#85cc85");
    this.dropzoneView.selectAll("rect")
        .attr("width", dropSize)
        .attr("height", dropSize)
        .attr("rx", dropRad)
        .attr("ry", dropRad)
        .on("mouseover", function(d) {
            d3.select(this).style("stroke", "black")
                           .style("stroke-width", 2 )
                           .style("opacity", 0.5);
        })
        .on("mouseout", function(d){
            d3.select(this).style("stroke",null)
                           .style("opacity",1)
        })

    var showX;
    var showY;
    showX=sortAbs(Tx);
    showY=sortAbs(Ty);

    var showFeatureX=showX.slice(0,13)
    var showFeatureY=showY.slice(0,13)

    //y axis
    this.yAxisView = this.svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", "translate(30,"+110+")");
    xScale_y = d3.scaleLinear()
        .range([this.margin.left - 120, 0])
        .domain([Math.max.apply(null,Ty),Math.min.apply(null,Ty)]);
    this.yAxisView.append("g")
        .attr("transform", "translate(45,20)")
        .call(d3.axisTop(xScale_y));

    yScale_y = d3.scaleBand()
        .range([0, this.height-dropSize*2-20])
        .domain(showFeatureY.map(function(d) {return d["attr"]}))
        .padding(0.04)
    this.yAxisView.append("g")
        .attr("transform", "translate(45,20)")
        .call(d3.axisLeft(yScale_y));

    var dragBar = this.yAxisView
        .selectAll(".bar")
        .data(showFeatureY)
        .enter().append("rect")
        .style("fill",function(d) { return d["value"] < 0 ? "brown":"steelblue"})
        .attr("x", function(d) { return xScale_y(Math.min(0, d["value"]))+45; })
        .attr("y", function(d) { return yScale_y(d["attr"])+28; })
        .attr("width", function(d) { if (d["value"]==0) {return 2;} else {return Math.abs(xScale_y(d["value"]) - xScale_y(0));} })
        .attr("height", 10)
        .attr("fill-opacity", 0.8);

    //x axis
    // var xavLeft = this.margin.left+dropSize+10,
    //     xavTop = canvasHeight-this.margin.bottom+dropSize*0.25;
    this.xAxisView = this.svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", "translate(490,"+560+")");

    const xScale_x = d3.scaleLinear()
        .range([this.width-dropSize*2-120, 0])
        .domain([Math.max.apply(null,Tx),Math.min.apply(null,Tx)]);
    this.xAxisView.append("g")
        .attr("transform", "translate(60,20)")
        .call(d3.axisTop(xScale_x));

    const yScale_x = d3.scaleBand()
        .range([0, this.margin.bottom-40])
        .domain(showFeatureX.map(function(d) {return d["attr"]}))
        .padding(0.015)
    this.xAxisView.append("g")
        .attr("transform", "translate(60,20)")
        .call(d3.axisLeft(yScale_x));

    var dragBar = this.xAxisView
        .selectAll(".bar")
        .data(showFeatureX)
        .enter().append("rect")
        .style("fill",function(d) { return d["value"] < 0 ? "brown":"steelblue"})
        .attr("x", function(d) { return xScale_x(Math.min(0, d["value"]))+60; })
        .attr("y", function(d) { return yScale_x(d["attr"])+22; })
        .attr("width", function(d) { if (d["value"]==0) {return 2;} else {return Math.abs(xScale_x(d["value"]) - xScale_x(0));} })
        .attr("height", 10)
        .attr("fill-opacity", 0.8);

}


function buildTable(index) {
    d3.select("#dataPanel").selectAll("table").remove();
    var vname = (index === -1) ? nameLabel : rawData[features[0]][index];
    //console.log(rawData[features[0]][index])

    var table = d3.select("#dataPanel").append("table")
        .attr("style", "margin-left: 5px; margin-top: 20px;");
    var thead = table.append("thead");
    var tbody = table.append("tbody");

    var data = [];
    var item0 = ["key", "value"];
    for(var i = 1; i < featLength; i++) {
        var feat = {key: features[i], value: (index === -1) ? "" : rawData[features[i]][index]};
        data.push(feat);
    }

    var item1 = [vname, ""];
    thead.append("tr")
        .selectAll("th")
        .data(item1)
        .enter()
        .append("th")
        .text(function(column) { return column; });

    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    var cells = rows.selectAll("td")
        .data(function(row) {
            return item0.map(function(column) {
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td")
        .html(function(d) { return d.value; });
}

function buildTopList(data) {
    d3.select("#top10").selectAll("table").remove();

    var data2 = [];
    for(var i = 0; i < 10; i++) {
        var dt = {Name: rawData[nameLabel][data[i].index]}
        data2.push(dt);
    }

    var table = d3.select("#top10").append("table")
        .attr("style", "margin-left: 5px; margin-top: 20px;");
    var thead = table.append("thead");
    var tbody = table.append("tbody");

    var item1 = ["Top 10 Items"];
    var item0 = ["Name"];
    thead.append("tr")
        .selectAll("th")
        .data(item1)
        .enter()
        .append("th")
        .text(function(column) { return column; });

    var rows = tbody.selectAll("tr")
        .data(data2)
        .enter()
        .append("tr");

    var cells = rows.selectAll("td")
        .data(function(row) {
            return item0.map(function(column) {
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td")
        .html(function(d) { return d.value; });
}

function copyCoordinates(coords) {
    var dupCoords = [];
    for(var i = 0; i < coordinates.length; i++) {
        dupCoords.push([]);
        for(var j = 0; j < coordinates[i].length; j++) {
            dupCoords[i][j] = coordinates[i][j];
        }
    }
    return dupCoords;
}

//set colors
let gradientColor = function (startColor, endColor, step) {
    let startRGB = this.colorRgb(startColor);
    let startR = startRGB[0];
    let startG = startRGB[1];
    let startB = startRGB[2];

    let endRGB = this.colorRgb(endColor);
    let endR = endRGB[0];
    let endG = endRGB[1];
    let endB = endRGB[2];

    let sR = (endR - startR) / step;
    let sG = (endG - startG) / step;
    let sB = (endB - startB) / step;

    let colorArr = [];
    for (let i = 0; i < step; i++) {
        let hex = this.colorHex('rgb('+ parseInt((sR * i + startR))+ ',' + parseInt((sG * i + startG))+ ',' +
            parseInt((sB * i + startB)) + ')');
        colorArr.push(hex);
    }
    return colorArr;
};

gradientColor.prototype.colorRgb = function (sColor) {
    let reg = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
    sColor = sColor.toLowerCase();
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            let sColorNew = "#";
            for (let i = 1; i < 4; i += 1) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
        }

        let sColorChange = [];
        for (let i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
        }
        return sColorChange;
    } else {
        return sColor;
    }
};

gradientColor.prototype.colorHex = function (rgb) {
    let _this = rgb;
    let reg = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
    if (/^(rgb|RGB)/.test(_this)) {
        let aColor = _this.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        let strHex = "#";
        for (let i = 0; i < aColor.length; i++) {
            let hex = Number(aColor[i]).toString(16);
            hex = hex < 10 ? 0 + '' + hex : hex;
            if (hex === "0") {
                hex += hex;
            }
            strHex += hex;
        }
        if (strHex.length !== 7) {
            strHex = _this;
        }
        return strHex;
    } else if (reg.test(_this)) {
        let aNum = _this.replace(/#/, "").split("");
        if (aNum.length === 6) {
            return _this;
        } else if (aNum.length === 3) {
            let numHex = "#";
            for (let i = 0; i < aNum.length; i += 1) {
                numHex += (aNum[i] + aNum[i]);
            }
            return numHex;
        }
    } else {
        return _this;
    }
};
