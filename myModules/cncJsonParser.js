//cncJsonParser
var SerialPort = require("serialport");
var buff = new Array();
var command= new Array();
var i=0;
var j=0;
var ctrlZ=0x1A;
//var analizePlace = new analize();
//var serialTransfer =new serial(analizePlace);
//var sms=new makeSMS(analizePlace,serialTransfer);
//var setSms=new smsSettings(analizePlace,serialTransfer);
//var grbl = new grblMove(analizePlace,serialTransfer);

//sms.prepareSms(782882182,"hi");
//var cncTest = new cnc();

function prepare(array){
    var oneElem;
    var elems="";
    var viewBox="";
    var svg = document.getElementById('test');
    for(var i=0;i<array.length;i++){
        oneElem=array[i];
        if(oneElem["type"]=="point"){
            elems+=defPoint();
            //makePoint(oneElem);
        }
        else if(oneElem["type"]=="board"){
            elems+=board(oneElem.params);
            viewBox="0 0 "+oneElem.params.x+10+ " "+oneElem.params.y+10;
            svg.setAttribute("viewBox", viewBox);
            svg.setAttribute("width", oneElem.params.x+20 + 'px');
            svg.setAttribute("height",oneElem.params.y+20 + "px");
        }
    }
    svg.innerHTML=elems;

}

    
    

function point (cx, cy,r) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="'+r+'" stroke="black" stroke-width="1" fill="red" />';
}
function svgBoard(){
    return
    
    
}
function defPoint() {
    return '<circle cx="0" cy="0" r="0" stroke="black" fill="red" />';
}
function board(par) {
    return '<rect x="10" y="10" width="'+par.x+'" height="'+par.y+'" fill="none" stroke="black"/>'
}

