class MouseClass{
    constructor(r){
        this.x;
        this.y;

        this.MouseDown  = new Vector2;
        this.MouseUp    = new Vector2;
        this.PrevPos    = new Vector2;

        this.Direction = new Vector2(0, 0);
        this.DirectionClick  = new Vector2(0, 0);
        this.DragMode = false;
        this.DragTimer = 0

        this.Move = false;

        this.radius = r;
        this.speed;
    }
    setDirectionClick(){
        this.DirectionClick = new Vector2(Mouse.MouseUp.x - Mouse.MouseDown.x,  Mouse.MouseUp.y - Mouse.MouseDown.y);
    }
    setDirection(){
        this.Direction = new Vector2(Mouse.x - Mouse.PrevPos.x,  Mouse.y - Mouse.PrevPos.y);
        this.speed = this.Direction.distance();
    }
    drawRadius(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radious, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
    }
    drawDirection(){
        if(this.Direction){
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.Direction.x * 10 , this.y + this.Direction.y * 10);
            ctx.strokeStyle = '#00ff00';
            ctx.stroke();
        }
    }
    drawDirectionClick(){
        ctx.beginPath();
        ctx.moveTo(this.MouseDown.x, this.MouseDown.y);
        ctx.lineTo(this.MouseUp.x, this.MouseUp.y);
        ctx.strokeStyle = '#ffff00';
        ctx.stroke();
    }
}

class Vector2{
    constructor(x,y){
       this.x = x;
       this.y = y;
   } 
   module(){
       return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2));
   } 
   distance(){
       return Math.sqrt(this.x * this.x + this.y * this.y);
   }   
   normalized(){
       if(this.distance()==0)
           return new Vector2(0, 0);
       else
           return new Vector2(this.x/this.distance(), this.y/this.distance());
       }   
   }