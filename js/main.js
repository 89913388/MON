(function (){
	/* 登录验证 */
	var validate={
		close:function(target){
			if(util.getCookies().closeSuc=='true'){
				target.style.display='none';
			}else{
				target.style.display='block';
			}
		},
		follow:function(url,target1,target2){
			util.getAjax(url,'',function(data){
				if(data==1){
					util.setCookie('followSuc','true');
					validate.followed(target1,target2);
				}
			});	
		},
		followed:function(target1,target2){
			if(util.getCookies().followSuc=='true'){
				target1.style.display='none';
				target2.style.display='inline-block';
			}else{
				target1.style.display='inline-block';
				target2.style.display='none';
			}
		},
		msg:function(target,targetMsg){
			if(target.value==''){
				target.style.borderColor='red';
				target.focus();
				targetMsg.innerHTML='请填写此字段。';
				return false;
			}else{
				target.style.borderColor='green';
				targetMsg.innerHTML='';
				return true;
			}
		},
		form:function(target1,target2,targetMsg){
			return validate.msg(target1,targetMsg) && validate.msg(target2,targetMsg);
		},
		pass:function(url1,url2,target1,target2,targetMsg,target3,target4,targetBox){
			if(util.getCookies.loginSuc!='true'){
				var sName=md5(target1.value);
				var sPass=md5(target2.value);
				util.getAjax(url1,{'userName':sName,'password':sPass},function(data){
					if( data && data == 1){
					    targetBox.style.display='none';
						document.body.style.overflow='visible';	
						util.setCookie('loginSuc','true');
						validate.follow(url2,target3,target4);				
			    	}else{
			    		targetMsg.innerHTML='您输入的帐号或密码错误！';
			    	}
				});
			}
		}
	};
	/* f-hover */ 
	var hover = function(){
		var target = $('.f-hover');
		var control = $('.closeBtn');
		validate.close(target);
		util.addEvent(control,'click',function(){
			util.setCookie('closeSuc','true');	
			validate.close(target);
		});
	};
	/* f-follow && m-login */ 
	var login = function(folUrl,logUrl){		
		var oLM=$('.m-login');
		var oFBtn=$('.folBtn');
		var oEBtn=$('.escBtn');
		var oLBtn=$('.loginBtn');
		var oCBtn=$('.cancelBtn');
		var oLCBtn=$('.loginClose');

		var oName=$('.userName');
		var oPass=$('.password');
		var oMsg=$('.loginMsg');
		
		util.addEvent(oFBtn,'click',function(){
			if(util.getCookies().loginSuc=='true'){
				validate.follow(folUrl,oFBtn,oEBtn);
			}else{
				document.body.style.overflow='hidden';
				oLM.style.display='block';
			}
		});
		util.addEvent(oName,'blur',function(){
			validate.msg(this,oMsg);
		});
		util.addEvent(oPass,'blur',function(){
			validate.msg(this,oMsg);
		});
		util.addEvent(oCBtn,'click',function(){
			util.removeCookie('followSuc');
			validate.followed(oFBtn,oEBtn);
		});
		util.addEvent(oLBtn,'click',function(){
			if(validate.form(oName,oPass,oMsg)){
				validate.pass(logUrl,folUrl,oName,oPass,oMsg,oFBtn,oEBtn,oLM);
			}						
		});
		util.addEvent(oLCBtn,'click',function(){
			oLM.style.display='none';
			document.body.style.overflow='visible';
			oMsg.innerHTML='';
		});
	};
	/* m-banner */
	var banner=function(parentNode){
		var parentNode = $('.m-banner');
		var aLi=parentNode.getElementsByTagName('li');
		var aI=parentNode.getElementsByTagName('i');
		var len=aLi.length;
		var next=1;
		var tab=function(){			
			for(var i=0;i<len;i++){
				aLi[i].className='';
			}
			aLi[next%len].style.opacity=0;
			aLi[next%len].stylefilter='alpha(opacity:0)';
			aLi[next%len].className='z-active';
			for(var i=0;i<len;i++){
				aI[i].className='';
			}
			aI[next%len].className='z-light';
			util.fadeIn(aLi[next%len],{'opacity':100});
			next++;
		}
		for(var i=0;i<len;i++){
			aI[i].index=i;
			util.addEvent(aI[i],'click',function(){
				next=this.index;
				tab();
			});
		}
		var banTimer = setInterval(tab,5000);
		util.addEvent(parentNode,'mouseover',function(){
			clearInterval(banTimer);	
		});
		util.addEvent(parentNode,'mouseout',function(){
			banTimer = setInterval(tab,5000);
		});
	};
	/* g-content */
	var subject = function(subUrl){
		var subUrl = subUrl;
		var oDesign = $('.hDesign');
		var oLang = $('.hLang');
		var oContainer = $('.fUl'); 
		var type = 10;
		var totalPage = 1;
		var createSub = function(){
			util.getAjax(subUrl,{'pageNo':1,'psize':20,'type':10},function(data){
				var obj = $('.m-center');
				var data = JSON.parse(data);				
				for(var i=0;i<data.list.length;i++){
					var temp = data.list[i].price;
					if(temp == 0){
						temp = '免费';
					}else{
						temp = '￥' + temp.toFixed(2); 
					}
					var str = '<div class="subject">' 
							+ '<ul class="sList">'
							+ '<li class="sImg"><img class="subImg" src="' + data.list[i].middlePhotoUrl + '" alt="图片"></li>'
							+ '<li class="sTitle">' + data.list[i].name + '</li>'
							+ '<li class="sIntroduce">' + data.list[i].provider + '</li>'
							+ '<li class="sPerson"><em class="personBox"><span class="person">' + data.list[i].learnerCount + '</span></em></li>'
							+ '<li class="sPrice"><span class="price">' + temp + '</span></li>'
							+ '<li class="sTrans">'
							+ '<div class="sTop clear">'
							+ '<img class="sTopImg" src="' + data.list[i].middlePhotoUrl + '" alt="图片">'
							+ '<ul class="sTopCon">'
							+ '<li class="sTopTitle">' + data.list[i].name + '</li>'
							+ '<li class="sTopPerson"><span class="sTPerson"></span><span class="sTopCount">' +  data.list[i].learnerCount + '</span>人在学</li>'
							+ '<li class="sTopAuthor">发布者：<span class="sTAuthor">' + data.list[i].provider + '</span></li>'
							+ '<li class="sTopClass">分类：<span class="sTClass">' + data.list[i].categoryName + '</span></li>'
							+ '</ul>'
							+ '</div>'
							+ '<div class="sBottom"><p class="sBotCon">' + data.list[i].description + '</p></div>'
							+ '</li>'
							+ '</ul>'
						    + '</div>';
					obj.innerHTML += str;
				}
				update(data);
				setPage(oContainer,totalPage,1);
			});
		}
		var subAjax = function(subUrl,pageNo,psize,type){
			var subUrl = subUrl;
			var pageNo = pageNo,
			 	psize = psize,
				type = type;
			util.getAjax(subUrl,{'pageNo':pageNo,'psize':psize,'type':type},function(data){
				update(JSON.parse(data));
			});			
		};
		
		function update(data){	
			totalPage = data.totalPage;		
			var aImg = $('.subImg');
			var aTitle = $('.sTitle');
			var aIntroduce = $('.sIntroduce');
			var aPerson = $('.person');
			var aPrice = $('.price');
			var aTopImg = $('.sTopImg');
			var aTopTitle = $('.sTopTitle');
			var aTopAuthor = $('.sTAuthor');
			var aTopPerson = $('.sTopCount');
			var aTopClass = $('.sTClass');
			var aBotCon = $('.sBotCon');		
			var len = aTitle.length;

			for(var i=0;i<len;i++){
				var temp = data.list[i].price;
				var tClass;
				if(temp == 0){
					temp = '免费';
				}else{
					temp = '￥' + temp.toFixed(2); 
				}
				if(!data.list[i].categoryName){
					tClass = '无';
				}
				aImg[i].src = data.list[i].middlePhotoUrl;
				aTitle[i].innerHTML = data.list[i].name;
				aIntroduce[i].innerHTML = data.list[i].provider;
				aPerson[i].innerHTML = data.list[i].learnerCount;
				aPrice[i].innerHTML = temp;

				aTopImg[i].src = data.list[i].middlePhotoUrl;
				aTopTitle[i].innerHTML = data.list[i].name;
				aTopAuthor[i].innerHTML = data.list[i].provider;
				aTopPerson[i].innerHTML = data.list[i].learnerCount;
				aTopClass[i].innerHTML = tClass;
				aBotCon[i].innerHTML = data.list[i].description;
			}
			showOperate();
		};
		function showOperate(){
			var oParent = $('.m-center');
			var aTrans = util.getClassName(oParent,'sTrans');
			var aList = $('.sList');
			for(var i=0;i<aTrans.length;i++){
				aList[i].index = i;
				util.addEvent(aList[i],'mouseover',function(){
					if(aTrans[this.index]){
						aTrans[this.index].style.display='block';
					}
				});
				util.addEvent(aList[i],'mouseout',function(){
					if(aTrans[this.index]){
						aTrans[this.index].style.display='none';
					}
				});			
			}
		}
		//container 容器，totalPage 总页数 currentPage 当前页数
		function setPage(container,totalPage,currentPage){
			var container = container;
			var totalPage = totalPage;
			var currentPage = currentPage;
			var a = [];
		  	a[a.length] = '<li class="fLt"></li>';
		  	function setPageList(){
		    	if (currentPage == i) {
		      		a[a.length] = '<li class="z-active">' + i + '</li>';
		    	}else{
		    		a[a.length] = '<li>' + i + '</li>';
		    	}
		  	}
		  	if (totalPage <= 10) {
			    for (var i = 1; i <= totalPage; i++){
			      	setPageList();
			    }
		  	}else{
		    	if (currentPage <= 5) {
		      		for (var i = 1; i <= 6; i++){
		        		setPageList();
		      		}
		      		a[a.length] = '<li>' + totalPage + '</li>';
		    	}else if(currentPage >= totalPage - 3){
		      		a[a.length] = '<li>1</li>';
		      		for (var i = totalPage - 5; i <= totalPage; i++){
		        		setPageList();
		      		}
		    	}else{
		      		a[a.length] = '<li>1</li>';
		      		for (var i = currentPage - 2; i <= currentPage + 2; i++){
		        		setPageList();
		      		}
		      		a[a.length] = '<li>' + totalPage + '</li>';
		    	}
		  	}
		  	a[a.length] = '<li class="fGt"></li>';	
		  	container.innerHTML = a.join("");
		  	subAjax(subUrl,currentPage,20,type);
			var pageClick = function(){
				var aLink = container.getElementsByTagName("li");
				var index = currentPage;
				util.addEvent(aLink[0],'click',function(){
					if (index == 1){
		        		return false;
		      		}
		      		index--;
			      	setPage(container, totalPage, index);
			      	return false
				});
			    for (var i = 1; i < aLink.length - 1; i++){ 
			    	util.addEvent(aLink[i],'click',function(){
			    		index = parseInt(this.innerHTML);
			        	setPage(container, totalPage, index);
			        	return false;
			    	});
			    }
			    util.addEvent(aLink[aLink.length - 1],'click',function(){
			    	if (index == totalPage){
			        	return false;
			     	}
		      		index++;
		      		setPage(container, totalPage, index);
		      		return false;
			    });
		  	}();
		}
		createSub();
		util.addEvent(oDesign,'click',function(){
			util.removeClass(oLang,'z-active');
			util.addClass(oDesign,'z-active');
			type = 10;
			subAjax(subUrl,1,20,10);
			setPage(oContainer,totalPage,1);
		});
		util.addEvent(oLang,'click',function(){
			util.removeClass(oDesign,'z-active');
			util.addClass(oLang,'z-active');
			type = 20;
			subAjax(subUrl,1,20,20);
			setPage(oContainer,totalPage,1);
		});
	};
	/* m-video */
	var video = function(){
		var oORG = $('.orgVideo');
		var oMV = $('.m-video');
		var oVC= $('.videoClose');
		
		var oVideo = $('.vCon');
		var oPlay = $('.play');
		var oVPlay = $('.cPlay');
		var oVPause = $('.cPause');
		var oVolume = $('.volume');
		var oMute= $('.mute');
		var oFull = $('.full');
		var oProto = $('.proto');

		var oDurationS = $('.durationStart');
		var oDurationE = $('.durationEnd');

		var oProBox = $('.progressBox');
		var oProNext = $('.progressNext');
		var per = 0;
		
		util.addEvent(oORG,'click',function(){					
			oMV.style.display='block';			
		});
		util.addEvent(oVC,'click',function(){			
			if({}.toString.call(oVideo).slice(8,-1)=='Object'){			
				oMV.style.display='none';
			}else{
				oVideo.pause();
				oVPause.style.display='none';
				oVPlay.style.display='block';
				oPlay.style.display='block';	
				oMV.style.display='none';
			}	
		});
		//播放
		util.addEvent(oPlay,'click',function(){
			play();	
		});
		util.addEvent(oVideo,'click',function(){
			play();							
		});
		util.addEvent(oVPlay,'click',function(){
			play();
		});
		util.addEvent(oVPause,'click',function(){
			play();			
		});
		//开音
		util.addEvent(oVolume,'click',function(){	
			oVideo.volume=0;					
			this.style.display='none';
			oMute.style.display='block';	
		});
		//静音
		util.addEvent(oMute,'click',function(){
			oVideo.volume=1;					
			this.style.display='none';
			oVolume.style.display='block';				
		});
		var play = function(){
			if(oVideo.paused){
				oVideo.play();
				oVPlay.style.display='none';
				oVPause.style.display='block';
				oPlay.style.display='none';	
			}else{
				oVideo.pause();
				oVPause.style.display='none';
				oVPlay.style.display='block';
				oPlay.style.display='block';	
			}		
		};
		//进度条
		var addZero = function(num){return num<10?'0'+num:''+num;}
		var getTime = function(t){return addZero(Math.floor(t%86400%3600/60)) + '.' + addZero(Math.floor(t%60));}		
		util.addEvent(oProBox,'click',function(ev){
			var e = ev || window.event;
			var w = parseInt(util.getStyle(oProBox,'width'));
			var x = e.offsetX;
			per = (x / w).toFixed(3);
    		var duration = oVideo.duration;
    		oVideo.currentTime = (duration * per).toFixed(0);
    		oProNext.style.width=x+'px';
    		var currentTime = getTime(oVideo.currentTime);
    		oDurationS.innerHTML = currentTime;		
		});
		oDurationE.innerHTML=getTime(oVideo.duration);
		//更新进度
		util.addEvent(oVideo,'timeupdate',function(){		
			var time = oVideo.currentTime.toFixed(1),
	            minutes = Math.floor((time / 60) % 60),
	            seconds = Math.floor(time % 60);

	        if (seconds < 10) {
	            seconds = '0' + seconds;
	        }
	        if (minutes < 10) {
	            minutes = '0' + minutes;
	        }
	        oDurationS.innerHTML = minutes + '.' + seconds;
			
			var w = parseInt(util.getStyle(oProBox,'width'));
			if (oVideo.duration) {
	            per = (oVideo.currentTime / oVideo.duration).toFixed(3);
	        } else {
	            per = 0;
	        }
	        oProNext.style.width = (w * per).toFixed(0)+'px';
	        if(oVideo.ended){
				oVPlay.style.display = 'block';
				oVPause.style.display = 'none';	
			}
		});
		//全屏
		util.addEvent(oFull,'click',function(){
			reqFullScreen();
		});
		var reqFullScreen = function (){
			if (!document.webkitIsFullScreen) {
	            oVideo.webkitRequestFullScreen();      
	        } else {
	            document.webkitCancelFullScreen();
	        }
	    }
	};
	/* m-hot */
	var hot = function(hotUrl){
		var url = hotUrl;			
		var createHot = function(list,obj){
			for(var i=0;i<list.length;i++){
				var str = '<li><a href=""><img class="hImg" src="'
				        + list[i].smallPhotoUrl + '" alt="图片"><p class=hCon><h4 class="hTit">' 
				        + list[i].name + '</h4><span class="hMask"></span><span class="hNum">'
				        + list[i].learnerCount + '</span></p></a></li>';
				obj.innerHTML += str;
			}
		}
		var hotMove = function(obj){
			var speed = -70;
			var tab = function(){
				if(parseInt(obj.style.top)<=-1400){ 
					speed= -70;
				}	
				obj.style.top=speed +'px';      	
				speed -= 70 ;						
			}
			obj.innerHTML+=obj.innerHTML;
			obj.style.height=obj.offsetHeight*2+'px';
			var hotTimer = setInterval(tab,5000);
		}
		util.getAjax(url,'',function(data){
			var oList = $('.hotCon');
			var json= JSON.parse(data);	
			createHot(json,oList);
			hotMove(oList);
		});	
	};
	/* 初始化 */
	var init=function(){
		var folUrl='http://study.163.com/webDev/attention.htm';
		var logUrl='http://study.163.com/webDev/login.htm';
		var hotUrl='http://study.163.com/webDev/hotcouresByCategory.htm';
		var subUrl = 'http://study.163.com/webDev/couresByCategory.htm';

		hover();
		banner();
		login(folUrl,logUrl);
		subject(subUrl);
		video();
		hot(hotUrl);
	};
	window.init=init;
})();
util.addEvent(window,'load',function(){			
	init();
});