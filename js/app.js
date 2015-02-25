window.addEventListener('DOMContentLoaded', function() {
// We'll ask the browser to use strict code to help us catch errors earlier.
// https://developer.mozilla.org/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode
'use strict';
    
    addTouchEvent();
    
    var img;
    var imagen;
    var name;
    var prev;
    var mode=0;
    
    //Vamos a controlar todos los posibles eventos de toque en la pantalla a traves de los cuales
    //el usuario podrá interactuar con los controles y recursos de la app,
    
    function addTouchEvent(){
        window.addEventListener('load', function(){ // on page load
            var t=document.body.addEventListener('touchstart', function(e){
            var obj=e.changedTouches[0];
                if(obj.target.className==='touch'){
                    isSelected(obj.target.id);
                }
                if(obj.target.id==="more"){
                    setOnline();
                }
                if(obj.target.id==='set'){
                    setWallpaper();
                }
                if(obj.target.id==='back'){
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
             img.style.border="0px solid white";
        }            
        img=document.getElementById(name);
        img.style.border="1.8px solid white";
        prev=name;        
    }


    //Este metodo tiene como finalidad hacer la carga de todos los wallpapers almacenados en el servidor
    //y que serán ofrecidos a los usuarios de forma Online.

    function getOnlineResource(){       
       //Ajustamos todas las variables y parámetros de coneccion al servidor
        var server="http://niconsystem.zz.mu/NiconWall/";
        var nameImg="th-wall-";
        var ext=".jpg";
        var maxFile=2;
        var subName=0;
        var idI="img";
        var divImg=document.getElementById("online");
        //hacemos la carga de todas las imágenes del servidor
            for(var i=0;i<maxFile;i++){                
                subName=i+1; 
                var onlImg=document.createElement("img");
                onlImg.id=idI+subName;
                onlImg.className='touch';
                onlImg.src=server+nameImg+subName+ext;                
                divImg.appendChild(onlImg);  
            }
    } 

    //Permite ajustar la UI de NiconWall para obtener los wallpapers desde el servidor.
    
    function setOnline(){
        mode=1;
        document.getElementById("container").style.display='none';
        document.getElementById("online").style.display='block';
        document.getElementById("more").style.display='none';
        document.getElementById("bn-back").style.display='inline';        
        getOnlineResource();        
    }

    //Permite ajustar la UI de NiconWall 
    
    function setLocal(){        
        document.getElementById("online").style.display='none';
        document.getElementById("container").style.display='inline';
        document.getElementById("more").style.display='block';
        document.getElementById("bn-back").style.display='none';
        mode=0;
    }
});  
