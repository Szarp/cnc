//read from gerber file points

var readline=require('readline'),
    fs = require('fs');
const testFolder = '/Users/bartek/gitrepo/bin/eagle/gerber/';

var y = new gerber();
y.splitByEnter("gerber",function(tab){
    y.splitForPositions(tab);
    
});
function define(){
    this.commands={
        "D10":{
            name:"D10",
            type:"rectangle",
            "sizeX":1,
            "sizeY":1,
            unit:"mm"
        },
        "D11":{
            name:"D11",
            type:"rectangle",
            "sizeX":1.25,
            "sizeY":2,
            unit:"mm"
        },
        "D12":{
            name:"D12",
            type:"rectangle",
            "sizeX":1.4,
            "sizeY":0.8,
            unit:"mm"
        },
        "D13":{
            name:"D13",
            type:"rectangle",
            "sizeX":0.6,
            "sizeY":1.1,
            unit:"mm"
        }
        
    }
    
}

var x ="dsdfdfsdf";
function gerber(){
    define.call(this);
    var self=this;
    this.lastType=""
    this.splitForPositions = function(tab){
        var points=[];
        var index=0;
        tab.forEach(function(line){
            var par={"id":"0","x":23.3979,"y":4.5371};
            if(line[0]=="D"){
                //console.log(line.substring(0,3));
                self.lastType=line.substring(0,3);
            }
            if(line[0]=="X"){
                index++;
                par["id"]=index;
                par["x"]=Number(line.substr(1,5)/1000);
                par["y"]=Number(line.substr(7,5)/1000);
                par["params"]=self.commands[self.lastType];
                points[points.length]=par
                //console.log(self.commands["D10"]);
                //console.log(self.lastType);
                //console.log(line.substr(1,6));
            }
        });
        console.log(JSON.stringify(points));
    }
    this.splitByEnter=function(destination,callback){
    var tab=[];
    var index1=0;
    var file = readline.createInterface({
        input: fs.createReadStream(testFolder+destination)
    });
    file.on('line',function(line){
        tab[tab.length]=line;
    })
    file.on('close', function (line) {
            console.log(tab);
            setImmediate(function() {
                callback(tab);
            });
    });
}

}