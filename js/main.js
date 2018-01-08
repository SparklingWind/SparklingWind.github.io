require([], function (){

	var isMobileInit = false;
	var loadMobile = function(){
		require(['/js/mobile.js'], function(mobile){
			mobile.init();
			isMobileInit = true;
		});
	}
	var isPCInit = false;
	var loadPC = function(){
		require(['/js/pc.js'], function(pc){
			pc.init();
			isPCInit = true;
		});
	}

	var browser={
	    versions:function(){
	    var u = window.navigator.userAgent;
	    return {
	        trident: u.indexOf('Trident') > -1, //IE内核
	        presto: u.indexOf('Presto') > -1, //opera内核
	        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
	        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
	        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
	        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
	        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
	        iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者安卓QQ浏览器
	        iPad: u.indexOf('iPad') > -1, //是否为iPad
	        webApp: u.indexOf('Safari') == -1 ,//是否为web应用程序，没有头部与底部
	        weixin: u.indexOf('MicroMessenger') == -1 //是否为微信浏览器
	        };
	    }()
	}

	$(window).bind("resize", function(){
		if(isMobileInit && isPCInit){
			$(window).unbind("resize");
			return;
		}
		var w = $(window).width();
		if(w >= 700){
			loadPC();
		}else{
			loadMobile();
		}
	});

	if(browser.versions.mobile === true || $(window).width() < 700){
		loadMobile();
	}else{
		loadPC();
	}

	//是否使用fancybox
	if(yiliaConfig.fancybox === true){
		require(['/fancybox/jquery.fancybox.js'], function(pc){
			var isFancy = $(".isFancy");
			if(isFancy.length != 0){
				var imgArr = $(".article-inner img");
				for(var i=0,len=imgArr.length;i<len;i++){
//by SparklingWind - 修复图片样式丢失问题
                    if(imgArr.eq(i).attr("class")=="copy-ico")continue;
					var src = imgArr.eq(i).attr("src");
					var title = imgArr.eq(i).attr("alt");
                    var style = imgArr.eq(i).attr("style");
					imgArr.eq(i).replaceWith("<a href='"+src+"' title='"+title+"' rel='fancy-group' class='fancy-ctn fancybox'>"+imgArr.eq(i).prop("outerHTML")+"</a>");
//by SparklingWind
				}
				$(".article-inner .fancy-ctn").fancybox();
			}
		});
		
	}
    
	//是否开启动画
	if(yiliaConfig.animate === true){

		require(['/js/jquery.lazyload.js'], function(){
			//avatar
			$(".js-avatar").attr("src", $(".js-avatar").attr("lazy-src"));
			$(".js-avatar")[0].onload = function(){
				$(".js-avatar").addClass("show");
			}
		});
		
		if(yiliaConfig.isHome === true){
			//content
			function showArticle(){
				$(".article").each(function(){
					if( $(this).offset().top <= $(window).scrollTop()+$(window).height() && !($(this).hasClass('show')) ) {
						$(this).removeClass("hidden").addClass("show");
						$(this).addClass("is-hiddened");
					}else{
						if(!$(this).hasClass("is-hiddened")){
							$(this).addClass("hidden");
						}
					}
				});
			}
			$(window).on('scroll', function(){
				showArticle();
			});
			showArticle();
		}
		
	}
	
	//是否新窗口打开链接
	if(yiliaConfig.open_in_new == true){
		$(".article a[href]").attr("target", "_blank")
	}
    
//by SparklingWind
    var scrollSpeed = 500;
    var goBack = $("#goback");
    var pos=0;
    $("a").click(function(e){
        if($(e.target).attr("href")[0]=="#"){
            var t=$($(e.target).attr("href"));
            if(t[0].tagName!="SPAN")return true;
            pos=$(window).scrollTop();
            goBack.stop().fadeTo(300, 1);
            var h=t.offset().top;
            $("html, body").animate({scrollTop:h-120>0?h-120:h}, scrollSpeed);
            t.addClass("alert");
            t[0].addEventListener('animationend',function(){
                this.classList.remove('alert');
            });
            return false;
        }
    }); 
    goBack.click(function(){
        $("html, body").animate({scrollTop:pos}, scrollSpeed);
		goBack.stop().fadeTo(300, 0);
	});
    
    
    var upperLimit = 1000;
	var scrollElem = $("#totop");
	$(window).scroll(function () {
		var scrollTop = $(document).scrollTop();
		if ( scrollTop > upperLimit ) {
			scrollElem.stop().fadeTo(300, 1);
		}else{
			scrollElem.stop().fadeTo(300, 0);
		}
	});
	scrollElem.click(function(){
		$("html, body").animate({scrollTop:0}, scrollSpeed); return false;
	});
    

    var hl=$(".highlight table");
    for(var i=0,len=hl.length;i<len;i++){
        hl.eq(i).before($("<button class='copy-btn' />").append($("<img src='/img/clippy.svg' class='copy-ico'>")));      
        hl.eq(i).before("<div class='code-toggle'></div>");
        hl.eq(i).prev().html("+&nbsp;展开代码&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;"+hl.eq(i).find(".gutter .line:last").html()+"  行");
        hl.eq(i).after("<div class='code-toggle' style='display:none;'>-&nbsp;收起代码</div>");
        hl.eq(i).prev().click(function(e){
            var t=$(e.target).next();
            var lines=parseInt(t.find(".gutter .line:last").html());
            if(t[0].style.display=="none"){
                $(e.target).html("-&nbsp;收起代码");
                t.slideDown("slow");
                if(lines>=20)t.next().show();
            }
            else{
                $(e.target).html("+&nbsp;展开代码&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;"+lines+"  行");
                t.next().hide();
                t.slideUp("slow");
            }
        });
        hl.eq(i).next().click(function(e){
            var t=$(e.target).prev();
            var lines=parseInt(t.find(".gutter .line:last").html());
            $(e.target).hide();
            t.prev().html("+&nbsp;展开代码&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;"+lines+"  行");
            t.slideUp("slow");
        });
        if(parseInt(hl.eq(i).find(".gutter .line:last").html())>=8)
            hl.eq(i).wrap("<div></div>").parent().hide();
        else
            hl.eq(i).prev().html("-&nbsp;收起代码");
    }
    
    $(".copy-btn").blur(function(){
        $(this).removeClass("tip");
    });
    
    var clipboardSnippets=new Clipboard(".copy-btn",{
        target: function(trigger) {
            if($(trigger).next().next().css("display")=="none")
                $(trigger).next().trigger("click");
            return $(trigger).next().next().find(".code")[0];
        }
    });
    clipboardSnippets.on('success', function(e) {
        $(e.trigger).attr("tip-content","复制成功");
        $(e.trigger).addClass("tip");
    });
    clipboardSnippets.on('error', function(e) {
        $(e.trigger).attr("tip-content","复制失败");
        $(e.trigger).addClass("tip");
    });
    
    
    if(!$("#toc .toc").size())$("#toc").remove();
    var toc=$("#toc");
    var delta=50;
    if(toc.size()){
        $(window).scroll(function(){
            var scroll=$(document).scrollTop();
            var min=$(".article-entry").offset().top;
            var title=$(".slider-trigger").outerHeight();
            toc.offset({top:(title+(scroll<min?min:scroll))});
            if(scroll>min ^ toc.hasClass("folded"))
                toc.toggleClass("folded");
            if(toc.hasClass("folded")){
                var h1;
                $(".article-entry h1").each(function(){
                    var a=$(this);
                    h1=h1 || a;
                    if(a.offset().top-delta>=scroll)return false;
                    h1=a;
                });
                if(typeof(h1)=="undefined"){
                    var h2;
                    $(".article-entry h2").each(function(){
                        var a=$(this);
                        h2=h2 || a;
                        if(a.offset().top-delta>=scroll)return false;
                        h2=a;
                    });
                    if(typeof(h2)!="undefined")
                        toc.attr("before-content",h2.text());
                }
                else{
                    var bb=h1.find("~h2");
                    if(bb.size()){
                        var h2;
                        var limit=h1.find("~h1");
                        limit=limit.size()?limit.offset().top:99999999;
                        bb.each(function(){
                            var a=$(this);
                            h2=h2 || a;
                            if(a.offset().top-delta>=scroll)return false;
                            h2=a;
                        });
                        if(limit>h2.offset().top)
                            toc.attr("before-content",h1.text()+" - "+h2.text());
                        else
                            toc.attr("before-content",h1.text());
                    }
                    else
                        toc.attr("before-content",h1.text());
                }
            }
        });
        toc.mouseover(function(){
            if(toc.hasClass("folded"))
                toc.removeClass("folded");
        });
        toc.mouseout(function(){
            if(!toc.hasClass("folded")){
                var scroll=$(document).scrollTop();
                var min=$(".article-entry").offset().top;
                if(scroll>min ^ toc.hasClass("folded"))
                    toc.addClass("folded");
            }
        });
    }
    
    
    $("html,body").click(function(e){
        var a=$("<div class='trangle' />");
        var x=e.pageX,y=e.pageY;
        a.css({
            "z-index":999,
            "top":y-20,
            "left":x-20
        });
        $("body").append(a);
        a.animate(
            {"opacity":0},
            1500,
            function(){a.remove();}
        );
        e.stopPropagation();
	});
   
    
//by SparklingWind
    
});