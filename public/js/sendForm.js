var settings1 = {};
//var settings2={};
var set=new traslateSettings();
var clssList=[];

var patternOfDisplay = [
    'typ',
    'klasa',
    'grupa',
    'lekcja',
    'przedmiot',
    'nauczyciel',
    'sala',
    'komentarz',
    'rodzaj'
]
var btnEvents ={
    saveBtn:function(){takeValuesFromForm()},
    generateBtn:function(){tokenValidation('generateToken')},
    checkBtn:function(){tokenValidation('checkToken')},
    //upArr:function(){cncActions("move",[1,0,0],this)},
    //downArr:function(){cncActions("move",[-1,0,0])},
    upArrWork:function(){cncActions("work",[1,0,0])},
    downArrWork:function(){cncActions("work",[-1,0,0]);setTimeout(function(){cncActions("work",[1,0,0]);},1000)},
    //leftArr:function(){cncActions("move",[0,1,0])},
    //rightArr:function(){cncActions("move",[0,-1,0])},
    //topArr:function(){cncActions("move",[0,0,1])},
    control:function(){movePannnels("controlPannel")},
    work:function(){movePannnels("workPannel")},
    //bottomArr:function(){cncActions("move",[0,0,-1])},
    clearBtn:function(){cncActions("setZero")}
}
function movePannnels(name){
    btnClicked(name);
    var pannelList = ["controlPannel","workPannel"];
    var el;
    for (var i=0; i<pannelList.length;i++){
        el= document.getElementById(pannelList[i]);
        if(pannelList[i] != name)
            el.style.display = "none"
        else
            el.style.display = ""
    }
}
//setTimeout(function(){makeCheckbox("onePanel_checklist",[10,1,0.1],"checkbox");},2000);

function clear(self){
    
    console.log(parent);
    
}
var panel = new Panel();
setTimeout(function(){console.log(panel.addPanel("controlPannel",{
        checkbox:[10,1,0.1],
        checked:-1,
        ulClass:"checkbox",
        arrayDirection:["left","right"],
        arrayEvents:[function(){cncActions("move",[1,0,0],this)},function(){cncActions("move",[-1,0,0],this)}],
        id:"xPanel",
        name:"X panel"
    }));
    panel.addPanel("controlPannel",{
        checkbox:[10,1,0.1],
        checked:-1,
        ulClass:"checkbox",
        arrayDirection:["up","down"],
        arrayEvents:[function(){cncActions("move",[0,1,0],this)},function(){cncActions("move",[0,-1,0],this)}],
        id:"yPanel",
        name:"Y panel"
    });
    panel.addPanel("controlPannel",{
        checkbox:[10,1,0.1],
        checked:-1,
        ulClass:"checkbox",
        arrayDirection:["up","down"],
        arrayEvents:[function(){cncActions("move",[0,0,1],this)},function(){cncActions("move",[0,0,-1],this)}],
        id:"zPanel",
        name:"Z panel"
    });
                     },1000);
