var game={
	RN:4,//maximum to 5
	CN:4,//maximum to 5
	data:null,
	score:0,
	GAMEOVER:0,
	RUNNING:1,
	state:1,
	CSIZE:110,
	OFFSET:8,
	isRefreshed:false,
	isRemoved:false,
	canRemove:false,
	init:function(){
		var width=this.CN*(this.CSIZE+this.OFFSET)+this.OFFSET;
		var height=this.RN*(this.CSIZE+this.OFFSET)+this.OFFSET;
		Panel.style.width=width+"px";
		Panel.style.height=height+"px";
		for(var r=0,arr=[];r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				arr.push(""+r+c);
			}
		}
		Panel.innerHTML='<div id="g'+arr.join('" class="grid"></div><div id="g')+'" class="grid"></div>';
		Panel.innerHTML+='<div id="c'+arr.join('" class="cell"></div><div id="c')+'" class="cell"></div>';
		Panel.innerHTML+='<div id="current"><p>Current:</p><span id="currBlock" class="outGrid"></span></div><div id="next"><p>Next:</p><span id="nextBlock" class="outGrid"></span></div>'
		current.style.top=40+"px";
		current.style.left=width+50+"px";
		next.style.top=height/2+30+"px";
		next.style.left=width+50+"px";
		$('#Panel .cell').on('click',function(){
			game.putIn(this);
		})
	},
	start:function(){
		this.init();
		this.state=this.RUNNING;
		this.score=0;
		this.data=[];
		for(var r=0;r<this.RN;r++){
			this.data.push([]);
			for(var c=0;c<this.CN;c++){
				this.data[r][c]=0;
			}
		}
		this.activeHelpfulItem();
		this.firstNum();
		this.firstNextNum();
		this.updateView();
	},
	activeHelpfulItem:function() {
		this.isRefreshed = false;
		this.isRemoved = false;
		this.canRemove = false;
		$('.itemCell img')[0].src = './imgs/refresh_black.png';
		$('.itemCell img')[1].src = './imgs/delete_black.png';
	},
	isGameOver:function(){
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				if(this.data[r][c]==0){
					return false;
				}
			}
		}
		return true;
	},
	helpfulItemRefresh:function(target) {
		if (!this.isRefreshed) {
			this.isRefreshed = true;
			this.firstNum();
			target.children[0].src = "./imgs/refresh_red.png"
		}
	},
	helpfulItemRemove:function(target) {
		if (!this.isRemoved) {
			this.isRemoved = true;
			this.canRemove = true;
			target.children[0].src = "./imgs/delete_red.png"
		}

	},
	firstNum:function(){
		var currNum=Math.floor(Math.random()*6+1);
		while( currNum === parseInt(currBlock.innerHTML)){
			currNum=Math.floor(Math.random()*6+1);
		}
		currBlock.innerHTML=currNum;
		currBlock.className="outGrid n"+currNum;
	},
	firstNextNum:function(){
		var nextNum=Math.floor(Math.random()*6+1);
		nextBlock.innerHTML=nextNum;
		nextBlock.className="outGrid n"+nextNum;
	},
	randomNum:function(){
		var max=0;
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				if(max<this.data[r][c]){max=this.data[r][c]}
			}
		}
		var currNum=max>=8?Math.floor(Math.random()*(max-2)+1):
			max>=5?Math.floor(Math.random()*(max-1)+1):Math.floor(Math.random()*2+1);
		nextBlock.innerHTML=currNum;
		nextBlock.className="outGrid n"+currNum;
	},
	putIn:function(position){
		var clickR=parseInt(position.id[1]);
		var clickC=parseInt(position.id[2]);
		if (this.canRemove) {
			if (this.data[clickR][clickC] != 0) {
				this.data[clickR][clickC] = 0;
				this.updateView();
				this.canRemove = false;
			} else {
				alert("please press an cell which is not empty!")
			}
		} else {
			if(this.data[clickR][clickC]==0){
				this.data[clickR][clickC]=currBlock.innerHTML;
				currBlock.innerHTML=nextBlock.innerHTML;
				currBlock.className="outGrid n"+nextBlock.innerHTML;
				this.randomNum();
				this.updateView();
				this.check(clickR,clickC);
			}
		}


	},
	updateView:function(){
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				var div=document.getElementById("c"+r+c);
				if(this.data[r][c]==0){
					div.innerHTML="";
					div.className="cell";
				}else{
					div.innerHTML=this.data[r][c];
					div.className="cell n"+this.data[r][c];
				}
			}
		}
		// console.log(this.state);
		gameOver.style.display=this.state==this.GAMEOVER?'block':'none';
		this.state==this.GAMEOVER&&(final.innerHTML=this.score);
	},
	check:function(r,c){
		var n;
		while(true){
			var oldNum=parseInt(this.data[r][c]);
			n=0;
			for(var i=r-1;i<=r+1;i++){
				for(var	j=c-1;j<=c+1;j++){
					if((i>=0&&i<this.RN)&&(j>=0&&j<this.CN)){
						if(this.data[i][j]==oldNum){
							if(!(i==r&&j==c)){
								/*存在动画越来越快的问题*/
								animation.addTasks(i,j,r,c);
								animation.startMove(function(){	
									if(this.isGameOver()){this.state=this.GAMEOVER;}
									else{this.state=this.RUNNING;}
									this.updateView();
								}.bind(this));
								this.data[i][j]=0;
								n++;
							}
						}
					}
				}
			}
			this.data[r][c]=oldNum;
			if(n>0){
				this.data[r][c]++;
				this.score+=(oldNum*(n+2))+1;
				score.innerHTML=this.score;
			}else{
				return;
			}
		}
	}
};
window.onload=function(){game.start()};