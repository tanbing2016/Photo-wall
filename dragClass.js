/**
 * Created by Administrator on 2016/11/13.
 */
function Emitter(){};
Emitter.prototype.on=function(type,fn){
    if(!this[type]){
        this[type]=[];
    }
    var a=this[type];
    for(var i=0;i< a.length;i++){
        if(a[i]===fn){
            return ;
        }
    }
    a.push(fn);
    return this;
};
Emitter.prototype.off=function(type,fn){
    var a=this[type];
    if(a){
        for(var i=0;i< a.length;i++){
            if(a[i]===fn){
                a[i]=null;
                break;
            }
        }
    }
    return this;
};
Emitter.prototype.run=function(type,e){
    var a=this[type];
    if(a) {
        for (var i = 0; i < a.length; i++) {
            if (typeof a[i] === "function") {
                a[i].call(this, e)
            }
            else {
                a.splice(i, 1);
                i--;
            }
        }
    }
};
function Drag(ele){
    this.ele=ele;
    this.l=null;
    this.t=null;
    var that=this;
    this.Down=function(e){
        that.down.call(that,e);
    }
    this.Move=function(e){
        that.move.call(that,e);
    }
    this.Up=function(e){
        that.up.call(that,e);
    }
    on(this.ele,"mousedown",that.Down);
}
Drag.prototype=new Emitter();
Drag.prototype.constructor=Drag;
Drag.prototype.down=function(e){
    this.l= e.pageX-this.ele.offsetLeft;
    this.t= e.pageY-this.ele.offsetTop;
    if(this.ele.setCapture){
        on(this.ele,"mousemove",this.Move);
        on(this.ele,"mouseup",this.Up);
    }
    on(document,"mousemove",this.Move);
    on(document,"mouseup",this.Up);
    this.run("selfdragstart",e)
}
Drag.prototype.move=function(e){
    var l= e.pageX-this.l,t= e.pageY-this.t;
    var minL= 0,minT=0;
    var maxL=(document.documentElement.clientWidth||document.body.clientWidth)-this.ele.offsetWidth;
    var maxT=(document.documentElement.clientHeight||document.body.clientHeight)-this.ele.offsetHeight;
    l= l<minL ? minL : l > maxL ? maxL : l;
    t= t<minT ? minT : t > maxT ? maxT : t;
    this.ele.style.left=l+"px";
    this.ele.style.top=t+"px";
    e.preventDefault();
    this.run("selfdragging",e);
}
Drag.prototype.up=function(e){
    if(this.ele.releaseCapture){
        this.ele.releaseCapture();
        off(this.ele,"mousemove",this.Move);
        off(this.ele,"mouseup",this.Up);
    }
    else{
        off(document,"mousemove",this.Move);
        off(document,"mouseup",this.Up);
    }
    this.run("selfdragend",e);
}