function Panel(){
    var self=this;
    this.panelList=[];
    /*var panelDataEx={
        checkbox:[10,1,0.1],
        checked:-1,
        ulClass:"checkbox",
        arrayDirection:["up","down"],
        id:"onePanel"
    }*/
    this.addPanel=function(dest,json){
        //var newPanel = self.createPanel(json)
        //self.createTable(dest,json);
        var newPanel=self.prepareTable(json);
        //console.log(document.getElementById(dest));
        document.getElementById(dest).innerHTML+=newPanel;
        self.panelList.push(json);
        self.makeCheckbox(json);
        self.updateEventsToCheckbox(dest);
        self.updateEventsToArrays(dest);
        
    }
    this.prepareTable=function(json){
        return '<table id="'+json["id"]+'" class="arrays"><tr><td colspan="2">'+json["name"]+'</td></tr><tr><td colspan="2" id="'+json["id"]+'_checkbox"></td></tr><tr>'+self.prepareArrays(json["id"],json["arrayDirection"])+'</tr></table>';
    }
    this.prepareArrays=function(id,arrays){
        eventsAttach.call(this);
        var elems=""
        var marks={
            up:"&uarr;",
            down:"&darr;",
            left:"&larr;",
            right:"&rarr;"
        }
        for(var i=0;i<2;i++){
            elems+='<td id="'+id+'_'+arrays[i]+'">'+marks[arrays[i]]+'</td>';
        }
        return elems;
    }
    this.checkValues = function(self){
        var list = self.parentElement.parentElement;
        var input= list.getElementsByTagName('input');
        //console.log("s",input);
        var i;
        var index=null;
        for(i=0;i<input.length;i++){
            if(input[i].checked == true){
                return input[i].value;
                //break;
            }
        }
        return 0;
    }
    this.makeCheckbox = function(json){
        var el='<ul class="'+json["ulClass"]+'">';
        var params = json["checkbox"];
        for(var i=0;i<params.length;i++){
            el += "<li>";
            el +='<input type="checkbox"  name="multiplier" value="'+params[i]+'"><label>'+params[i]+'</label>';
            el+= "</li>";
            //base.appendChild(el);
        }
        el+="</ul>";
        var  dest = json["id"]+"_checkbox";
        document.getElementById(dest).innerHTML=el;
    }
    this.updateEventsToArrays=function(dest){
        /*
        var el = document.getElementById(dest);
        var x = dest.nod
        var clone = el.cloneNode(true);
        el.parentNode.replaceChild(clone, clone);
        */
        //console.log(clone);
        var el,
            panel,
            event;
        //console.log("hi");
        console.log(self.panelList[0]["arrayDirection"]);
        for(var i=0;i<self.panelList.length;i++){
            panel=self.panelList[i]
            for(var j=0;j<panel["arrayDirection"].length;j++){
                el = document.getElementById(panel["id"]+"_"+panel["arrayDirection"][j])
                event=panel["arrayEvents"][j];
                el.removeEventListener('click',event,false);
                //console.log(el,event)
                el.addEventListener('click',event,false);
            }
            
            
        }
    }
    this.updateEventsToCheckbox=function(dest){
        var el = document.getElementById(dest);
        var elem=el.getElementsByTagName('input');
        //console.log(elem)
        for(var i=0;i<elem.length;i++){
            elem[i].addEventListener('click',function(){
                var parent = this.parentElement.parentElement;
                var elems = parent.getElementsByTagName('input');
                for(var i=0;i<elems.length;i++){
                    if(elems[i] != this)
                        elems[i].checked=false;
                }
                console.log(this.value);
            },false);
        }    
    }
    //panel list
    //checkbox values
    //array direction
    //panel id
    //createPanel
}
function cncActions(type,value,self){
    //console.log('hi');
    var form={};
    //form['speed'] = document.getElementById('speed').value;
    //form['notification'] = document.getElementById('setNotification').value;
    var url = 'postCall';
    form['mode'] = 'cnc';
    form['type'] = type;
    if(type == "move"){
        //console.log("input test",panel.checkValues(self));
        var factor = panel.checkValues(self)
        console.log('text',Number(factor));
        if(Number(factor) != NaN){
            value[0]*=factor;
            value[1]*=factor;
            value[2]*=factor;
        }
    }
    else if (type=="point"){
        
    }
    else if (type=="setZero"){
        
    }
    else if (type=="work"){
        var el = document.getElementById("stepWork").getElementsByTagName("textArea")[0].value;
        console.log('text',Number(el));
        if(Number(el) != NaN){
            value[0]*=el;
            value[1]*=el;
            value[2]*=el;
        
    }
    }
    form['value'] = value;
    //console.log(form);
    //z.setClassName(form.setClass);
    //z.displayData();
    //console.log("send Form:",form);
    sendObj(url,form,function(obj){
        //var json = JSON.parse(obj); 
        //updateCoorinates(obj["xyzVal"])
        console.log("obj",obj);
        if(obj["type"]=='pos'){
            updateCoorinates(obj);
        }
        console.log('cnc control',obj,form);
    });
}
function tokenValidation(mode){
    var url = 'postCall';
    var form = {};
    form['mode']=mode;
    if(mode=='checkToken'){
		var str = document.getElementById('tokenCheck').value;
		form['token']= parseInt(str);
    }
    sendObj(url,form,function(obj){
		if(obj>=00000 && obj<=99999){
			document.getElementById('tknField').innerHTML = obj;
			var insert = document.createElement("div");
			insert.id = "msgTOKEN";
			insert.className = "info";
			insert.innerHTML = '<div id="msgBoxData">Twój token to: <span class="tooltip"><span id="tok">' + obj + '</span><span id="copyTooltip" class="tooltiptext">Kliknij aby skopiować</span></span></div><div class="closeButton" onclick="closeMsg('+"'msgTOKEN'"+')">✖</div>';
			var msgArea = document.getElementById('msgArea');
			msgArea.appendChild(insert);
			document.getElementById("tok").addEventListener("click", function() {
				copy(document.getElementById("tok"), "copyTooltip");
			});;
		} else {
			var insert = document.createElement("div");
			insert.id = "msgTOKEN";
			if(obj != "Dziękujemy. Konto zostało połączone."){
				insert.className = "message";
			} else {
				insert.className = "info";
			}
			insert.innerHTML = '<div id="msgBoxData">' + obj + '</div><div class="closeButton" onclick="closeMsg('+"'msgTOKEN'"+')">✖</div>';
			var msgArea = document.getElementById('msgArea');
			msgArea.appendChild(insert);
		}
    })
}
//800=1.5
//2/3*800=1
function setValuesToForm(params){
    var formList=['speed','setNotification'];
    for(var i=0;i<params.length;i++){
        var sel = document.getElementById(formList[i]);
        if(i==0)
            sel.value=params[0];
        var opts = sel.options;
        for(var opt, j = 0; opt = opts[j]; j++) {
            if(opt.value == params[i]) {
                sel.selectedIndex = j;
                break;
            }
        }
    }
}

