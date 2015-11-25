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


    /**
      Este metodo permite ajustar  un escuchador de eventos de tipo touch a las
      imágenes y demas objetos que interactuan en la interfaz de usuario.

      Author: Frederik Adolfo Salazar Sanchez
      Version: 2.0

    */

    function addTouchEvent(){
        window.addEventListener('load', function(){
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


    /**
      Este metodo permite ajustar el borde  de la imágen seleccionada por el
      usuario al momento de tocar la imagen con un evento touch, este metodo
      hace el llamado al metodo setBorder();
    */

    function isSelected(selected){
        name=selected;
        imagen=document.getElementById(name);
        setBorder();
    }


    /**
      Este metodo es el encargado de ajustar la imagen de fondo seleccionada por
      el usuario e invocar a MozActivity para recibir la imagen y poder ajustarla
      como fondo de escritorio.
    */

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


    /**
      Este metodo es el encargado de ajustar los estilos y sombras a la imágen
      seleccionada, en caso de que una nueva imagen sea seleccionada ajusta la
      imagen previa con el borde de modo normal.
    */

    function setBorder(){
        if(prev!=null){
             img=document.getElementById(prev);
             img.style.boxShadow="0px 0px 0px 0px white";
        }
        img=document.getElementById(name);
        img.style.boxShadow="1px 1px 6px 2px #e74c3c";
        prev=name;
    }


    /**
      Este metodo permite obtener todas las imágenes cargadas en el servidor
      y cargandolas en el modo de visualización online, cabe señalar que estas
      imagenes estan almacenadas dentro del hosting.
    */

    function getOnlineResource(){
        var subName=0;
        var divImg=document.getElementById("container");

          if(navigator.onLine){
            for(var i=0;i<sizeOnline;i++){
                subName=i+1;
                var onlImg=document.createElement("img");
                var wall = new Wallpaper(2,subName);
                onlImg.id=wall.creaID();
                onlImg.className='touch';
                onlImg.src=wall.creaSRC();
                divImg.appendChild(onlImg);
            }
          }else{
            divImg.innerHTML = "<p id='info'>¡The online mode fail! <br> NO Internet Acces, please verify!</p>";
          }
    }


    /**
      Este metodo se encarga de obtener y cargar todas  las imágenes de modo
      local distribuidas con la versión empaquetada de la app, al cargar las
      imágenes dentro del modo local estas deben ser mostradas en la vista
    */
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


    /**
      Este metodo permite ajustar la vista de la app de modo local al modo
      online y llama al metodo getOnlineResource para obtener las imagenes
      del servidor.
    */

    function setOnline(){
        mode=1;
        //document.getElementById("more").style.display='none';
        //document.getElementById("bn-back").style.display='inline';
        $("#more").fadeOut();
        $("#bn-back").fadeIn();
        getOnlineResource();
        addTouchEvent();
    }


    /**
      Este metodo permite ajustar  la vista de la app de modo online a modo loca
      y carga nuevamente todas las imágenes locales a la vista.
    */

    function setLocal(){
        mode=0;
        $("#more").fadeIn();
        $("#bn-back").fadeOut();
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
        var ranNumber;
        var imag=document.createElement("img");
        var tipoImagen;
        imag.src = "/img/thumbs/NiconSystem.png";
        $('.random').append(imag);

        setInterval(function(){
          if(navigator.onLine){
            tipoImagen = 1;
          }else{
            tipoImagen = Math.floor(Math.random()*2);
          }
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



/**
  Creamos el objeto Wallpaper el cual será el encargado de operaciones basicas
  en cuanto a manejo de wallpapers se refiere.
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
