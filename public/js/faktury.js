function NIPgenerator(){
    var NIP=[];
    for(var i=0;i<9;i++){
        NIP[i]=generateDigit();
        
    }
    return NIP;
    
}
var NIPconst=[6,5,7,2,3,4,5,6,7];

function generateDigit(){
    var match = Math.floor(Math.random() * 10);
    return match
    
}
function sumaKontrolna(NIP){
    var sum=0;
    for (var i=0;i<9;i++){
        sum+=NIP[i]*NIPconst[i];
    }
    var lastNumber = sum % 11;
    if(lastNumber == 10){lastNumber = 0 };
    NIP[9] = lastNumber;
    return NIP;
    
    
}

function createNIP(){
    var NIP = NIPgenerator();
    var newNIP = sumaKontrolna(NIP);
    var string = '';
    for(var i =0; i<10;i++){
        var char = newNIP[i].toString();
        string+=char;
        if(i ==2 || i == 4 ||i == 6){
            string+='-';
        }
    }
    
    console.log(string);
    return string;
}
function moreThanOneNIP(){
    var number =3;
    var string = ''
    for(var i;i<number;i++){
        var NIP=createNIP(); 
        console.log(NIP);
        string+=NIP;
        //string+='<br>'
        
    }
    console.log(string);
    
}
var cena = [];
var ilość = [];
var wartosc = [];
var netto = [];
var vat = [];
var ok =['cena','ilość','wartosc','vat','netto'];
function wszystko(){
    for(var i=0;i<10;i++){
        cenax(i);
        ilossc(i);
        wartoscx(i);
        vatx(i);
        nettox(i);
    }
    console.log('cena'); 
    for(var i=0;i<10;i++){
        console.log(cena[i]) 
    }
    console.log('ilość'); 
    for(var i=0;i<10;i++){
        console.log(ilość[i]) 
    }
    console.log('wartosc'); 
    for(var i=0;i<10;i++){
        console.log(wartosc[i]) 
    }
    console.log('vat'); 
    for(var i=0;i<10;i++){
        console.log(vat[i]) 
    }
    console.log('netto'); 
    for(var i=0;i<10;i++){
        console.log(netto[i]) 
    }
    
    
}
function wartoscx(i){
    wartosc[i]=cena[i]*ilość[i];
    
}
function nettox(i){
    
    netto[i]=wartosc[i]-vat[i];    
}

function vatx(i){
    var x =Math.floor(wartosc[i] * 0.23*100)/100;
    vat[i]=x;
    
}
function cenax(i){
    var cena2 = Math.floor(Math.random() * 100);
    var x=cena2.toString();
    x+=', 00'
        cena[i]=cena2;
    //console.log(x);
     
}
function ilossc(i){
    var ilosc2 = Math.floor(Math.random() * 100);
    var x=ilosc2.toString();
    //x+=', 00'
        ilość[i]=ilosc2;
    //console.log(x);
     
}