
/* util.js */
(function(){
	var $=function(selector){
		if ( !document.querySelectorAll ) {
			(function(d, s) {
				d=document, s=d.createStyleSheet();
				d.querySelectorAll = function(r, c, i, j, a) {
				a=d.all, c=[], r = r.replace(/\[for\b/gi, '[htmlFor').split(',');
				for (i=r.length; i--;) {
					s.addRule(r[i], 'k:v');
					for (j=a.length; j--;) a[j].currentStyle.k && c.push(a[j]);
						s.removeRule(0);
					}
					return c;
				}
			})()
		}
		if(document.querySelectorAll(selector).length==1){
			return document.querySelectorAll(selector)[0];
		}else{
			return document.querySelectorAll(selector);
		}
	};
	var util={
		/* 样式相关 */
		getClassName:function(ele,clazz){
			if(ele.getElementsByClassName){
				return ele.getElementsByClassName(clazz);
			}else{
				var aEle=ele.getElementsByTagName('*'),aRes=[];
				for(var i=0,len=aEle.length;i<len;i++){
					if((' '+aEle[i].className+' ').indexOf(' '+clazz+' ')!=-1){
						aRes.push(aEle[i]);
					}
				}
				return aRes;
			}
		},
		getStyle:function(obj,name){
			if(obj.currentStyle)
				return obj.currentStyle[name];
			else
				return getComputedStyle(obj,false)[name];
		},
		addClass:function(node,classname) {
		    if(node.classList) {
		        node.classList.add(classname);
		    }
		    else { 
		        (function () {
		            var classNames = node.className.split(/\s+/); 
		            for (var i=0, len=classNames.length; i < len; i++){
		                if (classNames[i] == classname){return}
		            }  
		            classNames.push(classname);   
		            node.className = classNames.join(" ");  
		        })();
		    }   
		},
		removeClass:function(node,classname) {
		    if(node.classList){
		        node.classList.remove(classname);
		    }
		    else{  
		        (function () {
		            var classNames = node.className.split(/\s+/); 
		            var pos = -1,i,len;
		            for (i=0, len=classNames.length; i < len; i++){
		                if (classNames[i] == classname){
		                    pos = i;
		                    break;
		                }
		            }  
		            classNames.splice(i,1);  
		            node.className = classNames.join(" ");  
		        })();
		    }
		},
		/* event相关函数 */ 
		addEvent:function(obj,type,fn){
			if(obj.addEventListener){
				return obj.addEventListener(type,fn);
			}else if(obj.attachEvent){
				return obj.attachEvent('on'+type,fn);
			}
		},
		delEvent:function (obj,type,fn){
			if(obj.removeEventListener){
				return obj.removeEventListener(type,fn);
			}else if(obj.detachEvent){
				return obj.detachEvent('on'+type,fn);
			}
		},
		/* cookie相关函数 */
		setCookie:function(name,value,expires,path,domain,secure){
			var ck = encodeURIComponent(name) + '=' + encodeURIComponent(value);
			if(expires) ck += '; expires=' + expires.toGMTString();
			if(path) ck +='; path=' + path;
			if(domain) ck += '; domain=' + domain;
			if(secure) ck += '; secure=' + secure;
			document.cookie = ck;
		},
		getCookies:function(){
			var cks = {};
			var all = document.cookie;
			if(all === '') return cks;
			var list = all.split('; ');
			for(var i=0;i<list.length;i++){
				var item = list[i];
				var p = item.indexOf('=');
				var name = item.substring(0,p);
				name = decodeURIComponent(name);
				var value = item.substring(p + 1);
				cks[name] = decodeURIComponent(value);
			}
			return cks;
		},
		removeCookie:function(name){
			document.cookie=name+'='+'; expires='+new Date(0);
		},
		/* ajax相关函数 */
		getAjax:function(url,options,fn){
		    var xhr = null;
		    if( window.XMLHttpRequest ){
		        xhr = new XMLHttpRequest();
		    }else{	        
		        xhr = new ActiveXObject( 'Microsoft.XMLHTTP' );
		    }

		    if(!options) options = '';
			var pairs=[];
			for(var name in options){
				if(!options.hasOwnProperty(name)) continue;
				if(typeof options[name]==='function') continue;
				var value=options[name].toString();
				name=encodeURIComponent(name);
				value=encodeURIComponent(value);
				pairs.push(name+'='+value);
			}
			options = pairs.join('&');

		    url += '?' + options ;
		    xhr.open('get', url, true );
		    xhr.send(null);
		    xhr.onreadystatechange = function () {
		        if( xhr.readyState == 4 ){
		            if( (xhr.status >= 200 && xhr.status < 300 ) || xhr.status == 304 ){
		                fn( xhr.responseText );
		            }else{
		                // alert( 'Request was unsuccessful' + xhr.status );
		                return '';
		            }
		        }
		    };
		},
		/* 运动相关 */
		fadeIn:function(obj,json,fn){
			clearInterval(obj.timer);
			obj.timer=setInterval(function(){
				var _stop=true;
				for (var attr in json){
					var _current=0;
					if (attr=='opacity'){
						_current=Math.round(parseFloat(util.getStyle(obj,attr))*100);
					}else{
						_current=parseInt(util.getStyle(obj,attr));
					}
					var _speed=(json[attr]-_current)/10;
					_speed=_speed>0?Math.ceil(_speed):Math.floor(_speed);			
					if (attr=='opacity'){
						if(!!obj.style.filter){
							obj.style.filter='alpha(opacity:'+(_current+_speed)+')';
						}
						if(!!obj.style.opacity){
							obj.style.opacity=(_current+_speed)/100;
						}
					}else{
						obj.style[attr]=_current+_speed+'px';
					}
					if(_current!=json[attr]){
						_stop=false;
					}
				}
				if(_stop){
					clearInterval(obj.timer);
					if(fn)fn();
				}
			},30);
		}	
	};
	window.$=$;
	window.util=util;
})();