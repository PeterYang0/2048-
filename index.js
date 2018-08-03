$(function(){
	new Game();
});

function Game(){
	this.score=0;
	this.maxScore=0;
	isNewNum=false;
	this.init();
};
Game.prototype={
	init:function(){
		this.bindEvent();
		this.gameInit();
	},
	gameInit:function(){//初始化游戏
		var _this=this;
		this.newNum();//随机在两个位置生成数字
		this.newNum();//随机在两个位置生成数字
		var max=this.getMaxScore();
		$('#maxScore').html(this.maxScore);
		$('#nowScore').html(this.score);
		this.refreshColor();
		this.touchEvent();
	},
	newNum:function(){//随机生成一个数字
		var arr=[2,2,4];
		var i=Math.floor(Math.random()*3);//arr[i]
		var j=Math.floor(Math.random()*$('.emptyItem').length-1);
		$('.emptyItem').eq(j).html(arr[i]).removeClass('emptyItem').addClass('notEmptyItem');
	},
	getMaxScore:function(){//获取最大得分
	    if (window.localStorage.getItem('max')) {
	        this.maxScore = localStorage.getItem('max')*1;
	    } else {
	       this.maxScore = 0;
	    };
	},
    //刷新颜色
    refreshColor:function() {
        for (var i = 0; i < $('.item').length; i++) {
            switch ($('.item').eq(i).html()) {
                case '':
                    $('.item').eq(i).css('background', '');
                    break;
                case '2':
                    $('.item').eq(i).css('background', 'rgb(250, 225, 188)');
                    break;
                case '4':
                    $('.item').eq(i).css('background', 'rgb(202, 240, 240)');
                    break;
                case '8':
                    $('.item').eq(i).css('background', 'rgb(117, 231, 193)');
                    break;
                case '16':
                    $('.item').eq(i).css('background', 'rgb(240, 132, 132)');
                    break;
                case '32':
                    $('.item').eq(i).css('background', 'rgb(181, 240, 181)');
                    break;
                case '64':
                    $('.item').eq(i).css('background', 'rgb(182, 210, 246)');
                    break;
                case '128':
                    $('.item').eq(i).css('background', 'rgb(255, 207, 126)');
                    break;
                case '256':
                    $('.item').eq(i).css('background', 'rgb(250, 216, 216)');
                    break;
                case '512':
                    $('.item').eq(i).css('background', 'rgb(124, 183, 231)');
                    break;
                case '1024':
                    $('.item').eq(i).css('background', 'rgb(225, 219, 215)');
                    break;
                case '2048':
                    $('.item').eq(i).css('background', 'rgb(221, 160, 221)');
                    break;
                case '4096':
                    $('.item').eq(i).css('background', 'rgb(250, 139, 176)');
                    break;
            }
        }
    },
	bindEvent:function(){
		var _this=this;
		$('.close').on('click',function(){//关闭结束画面
			$('.module').hide();
		});
		//键盘监听事件
		$('body').keydown(function(e) {
			switch(e.keyCode){
				case 37:
					isNewNum=false;
					_this.move('left');
					_this.isGameover();
					break;
				case 38:
					isNewNum=false;
					_this.move('top');
					_this.isGameover();
					break;
				case 39:
					isNewNum=false;
					_this.move('right');
					_this.isGameover();
					break;
				case 40:
					isNewNum=false;
					_this.move('bottom');
					_this.isGameover();
					break;
			}
		});
		$('.restart').on('click',function(){
			_this.reset();
		})
	},
	move:function(w){//移动
		var _this=this;
		var notEmptyItems = $('.notEmptyItem');
		if (w=='left' || w=='top') {
			for(var i=0;i<notEmptyItems.length;i++){
				var currentItem=notEmptyItems.eq(i);
				_this.itemMove(currentItem,w);
			};
		}else if(w=='right' || w=='bottom'){
			for(var i=notEmptyItems.length-1;i>=0;i--){
				var currentItem=notEmptyItems.eq(i);
				_this.itemMove(currentItem,w);
			};
		};
		if (isNewNum) {
			_this.newNum();
			_this.refreshColor();
		}
	},
	itemMove:function(currentItem,w){
		var _this=this;
		var sideItem=this.getSideItem(currentItem,w);
		if (sideItem.length==0) {
			return
			//靠边不动
		}else if(sideItem.html()==''){//旁边是空值
			sideItem.html(currentItem.html());
			currentItem.html('');
			sideItem.removeClass('emptyItem').addClass('notEmptyItem');
			currentItem.removeClass('notEmptyItem').addClass('emptyItem');
			_this.itemMove(sideItem,w);
			isNewNum=true;
		}else if(currentItem.html()===sideItem.html()){//相同的数，要相加
			sideItem.html(currentItem.html()*2);
			currentItem.html('');
			sideItem.removeClass('emptyItem').addClass('notEmptyItem');
			currentItem.removeClass('notEmptyItem').addClass('emptyItem');
			_this.score+=sideItem.html()*10;//分值
			$("#nowScore").html(_this.score)
			isNewNum=true;
		}else if(currentItem.html()!=sideItem.html()){//不同的数不动
			//不相同，不动
			return
		}
	},
	getSideItem:function(currentItem,w){
		var currentItemX=currentItem.attr('x')*1;
		var currentItemY=currentItem.attr('y')*1;
		switch(w){
			case 'left':
				var x=currentItemX;
				var y=currentItemY-1;
				var sideItem=$('.x'+x+'y'+y);
				break;
			case 'right':
				var x=currentItemX;
				var y=currentItemY+1;
				var sideItem=$('.x'+x+'y'+y);
				break;
			case 'bottom':
				var x=currentItemX+1;
				var y=currentItemY;
				var sideItem=$('.x'+x+'y'+y);
				break;
			case 'top':
				var x=currentItemX-1;
				var y=currentItemY;
				var sideItem=$('.x'+x+'y'+y);
				break;
		}
		return sideItem;
	},
	isGameover:function(){
		var _this=this;
		var notEmptyItems=$('.notEmptyItem');
		var items=$('.item');
		if (notEmptyItems.length===items.length) {
			for(var i=0;i<notEmptyItems.length;i++){
				var notEmptyItem=notEmptyItems.eq(i);
				if (_this.getSideItem(notEmptyItem,'left').length!=0&&_this.getSideItem(notEmptyItem,'left').html()==notEmptyItem.html()) {
					//上边元素存在 且 当前元素中的内容等于上边元素中的内容//游戏未结束
					return 
				}else if (_this.getSideItem(notEmptyItem,'right').length!=0&&_this.getSideItem(notEmptyItem,'right').html()==notEmptyItem.html()) {
					//上边元素存在 且 当前元素中的内容等于上边元素中的内容//游戏未结束
					return 
				}else if (_this.getSideItem(notEmptyItem,'top').length!=0&&_this.getSideItem(notEmptyItem,'top').html()==notEmptyItem.html()) {
					//上边元素存在 且 当前元素中的内容等于上边元素中的内容//游戏未结束
					return
				}else if (_this.getSideItem(notEmptyItem,'bottom').length!=0&&_this.getSideItem(notEmptyItem,'bottom').html()==notEmptyItem.html()) {
					//上边元素存在 且 当前元素中的内容等于上边元素中的内容//游戏未结束
					return
				}
			}
		}else{//格子没满
				return 
		}
		$('.module').show();
		if (_this.score>localStorage.getItem('max')) {
			_this.maxScore=_this.score;
			localStorage.setItem('max',_this.score);
		}
	},
	reset:function(){
		var notEmptyItem=$('.notEmptyItem');
		for(var i=0;i<notEmptyItem.length;i++){
			notEmptyItem.eq(i).html('').removeClass('notEmptyItem').addClass('emptyItem');
		};
		this.newNum();//随机在两个位置生成数字
		this.newNum();//随机在两个位置生成数字
		this.refreshColor();//添加颜色
		this.score=0;
		$('#nowScore').html(0);
		$('#maxScore').html(this.maxScore);
		$('.module').hide();
	},
	///手机滑动事件
	touchEvent:function(){
		var _this=this;
        mobilwmtouch(document.getElementById("table"))
        document.getElementById("table").addEventListener('touright', function (e) {
            e.preventDefault();
            isNewNum = false;
            _this.move('right');
            _this.isGameover();
        });
        document.getElementById("table").addEventListener('touleft', function (e) {
            isNewNum = false;
            _this.move('left');
            _this.isGameover();
        });
        document.getElementById("table").addEventListener('toubottom', function (e) {
            isNewNum = false;
            _this.move('bottom');
            _this.isGameover();
        });
        document.getElementById("table").addEventListener('touup', function (e) {
            console.log('top');
            isNewNum = false;
            _this.move('top');
            _this.isGameover();
        });

        function mobilwmtouch(obj) {
            var stoux, stouy;
            var etoux, etouy;
            var xdire, ydire;
            obj.addEventListener("touchstart", function (e) {
                stoux = e.targetTouches[0].clientX;
                stouy = e.targetTouches[0].clientY;
            }, false);
            obj.addEventListener("touchend", function (e) {
                etoux = e.changedTouches[0].clientX;
                etouy = e.changedTouches[0].clientY;
                xdire = etoux - stoux;
                ydire = etouy - stouy;
                chazhi = Math.abs(xdire) - Math.abs(ydire);
                if (xdire > 0 && chazhi > 0) {
                    obj.dispatchEvent(evenzc('touright'));
                } else if (ydire > 0 && chazhi < 0) {
                    obj.dispatchEvent(evenzc('toubottom'));
                } else if (xdire < 0 && chazhi > 0) {
                    obj.dispatchEvent(evenzc('touleft'));
                } else if (ydire < 0 && chazhi < 0) {
                    obj.dispatchEvent(evenzc('touup'));
                }
            }, false);

            function evenzc(eve) {
                if (typeof document.CustomEvent === 'function') {
                    this.event = new document.CustomEvent(eve, {//自定义事件名称
                        bubbles: false,//是否冒泡
                        cancelable: false//是否可以停止捕获
                    });
                    if (!document["evetself" + eve]) {
                        document["evetself" + eve] = this.event;
                    }
                } else if (typeof document.createEvent === 'function') {
                    this.event = document.createEvent('HTMLEvents');
                    this.event.initEvent(eve, false, false);
                    if (!document["evetself" + eve]) {
                        document["evetself" + eve] = this.event;
                    }
                } else {
                    return false;
                }
                return document["evetself" + eve];
            }
        }
	}
};

    