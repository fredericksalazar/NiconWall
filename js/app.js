window.addEventListener('DOMContentLoaded', function() {
'use strict';
    
    var sizeLocal = 34;
    var sizeOnline = 26;
    var img;
    var imagen;
    var name;
    var prev;
    var mode=0;
    
    setLocal();
    addTouchEvent();
    changeRandom();
    

    function addTouchEvent(){
        window.addEventListener('load', function(){ // on page load
            var t=document.body.addEventListener('touchstart', function(e){
            var obj=e.changedTouches[0];
                if(obj.target.className==='touch'){
                    isSelected(obj.target.id);
                }
                if(obj.target.id==='more'){
                    $('#container').empty();
                    setOnline();
                }
                if(obj.target.id==='set'){
                    setWallpaper();
                }
                if(obj.target.id==='back'){
                    $('#container').empty();
                    setLocal();
                }
            }, false);
        }, false);
    }

    //permite obtener la imàgen que el usuario a seleccionado, esta serà almacenada y pasada para ajustar como
    //Wallpaper.
    
    function isSelected(selected){
        name=selected;
        imagen=document.getElementById(name);
        setBorder();
    }


    //Este metodo permite recibir la imagen seleccinada y enviarla para el ajuste como wallpaper en el sistema
    
    function setWallpaper() {
        if(mode===0){
            if(imagen.naturalWidth > 0){
                var blobCanvas = document.createElement("canvas");
                var blobCanvasContext = blobCanvas.getContext("2d");        
                blobCanvas.width = screen.width;
                blobCanvas.height =screen.height;
                blobCanvasContext.drawImage(imagen,0,0,screen.width,screen.height);
                blobCanvas.toBlob(function(blob) {
                            new MozActivity({
                                name: "share",
                                data: {
                                    type: "image/*",
                                    number: 1,
                                    blobs: [blob]
                                }
                            });
                        });
            }
        }
        if(mode===1){
            var xhr = new XMLHttpRequest({
                mozSystem: true
            });
            xhr.open("GET",imagen.src, true);
            xhr.responseType = "blob";
            xhr.onload = function () {
                //sample activity
                var activity = new MozActivity({
                name: "share",
                data: {
                    type: "image/*",
                    number:1,
                    blobs: [this.response],
                    filenames:["wallpapertest.png"]
                },
                });
            };
            xhr.onerror = function () {
                alert("Error with System XHR");
            };
            xhr.send();
        }
    } 


    //Este metodo permite ajustar un borde a la imagen seleccionada o tocada por el usuario
    
    function setBorder(){    
        if(prev!=null){
             img=document.getElementById(prev);
             img.style.boxShadow="0px 0px 0px 0px white";
        }            
        img=document.getElementById(name);
        img.style.boxShadow="1px 1px 6px 2px #e74c3c";
        prev=name;        
    }


    //Este metodo tiene como finalidad hacer la carga de todos los wallpapers almacenados en el servidor
    //y que serán ofrecidos a los usuarios de forma Online.

    function getOnlineResource(){
        var subName=0;        
        var divImg=document.getElementById("container");
        
            for(var i=0;i<sizeOnline;i++){                
                subName=i+1; 
                var onlImg=document.createElement("img");
                var wall = new Wallpaper(2,subName);
                onlImg.id=wall.creaID();
                onlImg.className='touch';
                onlImg.src=wall.creaSRC();                
                divImg.appendChild(onlImg);
            }
    }
    
    
    //este metodo se encarga de hacer la carga de todas las imagenes almacenadas de forma local en la app
    //y cargarlas en la vista Html.
    
    function getLocalResource(){               
        var subname=0;
        var divLo=document.getElementById("container");        
            for(var i=0;i<sizeLocal;i++){
                subname=i+1;
                var imagen = document.createElement("img");
                var wall = new Wallpaper(1,subname);
                imagen.id= wall.creaID();
                imagen.className='touch';
                imagen.src= wall.creaSRC();
                divLo.appendChild(imagen);
            }
    }
    

    //Permite ajustar la UI de NiconWall para obtener los wallpapers desde el servidor.
    
    function setOnline(){
        mode=1;             
        document.getElementById("more").style.display='none';
        document.getElementById("bn-back").style.display='inline'; 
        getOnlineResource();        
        addTouchEvent();
    }

    
    /*
       Este metodo permite ajustar la interfaz de NiconWall para el modo Local
    */
    function setLocal(){  
        mode=0;
        document.getElementById("more").style.display='block';
        document.getElementById("bn-back").style.display='none';        
        getLocalResource();
    }
    
    
    /**
        Este metodo tendrá como finalidad cambiar en un determinado intervalo de tiempo 
        el wallpaper de la cabecera principal, usando JQuery vamos a crear el efecto y
        cambio cada 10 segundos.
    */
    function changeRandom() {
        //vamos a ajustar la primer imagen del random, las imagenes aletatorias podran ser tanto
        //locales como las online
        var imag;
        var imgID;
        var wall;
        
        var imag=document.createElement("img");
        imag.src = "/img/thumbs/NiconSystem.png";
        $('.random').append(imag);
        
        setInterval(function(){
            var tipoImagen = Math.floor(Math.random()*2);
            if(tipoImagen === 1){
                imgID = Math.floor(Math.random()*sizeLocal);                
                wall = new Wallpaper(1,imgID);
                imag.id=wall.creaID();
                imag.src=wall.creaSRC(); 
            }else{
                imgID = Math.floor(Math.random()*sizeOnline);
                wall = new Wallpaper(2,imgID);
                imag.id=wall.creaID();
                imag.src=wall.creaSRC(); 
            }
        $('.random').append(imag).hide().fadeIn('slow');
        },6000);        
    }
});  



/*
    Creamos el objeto Wallpaper el cual será el encargado de operaciones basicas en cuanto a manejo de wallpapers
    se refiere.

*/

function Wallpaper(tipo, id){
    this.tipo = tipo;
    this.ident = id;
    this.localSrc = "/img/thumbs/";
    this.serverSrc = "http://niconsystem.zz.mu/NiconWall/";
    this.nombre = "th-wall-";
    this.ext = ".jpg";
  
    
    /**
       Este metodo permite crear el SRC de la imagen segun el tipo de imagen
       recibido
    */    
    this.creaSRC = function(){
        //Si el tipo es 1 la imagen será cargada desde la url local.
        
        if(this.tipo === 1){
              return this.localSrc+this.nombre+this.ident+this.ext;
           }else{
             return this.serverSrc+this.nombre+this.ident+this.ext;
         }       
    };
    
    
    /**
       Este metodo permite crear el ID de cada imagen
    */
     this.creaID = function(){
          return "img"+id;
     }
}
