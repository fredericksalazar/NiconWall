    var img;
    var imagen;
    var name;
    var prev;

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
        if(imagen.naturalWidth > 0){
            var blobCanvas = document.createElement("canvas");
            var blobCanvasContext = blobCanvas.getContext("2d");        
            blobCanvas.width = screen.width;
            blobCanvas.height =screen.height;
            blobCanvasContext.drawImage(imagen,0,0,screen.width,screen.height);
            blobCanvas.toBlob(function(blob) {
                        alert("si entro");
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
        var onlImg=new Image();
        //hacemos la carga de todas las imágenes del servidor
            for(i=0;i<maxFile;i++){                
                subName=i+1;                                
                onlImg.id=idI+subName;
                onlImg.className='touch';
                onlImg.src=server+nameImg+subName+ext;
                var wall=document.createElement("IMG");
                wall=onlImg;
                divImg.appendChild(wall);     
            }
    } 

    function setOnline(){
        document.getElementById("container").style.display='none';
        document.getElementById('online').style.display='block';
        document.getElementById("more").style.display='none';
        document.getElementById("bn-back").style.display='inline';
        getOnlineResource();
    }

    function  setLocal(){        
        document.getElementById("online").style.display='none';
        document.getElementById("container").style.display='inline';
        document.getElementById("more").style.display='block';
        document.getElementById("bn-back").style.display='none';
    }