function takeValuesFromForm(){
    //console.log('hi');
    var form={};
    form['speed'] = document.getElementById('speed').value;
    form['notification'] = document.getElementById('setNotification').value;
    var url = 'postCall';
    form['mode'] = 'saveSettings';
    //console.log(form);
    //z.setClassName(form.setClass);
    //z.displayData();
    sendObj(url,form,function(obj){
        //var json = JSON.parse(obj); 
        console.log('saveSettings',obj);
    });
    //console.log('param from form',a,b);
}
function floor(num){
    return Math.floor(num*100)/100;
}
function updateCoorinates(xyzVal){
    var list = ["xVal","yVal","zVal"];
    console.log('xyz',xyzVal);
    var x = xyzVal.value
    for (k in x){
        //console.log('ji',k,xyzVal);
        x[k]=floor(x[k]);
        document.getElementById(k).innerHTML=x[k]; 
    }
}
function getClassList(form){
    var url = 'postCall';
    form['mode']='classList';
    //console.log('clsasList',form);
    
    sendObj(url,form,function(obj){
        //var json = obj;
        classList=obj;
       filtrEvents();
        //set.saveData(json);
        //console.log('obj',json);
        
    });
    
}
function getPicture(){
    var url = 'postCall';
    var form = {};
    form['mode']='picture';
    sendObj(url,form,function(obj){
        console.log('res picture:',obj)
        
        document.getElementById('personPictureVer').src=obj;
        document.getElementById('personPictureHor').src=obj;
        
        
    })
    
    
}
function sendMessage(){
	var url = 'postCall';
	var form = {};
	form['mode']='message';
	var el = document.getElementById('messageArea');
	var infB = document.getElementById('infoBox');
	var infBData = document.getElementById('infoBoxData');
	var msg = el.value;
	if(msg.length > 5){
		form['param']=msg;
		sendObj(url,form,function(responseText){
			var insert = document.createElement("div");
				insert.id = "infoMSG";
				insert.className = "info";
				insert.innerHTML = '<div id="msgBoxData">' + responseText + '</div><div class="closeButton" onclick="closeMsg('+"'infoMSG'"+')">✖</div>';
			var msgArea = document.getElementById('msgArea');
			msgArea.appendChild(insert);
			document.getElementById('messageArea').value='';
		})
	} else {
		var insert = document.createElement("div");
			insert.id = "infoMSG";
			insert.className = "message";
			insert.innerHTML = '<div id="msgBoxData">Proszę nie wysyłaj pustych wiadomości.</div><div class="closeButton" onclick="closeMsg('+"'infoMSG'"+')">✖</div>';
		var msgArea = document.getElementById('msgArea');
		msgArea.appendChild(insert);
	}
}
function onLoadFunc(){
    console.log('hi2');
    var url='postCall';
    var form={};
    form['mode']='getSettings';
    sendObj(url,form,function(obj){
    //    console.log(JSON.parse(obj));
        settings1 = obj;
       // console.log('hi',settings1);
        set.saveData(settings1.event);
    set.addChangeClick();
    set.addClicks();
        //z.setFields(settings1['fields']);
        //z.setClassName(settings1.formValues[0]);
    setValuesToForm(settings1['formValues'])
    getPicture();
       // movePannnels("controlPannel");
        
        //set.saveData(settings1);
    //requestForChanges('today'); 
    });
	if('serviceWorker' in navigator){
		navigator.serviceWorker.register('/service-worker.js', {
			scope: './'
		});
    }
	document.getElementById("tokenCheck").addEventListener('keypress', function (e) {
		var key = e.which || e.keyCode;
		if (key === 13) { // 13 is enter
			tokenValidation('checkToken');
		}
	});
    //console.log(settings1);
}


