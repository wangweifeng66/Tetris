(function(){
	var Map = window.Map = function(){
		//@Array 矩阵
		this.matrix = [
			"QQ000000000000QQ",
			"QQ000000000000QQ",
			"QQ000000000000QQ",
			"QQ000000000000QQ",
			"QQ000000000000QQ",
			"QQ000000000000QQ",
			"QQ000000000000QQ",
			"QQ000000000000QQ",
			"QQ000000000000QQ",
			"QQ000000000000QQ",
			"QQ000000000000QQ",
			"QQ000000000000QQ",
			"QQ000000000000QQ",
			"QQ000000000000QQ",
			"QQ000000000000QQ",
			"QQ000000000000QQ",
			"QQ000000000000QQ",
			"QQ000000000000QQ",
			"QQ000000000000QQ",
			"QQ000000000000QQ",
			"QQQQQQQQQQQQQQQQ",
			"QQQQQQQQQQQQQQQQ",
			"QQQQQQQQQQQQQQQQ",
			"QQQQQQQQQQQQQQQQ",
			"QQQQQQQQQQQQQQQQ"
		]
	}
	//渲染方法
	Map.prototype.render = function(){
		//渲染20行12列，填写类名
		for(var row = 0 ; row < 20 ; row++){
			for(var col = 0 ; col < 12 ; col++){
				//得到这一位，加2的目的是修正左边的墙Q
				var char = this.matrix[row].charAt(col + 2);
				if(char != "0"){
					//渲染，填颜色
					game.setClass(row,col,char);
				}
			}
		}
	}
	//切片方法
	Map.prototype.cut = function(row,col){
		//这个函数接受行号、列号，
		//返回这里的4*4（一维数组["0000","00T0","000S","0000"]）
		var result = [];
		for(var i = row ; i < row + 4 ; i++){
			result.push(this.matrix[i].substr(2 + col ,4));
		}
		return result;
	}
	//“融入”方法，接受四个参数，行号、列号、十六进制数字、要替换为的类名
	//比如传入3,6,0x6440,"L"   。  就表示,0x6440死在了3、6。此时请用"L"进行融合
	//此时就要将这个人的尸体，融入地图的矩阵
	Map.prototype.integrate = function(row,col,blockMatrix,classname){
		for(var i = 0 ; i < 4 ; i++){
			for(var j = 0; j < 4 ; j++){
				// console.log(row + i, col+ j+2);
				 borunqing(blockMatrix,i,j) == 1 && (this.matrix[row + i] = changeString(this.matrix[row + i] , col + j + 2 , classname));
			}
		}
	}
	//消行判定
	Map.prototype.check = function(){
		for(var i = 19 ; i >= 0 ; i--){
			//如果这一行的字符串中没有0这个字符出现，就是满行
			if(this.matrix[i].indexOf("0") == -1){
				this.matrix.splice(i,1);

				this.matrix.unshift("QQ000000000000QQ");
				//这里我们跑一个题，
				i++;
			}
		}
	}

	//功能函数，薄润清大定理：一个方块0xabcd第m行第n个块的亮灭状态就是：
	//(0xabcd >> (3 - m) * 4 & 0xf) >> (3-n) & 0x1
	//请看笔记
	function borunqing(fangkuai,hang,lie){
		return (fangkuai >> (3 - hang) * 4 & 0xf) >> (3 - lie) & 0x1;
	}

	//功能函数。这个函数的功能是接受一个字符串string，把这个字符串的第pos位变为chr
	//比如changeString("我爱王俊凯",1,"很喜欢");
	//返回"我很喜欢王俊凯";
	function changeString(string,pos,chr){
		return string.substr(0,pos) + chr + string.substr(pos + 1)
	}
})();