/*
[{type:"point",
params:{
    x:10,
    y:10,
    size:0.15
},
label:"Some info"
},
{type:"board",
params:{
x:30,
y:50
}}]
*/
function serial(where){
    var self=this;
    this.analizePlace=where;
    this.buff=new Array();
    this.command = new Array();
    this.answers =[];
    //this.port;
    //this.baudrate;
    this.begin=function(){
        
        this.serialport=new SerialPort("/dev/tty.usbmodem1421",{
            baudrate: 115200,
            parser: SerialPort.parsers.readline("!")
        });
        this.serialport.self=self;
        //console.log(this.serialport);
    
        self.serialport.on('open', function(){
            console.log('Serial Port Opend');
            self.serialport.on('data',function(data){
                console.log('nice try',JSON.stringify(data));
                data = data.replace(/(\r\n|\n|\r)/gm,"");
                if(data.length != 1){
                    self.buff.push({type:'data',value:data});
                }
                console.log('selftest',data);
                //j++;
            })
            self.serialport.on('end',function(){
                console.log('that\'s end');
                //j++;
            })
            
            this.dataInterval = setInterval(function(){
                if(self.command.length > 0){
                    var x = self.command.pop();
                    //console.log('commandInterval',x);
                    self.buff.push(x);
                    //self.serialport.write(0x80);
                
                    
                    
                    //self.serialport.write(x.value);
                    self.serialport.write(x.value);
                    
                }
                var find = self.buff.find(self.findComm);
                var index = self.buff.indexOf(find);
                if(index >-1){
                    if(self.buff.length >0){
                        if(self.buff[self.buff.length-1].type == 'data'){
                            var x =self.buff.pop().value;
                            //var res=x.substr(find.value)
                            //var x = ""
                            x=x.replace(find.value,"");
                            //console.log('find',);
                            //console.log('Com at index: '+self.buff[index]+' comand:'+x);
                            self.buff.splice(index,1);
                            self.answers.push({command:find,resp:x})
                        }
                    }    
                }
                else{
                    if(self.buff.length >0){
                        if(self.buff[self.buff.length-1].type == 'data'){
                            //console.log('just command: '+self.buff[self.buff.length-1].type);
                            self.answers.push({command:{},resp:self.buff.pop().value})
                        }
                    }
                }
                self.getAnswer();
            },100);
        });
    }
    this.findComm=function(x){
        return x.type === 'comm';
    }
    this.writeCommand =function(com){
        //console.log('some commands to write',com);
        this.command.push(com); 
    }
    this.getAnswer=function(){
        if(self.answers.length != 0){
            console.log('some answers');
            self.analizePlace.response(self.answers.pop());
        }
        else{
            //return {command:"",resp:""};
        }
    }   
}
function analize(){
    var self=this;
    this.allObjects=[]
    this.response=function(answer){
        if(answer.resp == 'MODEM:STARTUP'){
            console.log('wait for ready state..')
        }
        if(answer.resp == '+PBREADY'){
            setSms.prepareSms();
        }
        
        var id = answer.command.id;
        //console.log('id',id);
        if( id != undefined){
            for(var i=0;i<self.allObjects.length;i++){
                if(self.allObjects[i].isThere(id) == true){
                    self.allObjects[i].analizeAnswer(id,answer);
                    break;
                }
            }
        }
        else{
            console.log('some answers2',answer);
        }
    }   
}
function assumeResponse(aPlace,serial){
     aPlace.allObjects.push(this);
    //console.log("hi");
    var self=this;
    this.serialDest=serial;
    this.commands=[];
    this.commandsId=[];
    this.makeId = function(){
        return new Date().getTime();
    }
    this.isThere = function(id){
        if(self.commandsId.indexOf(id) > -1)
            return true;
        else
            return false;
    }
    this.commandToBuffer=function(command){
        var index = self.commands.length;
        var id=self.makeId();
        command['id']=id;
        //console.log('commBuff',command);
        self.commands[index] = command;
        self.commandsId[index] = id;
        //send to Analize
    }
    this.sendCommand=function(index){
        //console.log('ind',index);
        var com = self.commands[index];
        console.log('com2',com);
        if(com.commands.length > 0){
            var help= com.commands.pop();
            help['id']=com.id;
            self.serialDest.writeCommand(help);
            //console.log('send',help);
        }
        else{};
        
    }
}
function makeSMS(aPlace,serial){
    assumeResponse.call(this,aPlace,serial);
    //console.log(this);
    var self=this;
    this.smsBuffer=[];
    this.prepareSms=function(number,text){
        console.log('sending sms...')
        var com ={};
        com["commands"]=[];
        com.commands.push({type:"comm",mode:'end',value:new Buffer([0x1A])});
        com.commands.push({type:"comm",mode:'text',value:text});
        com.commands.push({type:"comm",mode:"command",command:"at+cmgs",value:'at+cmgs="'+number+'"'});
        self.commandToBuffer(com);
    }
    this.analizeAnswer=function(id,answer){
        var index = self.commandsId.indexOf(id);
        //console.log('indd',index);
        var comm =self.commands[index];
        if(answer.command.mode == 'end'){
            if(answer.resp != 'ERROR'){
                console.log('sms sent');
            }
            else{
                console.log(answer.resp);
                console.log('some problems occure in sending sms')
            }
        }
        else{
            console.log('command',answer.command.value);
            console.log('answer',answer.resp);
        }
        self.sendCommand(index);
    }
    
    this.sendSms=function(){
        self.sendCommand(self.commands.length-1);
    }
}
function grblMove(aPlace,serial){
    assumeResponse.call(this,aPlace,serial);
    cnc.call(this);
    //console.log(this);
    var self=this;
    this.smsBuffer=[];
    this.runFile=function(fileArray){
        var com = self.file(fileArray)
        self.commandToBuffer(com);
        self.sendCommand(self.commands.length-1);
    }

    this.exTest=function(commandArray){
        var com ={}
        com["commands"]=[];
        for(var i=0;i<commandArray.length;i++){
            com.commands.push({type:"comm",mode:"command",command:'G',value:commandArray[i].toUpperCase() });   
        }
        self.commandToBuffer(com);
        self.sendCommand(self.commands.length-1);
        
    }
    this.file=function(splitByLineArray){
        var commName;
        var com ={}
        com["commands"]=[];
        for(var i=0;i<splitByLineArray.length;i++){
           commName = splitByLineArray[i].slice(0,splitByLineArray[i].indexOf('')); com.commands.push({type:"comm",mode:"command",command:commName,value:splitByLineArray[i]})
        }
        return com;
    }
    this.analizeAnswer=function(id,answer){
        var index = self.commandsId.indexOf(id);
        //console.log('indd',index);
        var comm =self.commands[index];
        //console.log('settings', answer);
        if(answer.resp == 'OK'){
            console.log('ok');
            //self.sendCommand(index);
        }
        else{
            console.log('ops, some problem: ')
            console.log(comm)
            console.log(answer);
        }
         self.sendCommand(index);
    }
}
function smsSettings(aPlace,serial){
    assumeResponse.call(this,aPlace,serial);
    //console.log(this);
    var self=this;
    this.smsBuffer=[];
    this.prepareSms=function(){
        console.log('settings for sms sending...')
        var com ={}
        var x='';
        com["commands"]=[];
        com.commands.push({type:"comm",mode:"command",command:"at+cmgf",value:"at+cmgf=1"});
        com.commands.push({type:"comm",mode:"command",command:"at+cscs",value:'at+cscs="gsm"'});
        self.commandToBuffer(com);
        self.sendCommand(self.commands.length-1);
    }
    this.analizeAnswer=function(id,answer){
        var index = self.commandsId.indexOf(id);
        //console.log('indd',index);
        var comm =self.commands[index];
        //console.log('settings', answer);
        if(answer.resp == 'OK'){
            console.log('ok');
            self.sendCommand(index);
        }
        else{
            console.log('ops, some problem: ')
            console.log(comm)
            console.log(answer);
        }
    }
}
var exMovement = [
    "G x150 y150",
    "G y-150",
    "G x-150",
    "G y150",
    "G x150",
    "G x-150 y-150"
]
function cnc(){
    var self = this;
    this.pos={
        x:0,
        y:0,
        z:0
    }
    this.speed=0;
    this.unit = 'cm';
    this.scaleFactor = 50;
//params
    //pos (x y z )
    //speed ( )
    //scale factor
    //unit
    //file
//method
    //attachFile
    //analize path
    //goToPoint
    //makeDot(size)
    //moveAbsolute
    this.updatePos=function(absPos){
        self.pos.x+=absPos['xVal']
        self.pos.y+=absPos['yVal']
        self.pos.z+=absPos['zVal']
    }
    this.readPos=function(){
        var pos ={
            xVal:self.pos.x,
            yVal:self.pos.y,
            zVal:self.pos.z,
            
        }
        return pos;
    }
    this.clearPos=function(){
        self.pos={
            x:0,
            y:0,
            z:0
        }
        return self.pos;
    }
    this.moveAbsolute=function(absPos){
        var com =self.prepareCommand("move",absPos);
        //console.log('com',com1);
        self.updatePos(absPos);
        self.run(com);
        
    }
    this.run=function(com){
        var comBuff ={};
        comBuff["commands"]=[];
        comBuff.commands.push({type:"comm",mode:"command",command:com.charAt(0),value:com})
        //com.commands.push(com1);
        self.commandToBuffer(comBuff);
        self.sendCommand(self.commands.length-1);
    }
    this.fromArr=function(arr){
        var pos={
            xVal:arr[0],
            yVal:arr[1],
            zVal:arr[2]
        }
        return pos;
    }
    this.moveTo=function(pointLocalization){
        var absPos={
            xVal:pointLocalization['xVal']-self.pos.x,
            yVal:pointLocalization['yVal']-self.pos.y,
            zVal:pointLocalization['zVal']-self.pos.z
        }
        var com =  self.prepareCommand("move",absPos);
        self.updatePos(absPos);
        self.run(com);
    }
    this.prepareCommand=function(type,params){
        var typeList=["move","speed"];
        var val =typeList.indexOf(type);
        var com=""
            switch(val){
                case 0:
                    var com =  "G X"+params['xVal']*self.scaleFactor+" Y"+params['yVal']*self.scaleFactor+" Z"+params['zVal']*self.scaleFactor;
                break;
            }
        return com;
    }
    //clear
}
exports.gcode = grblMove; 
exports.analizePlace = analize; 
exports.serialTransfer = serial; 