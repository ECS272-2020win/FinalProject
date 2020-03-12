function calculateDropzone() {
    var VectorHY = [];
    var VectorLY = [];
    var VectorHX = [];
    var VectorLX = [];

    if(HighY.length>=1&&LowY.length>=1){
        for(var i=1;i<featLength;i++){
            var value=0;
            for(var j=0;j<HighY.length;j++){
                value+=parseInt(rawData[features[i]][HighY[j]['dindex']])
            }
            VectorHY.push(value/HighY.length);
        }
        for(var i=1;i<featLength;i++){
            var value=0;
            for(var j=0;j<LowY.length;j++){
                value+=parseInt(rawData[features[i]][LowY[j]['dindex']])
            }
            VectorLY.push(value/LowY.length);
            Ty.push(VectorHY[i-1]-VectorLY[i-1])
        }
    }

    if(HighX.length>=1&&LowX.length>=1){
        for(var i=1;i<featLength;i++){
            var value=0;
            for(var j=0;j<HighX.length;j++){
                value+=parseInt(rawData[features[i]][HighX[j]['dindex']])
            }
            VectorHX.push(value/HighX.length);
        }

        for(var i=1;i<featLength;i++){
            var value=0;
            for(var j=0;j<LowX.length;j++){
                value+=parseInt(rawData[features[i]][LowX[j]['dindex']])
            }
            VectorLX.push(value/LowX.length);
            Tx.push(VectorHX[i-1]-VectorLX[i-1])
        }
    }
}