/* #####################jakieś śmieci#################### */
function sendObj (url,json_obj,callback){
    var http = new XMLHttpRequest();
    //var url = "get_data";
    var string_obj = JSON.stringify(json_obj);
       // console.log(string_obj);
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            //console.log('resText',http.responseText);
            var res=JSON.parse(http.responseText);
            console.log(res);
            if(res['err'] == true){
                //console.log(res.message)
				var resMsg = res.message;
				var insert = document.createElement("div");
					insert.id = "msgLOGIN";
					insert.className = "message";
					insert.innerHTML = '<div id="msgBoxData"><a class="msgLink" href="/login">' + resMsg + '</a></div><div class="closeButton" onclick="closeMsg('+"'msgLOGIN'"+')">✖</div>';
				var msgArea = document.getElementById('msgArea');
				msgArea.appendChild(insert);
            }
            //console.log('resText',res);
            callback(res.params);
        }
        else{console.log(http.status);}
    }
    http.send(string_obj);
}


function btnClicked(type){
    console.log('hello',type);
    var idList={controlPannel:'control',workPannel:'work'};
    for (k in idList){
        if(k==type){
            document.getElementById(idList[k]).className='btn btnClicked';
        }
        else{ document.getElementById(idList[k]).className='btn';}
    }
    
}
function homePosition(id){
        var el;
        for(var i=0; i<settings1.events.length;i++){
            el = document.getElementById(settings1.events[i]);
            if(settings1.events[i]==id){
                el.style.display='block';
            }
            else{
                el.style.display='none';
            }
        }
}
function eventsAttach(){
    var self = this;
    this.btnEvents={};
    this.addClicks=function(){
        for(k in self.btnEvents){
            var el = document.getElementById(k);
            //console.log(el);
            el.addEventListener('click',this.btnEvents[k],false);
            //console.log(this.btnEvents[k]);
        }
    }
}
function traslateSettings(){
    this.formId = 'setClass';
    eventsAttach.call(this);
    this.saveData = function(data){
        this.changeDisplayEvents = data['changeDisplayEvents'];
        this.btnEvents=btnEvents;
    }
    this.addChangeClick=function(){
        for(k in this.changeDisplayEvents){
            this.changeDisplayOnClick(this.changeDisplayEvents[k]);
        }
    }
    
    this.changeDisplayOnClick=function(key){
        console.log(key[0]);
        var key1 =key[0];
        for(var i=0;i<key1.length;i++){
        var el = document.getElementById(key1[i]);
        //console.log(el);
        el.addEventListener('click',function(){ homePosition(key[1])},false);
        }
    }
}
function closeMsg(elID){
	var msgArea = document.getElementById('msgArea');
	var toRemove = document.getElementById(elID);
	msgArea.removeChild(toRemove);
}

function copy(elem, msg){
	var succeed = copyToClipboard(elem);
	if(!succeed){
		alert("Copy not supported or blocked. Press Ctrl+c to copy.");
		document.getElementById(msg).innerHTML = "Błąd kopiowania";
	} else {
		document.getElementById(msg).innerHTML = "Skopiowano";
	}
}
