(function(){
	//游戏类
	var Game = window.Game = function(tableid){
		//表格
		this.table = document.getElementById(tableid);
		//帧编号
		this.f = 0;
		//转块
		this.block = new Block();
		//地图
		this.map = new Map();
		//创建表格
		this.init();
		//开始定时器
		this.start();
		//绑定监听
		this.bindEvent();
	}
	//初始化
	Game.prototype.init = function(){
		//创建20行，12列的表格
		for(var row = 0 ; row < 20 ; row++){
			var tr = document.createElement("tr");
			for(var col = 0 ; col < 12 ; col++){
				var td = document.createElement("td");
				// td.innerHTML = row + "," + col;
				//td上树
				tr.appendChild(td);
			}
			//tr上树
			this.table.appendChild(tr);
		}
	}
	//设置类名
	Game.prototype.setClass = function(row,col,_class){
		this.table.getElementsByTagName("tr")[row].getElementsByTagName("td")[col].className = _class;
	}
	//清屏
	Game.prototype.clear = function(){
		for(var row = 0 ; row < 20 ; row++){
			for(var col = 0 ; col < 12 ; col++){
				this.setClass(row,col,"");
			}
		}
	}
	//绑定监听
	Game.prototype.bindEvent = function(){
		var self = this;
		document.onkeydown = function(event){
			if(event.keyCode == 37){
				//左键
				if(!self.block.compare(self.map.cut(self.block.row, self.block.col - 1))){
					self.block.goLeft();
				}
			}else if(event.keyCode == 39){
				//右键
				if(!self.block.compare(self.map.cut(self.block.row, self.block.col + 1))){
					self.block.goRight();
				}
			}else if(event.keyCode == 38){
				//上键，旋转
				if(!self.block.compare(self.map.cut(self.block.row,self.block.col),self.block.getNextDirectionMatrix())){
					self.block.rotate();
				}
			}else if(event.keyCode == 40){
				//空格键直接下落。
				while(!self.block.compare(self.map.cut(self.block.row + 1, self.block.col))){
					self.block.goDown();
				}
				document.getElementById("dropmusic").load();
				document.getElementById("dropmusic").play();
			}
		}
	}
	//开始定时器
	Game.prototype.start = function(){
		var self = this;
		//定时器
		this.timer = setInterval(function(){
			//①帧编号++
			self.f ++;
			//②显示帧编号，方便我们调试，方便我们判断定时器此时在运行
			document.getElementById("tip").innerHTML = "帧编号：" + self.f;
			//③清屏
			self.clear();
			//④渲染砖头
			if(self.f % 20 == 0){
				//现在我们要判断转块是否能够下落，对的，判断这个事儿写在Game类里面！
				//因为如果写在转块里面，此时转块势必要去获得Map的信息，此时砖头太过于智能，不好维护。
				if(!self.block.compare(self.map.cut(self.block.row + 1 , self.block.col))){
					self.block.goDown();
				}else{
					// console.log("死亡");
					//融合！！！
					self.map.integrate(self.block.row,self.block.col,self.block.matrix,self.block.type);
					//看看死的时候是不是死在了0行一下
					if(self.block.row <= 0){
						alert("GAME OVER");
						clearInterval(self.timer);
						return;
					}
					//死去吧，我们不要你了
					self.block = new Block();
					//进行消行判定
					self.map.check();
				}
			}
			self.block.render();
			//⑤渲染地图（死去的转块）
			self.map.render();

		},20);
	}
})();