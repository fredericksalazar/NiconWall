    var img;
    var imagen;
    var name;
    var prev;

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
            blobCanvasContext.drawImage(imagen, 0,0,screen.width, screen.height);        
            blobCanvas.toBlob(function (blob) {
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
