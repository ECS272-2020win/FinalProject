function saveBtn(axis) {
    if(axis==0){
        var selectX=document.getElementById("x-select")
        var opt = document.createElement('option');
        var number=selectX.options.length;
        opt.appendChild(document.createTextNode("X"+(number+1-featLength)));
        opt.value = Tx;
        selectX.appendChild(opt);
    }
    if(axis==1){
        var selectY=document.getElementById("y-select")
        var opt = document.createElement('option');
        var number=selectY.options.length;
        opt.appendChild(document.createTextNode("Y"+(number+1-featLength)));
        opt.value = Ty;
        selectY.appendChild(opt);
    }
}

function clearBtn(axis){
    if(axis==0){
        Tx.fill(0);
        Tx[defaultXaxis-1]=1;
        HighX=[];
        HighY=[];
        LowX=[];
        LowY=[];
        for(var i=0;i<totalNumber;i++){
            if(coordinates[i].length==featLength){
                coordinates[i].pop();
            }
        }
        var myselect=document.getElementById("x-select")
        myselect.options[defaultXaxis-1].selected=true;
        updateBarchart();
        renewScattarplot(newCoordinate());
        updateDropzone("HighX",HighX)
        updateDropzone("LowX",LowX)
    }
    if(axis==1){
        Ty.fill(0);
        Ty[defaultYaxis-1]=1;
        HighX=[];
        HighY=[];
        LowX=[];
        LowY=[];
        for(var i=0;i<totalNumber;i++){
            if(coordinates[i].length==featLength){
                coordinates[i].pop();
            }
        }
        this.scplotView
            .selectAll("circle")
            .attr("din_dropzone", null)
            .style("cursor", "resize");
        updateBarchart();
        renewScattarplot(newCoordinate());
        updateDropzone("HighY",HighY)
        updateDropzone("LowY",LowY)
    }
}

function resetScatterPlot() {
    //console.log("clicked");
    HighX = []
    HighY = []
    LowX = []
    LowY = []
    dragged = false;
    currentYAxis = defaultYaxis;
    currentXAxis = defaultXaxis;
    for(var i = 0; i < totalNumber; i++) {
        if(coordinates[i].length == featLength) {
            coordinates[i].pop();
        }
    }
    coordinates = copyCoordinates(initialCoordinates);
    draw();
}

function resetHistory() {
    colorWeight = []
    for(var i = 0; i < coordinates.length; i++) {
        colorWeight.push({weight: 0, index: i});
    }
    resetScatterPlot()
}