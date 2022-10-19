
    class ImageClass{
        constructor(MainImage, sx, sy, swidth, sheight, scaleH, scaleW){
    
            this.MainImage = MainImage;
            this.sx = sx;
            this.sy = sy;
            this.swidth = swidth;
            this.sheight = sheight;
    
            this.x = 0;
            this.y = 0;
            this.width = swidth;
            this.height = sheight;

            // this.fitscaleH = scaleH;
            // this.fitscaleW = scaleW

            this.scale = new Vector2(scaleH, scaleW)
    
        }
        Draw(context, x, y){     
            this.x = x;
            this.y = y;
    
            // context.drawImage(this.MainImage, this.sx, this.sy, this.swidth, this.sheight, 
            //                         this.x - (this.width/2)*size, 
            //                         this.y - (this.height/2)*size, 
            //                         this.width*size, 
            //                         this.height*size);
    
            if(context){
                context.drawImage(this.MainImage, this.sx, this.sy, this.swidth, this.sheight, 
                                    this.x - (this.width/2)*this.scale.x, 
                                    this.y - (this.height/2)*this.scale.y, 
                                    this.width*this.scale.x, 
                                    this.height*this.scale.y);

            }
            else{
                console.log("НЕ ЗАДАЛ КОНТЕКСТ НА РИСОВАНИЕ");
                ctx.drawImage(this.MainImage, this.sx, this.sy, this.swidth, this.sheight, 
                                    this.x - (this.width/2)*this.scale.x,
                                    this.y - (this.height/2)*this.scale.y, 
                                    this.width*this.scale.x, 
                                    this.height*this.scale.y);
            }
            
        }
    }
    
    class Pixel{
        constructor(x, y, color, size, image, id){

            this.Image = image
            this.x = x
            this.y = y

            this.initialX = x
            this.initialY = y

            this.density = getRandomInt(1, 10)
            this.size = size

            this.moveDirection = new Vector2(0, 0)
            this.pushDirection = new Vector2(0, 0)

            this.speed = 0
            this.force = 0

            this.angle = getRandom(-Math.PI, Math.PI)
            this.angleStep = getRandom(-Math.PI/50, Math.PI/50)
            this.angleParabola = 0

            this.enable = true
            this.FlyAround = false
            this.FlyParabola = false

            this.timeParabola = 0

            this.id = id

            this.color = color
            this.colorRGB = 'rgb'
            this.colorRGB = 'hsl'
            this.setColor(color)
            
            this.RandomRadius = getRandom(0, 10)
            this.flyAroundRadius = getRandom(Mouse.radius, width*0.8)
            this.addRadius = 0
        }
        setInitial(){
            this.moveDirection = new Vector2(0,0)
            this.pushDirection = new Vector2(0, 0)

            this.speed = 0
            this.delay = 0
            this.addRadius = 0
            this.timeParabola = 0 

            this.FlyAround = false
            this.FlyParabola = false
        }
        Update(){   
 
            let directionFromMouse = new Vector2(ParticlesPosition.x - this.x, ParticlesPosition.y - this.y)

            if(!this.enable && this.delay > 0){ //Timer
                this.delay -= 10
                this.addRadius += 10
            
                if(this.delay <= 0){
                    this.setInitial()

                    this.x = width  + 1000 * Math.cos(getRandom(0, 2*Math.PI))
                    this.y = height + 1000 * Math.sin(getRandom(0, 2*Math.PI))
                }
            }
            else if(!this.enable && this.delay <= 0){ //Comeback
                let direction = new Vector2( this.x - this.initialX, this.y - this.initialY )

                if(direction.distance() > (this.size.x + this.size.y)){
                    this.angle += this.angleStep
                    let r = new Vector2(this.x - this.initialX, this.y - this.initialY).distance()
                        r *= 0.8
                    this.x = this.initialX  + r * Math.cos(this.angle)
                    this.y = this.initialY  + r * Math.sin(this.angle)

                    this.moveDirection = new Vector2(0,0)
                    this.speed = 0

                    // this.speed = 1
                    // this.moveDirection.x = direction.x/5
                    // this.moveDirection.y = direction.y/5
                }
                else{
                    //не войдут в setInitial
                    this.enable = true
                    this.x = this.initialX
                    this.y = this.initialY

                    this.setInitial()

                    if(this.id == 0){
                        enable = true
                    }
                }
                
            }

            if(Mouse.DragMode && this.enable){//Зажатие мыши
                if(directionFromMouse.distance() < Mouse.radius && this.moveDirection.x == 0 && this.moveDirection.y == 0 && !this.FlyAround && !this.FlyParabola){

                    this.force = (Mouse.radius - directionFromMouse.distance())/Mouse.radius

                    this.pushDirection.x = directionFromMouse.normalized().x 
                    this.pushDirection.y = directionFromMouse.normalized().y

                    this.moveDirection.x = this.pushDirection.x * Math.cos( this.angle/8) - this.pushDirection.y * Math.sin( this.angle/8 )
                    this.moveDirection.y = this.pushDirection.x * Math.sin( this.angle/8) + this.pushDirection.y * Math.cos( this.angle/8 )

                    this.speed = this.force * this.density
                    
                    this.angleParabola = Math.atan2(this.moveDirection.y, this.moveDirection.x) - Math.atan2(0, 1)
                    this.FlyParabola = true
                    // this.FlyAround = true
                }

                let distanceFromCenter = new Vector2(width - this.x, height - this.y).distance()
                if(distanceFromCenter > width*5) {
                    this.FlyParabola = false
                    this.FlyAround = true
                }

            }

            if(Mouse.DragTimer > 40 && (directionFromMouse.distance() - Mouse.DragTimer * 10) < 0 && !this.FlyAround){
                this.FlyAround = true
            }
            
            if(this.FlyAround){//Движение по кругу && Mouse.DragMode
                
                this.FlyParabola = false

                this.angle += this.angleStep

                let posX = Mouse.x + (this.flyAroundRadius + this.addRadius) * Math.cos(this.angle)
                let posY = Mouse.y + (this.flyAroundRadius + this.addRadius) * Math.sin(this.angle)

                if(!this.enable){
                    posX = width/2  + (this.flyAroundRadius + this.addRadius) * Math.cos(this.angle)
                    posY = height/2 + (this.flyAroundRadius + this.addRadius) * Math.sin(this.angle)
                }
                let direction = new Vector2(this.x - posX, this.y - posY)

                this.moveDirection.x = direction.x
                this.moveDirection.y = direction.y

                this.speed = 0.0625
            }

            if(this.FlyParabola){//Движение по параболе
                
                this.FlyAround = false
                this.timeParabola += 0.05
                this.moveDirection.x = Math.cos(this.angleParabola)
                this.moveDirection.y = Math.sin(this.angleParabola) - 0.05*this.timeParabola*this.timeParabola
                this.speed = 7 * this.force * this.density
            }

            if(!Mouse.DragMode && this.enable){// Просто движение мыши
                this.force = ( Mouse.radius  - directionFromMouse.distance())/Mouse.radius
                this.speed = this.force * this.density * 1.5    

                if(directionFromMouse.distance() < Mouse.radius - this.RandomRadius){
                    this.moveDirection.x = directionFromMouse.normalized().x 
                    this.moveDirection.y = directionFromMouse.normalized().y
                }
                else {//Возвращение на начальную позицию
                    let direction = new Vector2( this.x - this.initialX, this.y - this.initialY )

                    if(direction.distance() > 0.1){
                        this.speed = 1
                        this.moveDirection.x = direction.x/5
                        this.moveDirection.y = direction.y/5
                    }
                    else{
                        this.x = this.initialX
                        this.y = this.initialY
                        this.moveDirection = new Vector2(0,0)
                        this.speed = 0
                    }
                }
            }

            // if(this.moveDirection.x == 0 || this.moveDirection.y == 0 || this.speed == 0) return
            this.x -= this.moveDirection.x*this.speed
            this.y -= this.moveDirection.y*this.speed
            this.Draw();
        }
        setColor(color){
            this.color = color
            this.hsl = rgbToHsl(color)

            this.colorRGB = 'rgba('+this.color[0]+','+this.color[1]+','+this.color[2]+','+1+')'
            this.colorHSL = 'hsla('+this.hsl[0]+', '+this.hsl[1]+'%, '+this.hsl[2]+'%, 1)'

        }
        Draw(){
            if(this.color[4]==0) return
            ctx.save();
            ctx.fillStyle = this.colorHSL        

            if(this.Image) this.Image.Draw(ctx, this.x,  this.y)
            else ctx.fillRect(this.x - this.size.x/2, this.y - this.size.y/2, this.size.x, this.size.y);

            // ctx.lineWidth = 0.5;
            // ctx.strokeStyle = this.colorRGB;
            // ctx.strokeRect(this.x - this.size.x/2, this.y - this.size.y/2, this.size.x, this.size.y);
            
            ctx.restore();
        }
        
        Explode(){
            this.angle = getRandom(-Math.PI, Math.PI)
            this.angleStep = getRandom(-Math.PI/50, Math.PI/50)

            this.timeParabola = 0 
            this.FlyAround = true
            this.FlyParabola = false

            this.enable = false
            // this.delay = Pixels.length-this.id + 1000;
            this.delay = 1000;
            let direction = new Vector2( Mouse.x - this.x, Mouse.y - this.y)

            // this.speed = getRandom(5, 10)
            // this.moveDirection.x = direction.normalized().x 
            // this.moveDirection.y = direction.normalized().y
            // if(this.moveDirection.x == 0 && this.moveDirection.y == 0){
                // this.speed = 2
                // this.moveDirection.x = direction.normalized().x * Math.cos(this.angle/4) - direction.normalized().y * Math.sin(this.angle/4)
                // this.moveDirection.y = direction.normalized().x * Math.sin(this.angle/4) + direction.normalized().y * Math.cos(this.angle/4)      
            // }
        }
    }

    class Particle{
        constructor(x, y, direction, size, color){
            this.x = x + getRandomInt(-Mouse.radius/10, Mouse.radius/10)
            this.y = y + getRandomInt(-Mouse.radius/10, Mouse.radius/10)

            // this.direction = new Vector2(-Mouse.Direction.normalized().x, -Mouse.Direction.normalized().y )
            this.direction = direction
            this.speed = getRandom(0.5, 2)
            this.size = getRandomInt(size/2, size)

            this.angle = getRandom(-Math.PI, Math.PI)
            this.color = 'rgba('+color[0]+', '+color[1]+', '+color[2]+', '+getRandomInt(4, 8)/10+ ')'
        
        }
        Update(){
            let newDirection = new Vector2(this.direction.x * Math.cos(this.angle/100) - this.direction.y * Math.sin(this.angle/100), 
                                           this.direction.x * Math.sin(this.angle/100) + this.direction.y * Math.cos(this.angle/100))

            this.x += newDirection.normalized().x * this.speed
            this.y += newDirection.normalized().y * this.speed

            this.size *= 0.95
            // this.size -= 0.5

            if (this.size <= 0) {
                delete this
                return
            }
            this.Draw()
        }
        Draw(){
            ctxFront.fillStyle = this.color
            ctxFront.beginPath();
            ctxFront.arc(this.x, this.y, this.size/2, 0, 2 * Math.PI, false);
            ctxFront.fill();
        }
    }
    
    function print(text){
        console.log(text)
    }
    
    function rgbToHsl(RGB){
        let r = RGB[0]
        let g = RGB[1]
        let b = RGB[2]

        r /= 255, g /= 255, b /= 255;
        let  max = Math.max(r, g, b), min = Math.min(r, g, b);
        let  h, s, l = (max + min) / 2;
        let d 

        if(max == min){
            h = s = 0; // achromatic
        }else{
            d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [Math.floor(h * 360), Math.floor(s * 100), Math.floor(l * 100)];
    }
    
    function getRandom(min, max){
        return Math.random() * (max - min) + min;
    }
    function getRandomInt(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
    
    function Resize(){
        ////////////////////////////////////////
        prevWidth = width
        prevHeight = height

        width = MyCanvas.parentElement.clientWidth;
        height = MyCanvas.parentElement.clientHeight;

        // if(height < 500) height = 500;
        // if(width > 500) width = 500;

        diffW = prevWidth - width;
        diffH = prevHeight - height;
        ////////////////////////////////////////
        MyCanvas.width = width;
        MyCanvas.height = height;

        MyCanvasBack.width = width;
        MyCanvasBack.height = height;

        MyCanvasFront.width = width;
        MyCanvasFront.height = height;

        MyCanvas.style.width = width;
        MyCanvas.style.height = height;

        MyCanvasBack.style.width = width;
        MyCanvasBack.style.height = height;

        MyCanvasFront.style.width = width;
        MyCanvasFront.style.height = height;



        LoadingElement.width = width;
        LoadingElement.height = height;

        LoadingElement.style.width = width;
        LoadingElement.style.height = height;

        // print(width + " " + height)
        if(ParticlesPosition){
            ParticlesPosition.x -= diffW
            ParticlesPosition.y -= diffH
        }
    }
    
    
// <!-- MAIN --> 
            //base var
            {      
            var LoadingElement = document.getElementById("Loading");     
            var MyCanvas        = document.getElementById("canvas");
            var MyCanvasBack    = document.getElementById("canvasBack");
            var MyCanvasFront   = document.getElementById("canvasFront");

            var ctxBack   = MyCanvasBack.getContext('2d');
            var ctx       = MyCanvas.getContext('2d');
            var ctxFront  = MyCanvasFront.getContext('2d');
        
            var width  
            var height 
          
            Resize()

            var Mouse = new MouseClass(50);

            var Pixels = []
            var Particles = []
            var ParticlesPosition = new Vector2(width/2 + 100 * Math.cos(0), height/2 + 100 * Math.sin(0))

            // ==============================
            var MainImage 
            var HeartImage

            var ImageDraw
            var HeartImageDraw
            // ==============================

            var MainImages  = []
            var ImageToDraw = []
            // ==============================
            var imgData 
            var enable = true
            
            var interval_1, interval_2, interval_loading
            }
            
            interval_loading = window.setInterval("Loading();", 60);
            // loadImage()
            loadImageNew()

            function loadImage(){
                        MainImage  = new Image()
                        MainImage.src   = links[0]
                        MainImage.setAttribute('crossOrigin', '');

                        MainImage.onload = function () {
                            
                            ImageDraw  = new ImageClass(MainImage, 0, 0, MainImage.width , MainImage.height, 1, 1);

                            HeartImage = new Image()
                            HeartImage.src  = links[1]
                            HeartImage.setAttribute('crossOrigin', '');
                            
                            HeartImage.onload = function () {
                                
                                HeartImageDraw  = new ImageClass(HeartImage, 0, 0, HeartImage.width, HeartImage.height, 0.6, 0.6);

                                clearInterval(interval_loading)
                                Resize()
                                Main()
                                
                            }
                    }
                }

            function loadImageNew(){

                MainImages.push(new Image())
                let i = MainImages.length - 1
                
                MainImages[i].src = links[i]
                MainImages[i].setAttribute('crossOrigin', '');
               
                
   
                MainImages[i].onload = function () {
    
                    ImageToDraw.push(new ImageClass(MainImages[i], 0, 0, MainImages[i].width , MainImages[i].height, imageScale[i][0], imageScale[i][1]))
                    // ImageToDraw.push(new ImageClass(MainImages[i], 0, 0, MainImages[i].width , MainImages[i].height, 1, 1))

                    if(MainImages.length != links.length){
                        loadImageNew();
                    }else{
                        clearInterval(interval_loading)
                        Resize()
                        Main()
                    }
                    
                }
            }

                function loadData(){
                    ctx.clearRect(0, 0, width, height);

                    ctx.save();
                    ctx.translate(width/2, height/2);

                    let fitscaleW = width/ImageDraw.width
                    let fitscaleH = height/ImageDraw.height


                    if(fitscaleH > fitscaleW)  {
                        ImageDraw.scale.x = fitscaleH
                        ImageDraw.scale.y = fitscaleH
                        // ImageDraw.fitscale = fitscaleH
                    }
                    else {
                        ImageDraw.scale.x = fitscaleW
                        ImageDraw.scale.y = fitscaleW
                        // ImageDraw.fitscale = fitscaleW
                    }                

                    
                    ImageDraw.Draw(ctx, 0, 0)
          
                    // return
                    // imgData = ctx.getImageData( (width-ImageDraw.width)/2, (height-ImageDraw.height)/2, ImageDraw.width, ImageDraw.height);
                    // imgData = ctx.getImageData( (width-ImageDraw.width*fitscale)/2, (height-ImageDraw.height*fitscale)/2, ImageDraw.width*fitscale, ImageDraw.height*fitscale);
                    imgData = ctx.getImageData( 0, 0, width, height);

                    ctx.restore();

                    ctx.clearRect(0, 0, width, height);

                    // ctx.putImageData(imgData, (width-Image.width)/2,(height-Image.height)/2);
                    // ctx.putImageData(imgData, 0,0);
                    // return
                }

                
                function scanImageBySector(){
                    // let size = new Vector2(imgData.width/100, imgData.height/100)
                    let size = new Vector2(8, 8)

                    let h = Math.floor(imgData.height/size.y)
                    let w = Math.floor(imgData.width/size.x)

                    let dh = 0, dw = 0 
                    if(h * size.y != height) dh = 1
                    if(w * size.x != width ) dw = 1



                    for(let i = 0; i < h + dh; i++){
                        for(let j = 0; j < w + dw; j++){

                            let take = true
                            let count = 0

                            let sizeX = size.x
                            let sizeY = size.y

                            if(dw == 1 && j == w + dw - 1) sizeX = imgData.width - (w * size.x )
                            if(dh == 1 && i == h + dh - 1) sizeY = imgData.height - (h * size.y )
                            
          
                            for(    let ii = i * size.y; ii < i * size.y + sizeY; ii++){
                                for(let jj = j * size.x; jj < j * size.x + sizeX; jj++){
                                    if(imgData.data[ii*4*imgData.width + jj*4 + 3] == 0  ) count++

                                }
                            }

                            if(count == sizeX*sizeY) take = false

                            // take=true
                            if(take){   

                                let posX = j * size.x + sizeX/2
                                let posY = i * size.y + sizeY/2

                                let offsetX = (MainImage.width - imgData.width/ImageDraw.scale.x)/2 
                                let offsetY = (MainImage.height - imgData.height/ImageDraw.scale.y)/2 

                                let image = new ImageClass(MainImage, j * size.x/ImageDraw.scale.x + offsetX, 
                                                                      i * size.y/ImageDraw.scale.y + offsetY, 
                                                                      sizeX/ImageDraw.scale.x, sizeY/ImageDraw.scale.y, ImageDraw.scale.x, ImageDraw.scale.x);

                                let color = [0,0,0,0]
                                if(dw == 1 && j == w + dw - 1) color = [255,0,0,0]
                                if(dh == 1 && i == h + dh - 1) color = [0,255,0,0]
                                Pixels.push( new Pixel( posX + (width-imgData.width)/2, posY + (height-imgData.height)/2, color, new Vector2(sizeX, sizeY), image, Pixels.length))
                            }
                        }

                    }

                    // for(let i = 0; i < Pixels.length; i++){
                    //     Pixels[i].Draw()
                    // }
                }

            
            function Main(){
                MainImage = MainImages[0]
                ImageDraw = ImageToDraw[0]
                
                HeartImage = MainImages[1]
                HeartImageDraw = ImageToDraw[1] 

                Pixels = []
                loadData();
                // return
                scanImageBySector()
                // return

                if(interval_1) clearInterval(interval_1)
                if(interval_2) clearInterval(interval_2)
                interval_1 = window.setInterval("Update();", 1000/60);  
                interval_2 = window.setInterval("MouseMoveDirection();", 60);
            }
            
            function Update(){

                    if(LoadingElement.style.opacity > 0){
                        LoadingElement.style.opacity -= 0.1
                        if(LoadingElement.style.opacity <= 0)
                            LoadingElement.style.display = "none"
                    }
                        
                    

                    ctxFront.clearRect(0, 0, width, height);

                    if(!Mouse.DragMode){
                        ctx.save()
                        if(enable){
                            ctx.fillStyle = "rgba(255, 255, 255, 0.1";
                        }
                        else{
                            ctx.fillStyle = "rgba(255, 255, 255, 0.01";
                        }
                        ctx.fillRect(0, 0, width, height)
                        ctx.restore()

                    }
                    else{
                        Mouse.DragTimer += 0.1
                    }
                    // ctx.clearRect(0, 0, width, height);
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                   
                    // for(let i=1; i < ImageToDraw.length; i++){
                    //     let offsetx = imageOffset[i][0]
                    //     let offsety = imageOffset[i][1]
          
                    //     if( ParticlesPosition.x > width/2 + offsetx  - ImageToDraw[i].width  * imageScale[i][0]  && ParticlesPosition.x < width/2 + offsetx  + ImageToDraw[i].width  * imageScale[i][0] && 
                    //         ParticlesPosition.y > height/2 + offsety - ImageToDraw[i].height * imageScale[i][1]  && ParticlesPosition.y < height/2 + offsety + ImageToDraw[i].height * imageScale[i][1] && 
                    //         !Mouse.DragMode && enable){
                    //         ImageToDraw[i].Draw(ctx, width/2 + offsetx, height/2 + offsety)
                    //     }
                    // }
               
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
                    let count = 0
                    for(let i = 0; i < Pixels.length; i++){
                        Pixels[i].Update()
                        if(Pixels[i].enable) count++
                    }

                    if (count == Pixels.length-1) {
                        enable = true
                        // print(enable)
                    }
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    // направление движения частиц за мышкой
                    if(!ParticlesPosition.x || !ParticlesPosition.y){
                        ParticlesPosition.x = Mouse.x
                        ParticlesPosition.y = Mouse.y
                    }
                    let direction = new Vector2(ParticlesPosition.x - Mouse.x, ParticlesPosition.y - Mouse.y)
                        ParticlesPosition.x -= direction.x/5
                        ParticlesPosition.y -= direction.y/5
                   
                    //направление движение частицы, после создания
                        direction = new Vector2(-Mouse.Direction.normalized().x, -Mouse.Direction.normalized().y)
                    
                    if(direction.distance() == 0) direction = new Vector2(0, -1)

                        Particles.push( new Particle(ParticlesPosition.x, ParticlesPosition.y, direction, 30, [0, 0, 0]) )
                        Particles.push( new Particle(ParticlesPosition.x, ParticlesPosition.y, direction, 30, [0, 0, 0]) )
                        Particles.push( new Particle(ParticlesPosition.x, ParticlesPosition.y, direction, 30, [0, 0, 0]) )

                    for(let i = 0; i < Particles.length; i++){
                        Particles[i].Update()
                        if (Particles[i].size <= 0){
                            Particles.splice(i, 1)
                            i--
                        }
                    }
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
            }

            var LoadAngle = 0
            function Loading(){

                ctxFront.clearRect(0, 0, width, height);

                LoadAngle += Math.PI/20

                let posX = width/2  + 100 * Math.cos(LoadAngle)
                let posY = height/2 + 100 * Math.sin(LoadAngle)

                let direction = new Vector2(ParticlesPosition.x - posX, ParticlesPosition.y - posY)

                ParticlesPosition.x -= direction.x/5
                ParticlesPosition.y -= direction.y/5

                Particles.push( new Particle(ParticlesPosition.x, ParticlesPosition.y, direction, 30, [0, 0, 0]) )
                Particles.push( new Particle(ParticlesPosition.x, ParticlesPosition.y, direction, 30, [0, 0, 0]) )
                Particles.push( new Particle(ParticlesPosition.x, ParticlesPosition.y, direction, 30, [0, 0, 0]) )

                for(let i = 0; i < Particles.length; i++){
                    Particles[i].Update()
                    if (Particles[i].size <= 0){
                        Particles.splice(i, 1)
                        i--
                    }
                }

            }
  


        
    function MouseMoveDirection(){
            if(Mouse.PrevPos.x == (NaN || null)){
                Mouse.PrevPos.x = Mouse.x;
                Mouse.PrevPos.y = Mouse.y;
            }

            if (Mouse.PrevPos.x == Mouse.x && Mouse.PrevPos.y == Mouse.y && Mouse.Move == true){
                Mouse.Move = false; 
                Mouse.setDirection();
            }
    } 
    window.addEventListener("DOMContentLoaded", function(){

        window.addEventListener('mousemove', function (e) {   //window
            // console.log('mousemove');
            Mouse.x = e.pageX - MyCanvas.offsetLeft;
            Mouse.y = e.pageY - MyCanvas.offsetTop;  
            
            if(Mouse.PrevPos.x == (NaN || null)){
                Mouse.PrevPos.x = Mouse.x;
                Mouse.PrevPos.y = Mouse.y;
            }

            Mouse.Move = true; 
            Mouse.setDirection()

            Mouse.PrevPos.x = Mouse.x;
            Mouse.PrevPos.y = Mouse.y;
        })


        window.addEventListener('mousedown', function (e) { 
                
            Mouse.x = e.pageX - MyCanvas.offsetLeft;
            Mouse.y = e.pageY - MyCanvas.offsetTop;  

            Mouse.MouseDown.x = e.pageX - e.target.offsetLeft;
            Mouse.MouseDown.y = e.pageY - e.target.offsetTop;

            if(e.button==0) {
                Mouse.DragMode = true; 
            }   

            if(e.button==1){
                for(let i = 0; i < Pixels.length; i++){
                        Pixels[i].Explode()
                }
            
            }
            // onMouseDown(e.button);     
        })

        window.addEventListener('mouseup'  , function (e) {
                Mouse.MouseUp.x = e.pageX - MyCanvas.offsetLeft;
                Mouse.MouseUp.y = e.pageY - MyCanvas.offsetTop;
                Mouse.DragMode = false; 
                // onMouseUp();

                Mouse.DragTimer = 0
                for(let i = 0; i < Pixels.length; i++){
                        Pixels[i].Explode()
                }
                enable = false
            })

        window.addEventListener('resize', function(){
            // console.log("Window Resize");
            Resize()

            if(ImageToDraw.length != links.length) return

            Main()

        })
    });
 

