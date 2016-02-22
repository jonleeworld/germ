/*
 * jQuery FlexSlider v2.6.0
 * Copyright 2012 WooThemes
 * Contributing Author: Tyler Smith
 */
(function($){var focused=true;$.flexslider=function(el,options){var slider=$(el);slider.vars=$.extend({},$.flexslider.defaults,options);var namespace=slider.vars.namespace,msGesture=window.navigator&&window.navigator.msPointerEnabled&&window.MSGesture,touch=("ontouchstart"in window||msGesture||window.DocumentTouch&&document instanceof DocumentTouch)&&slider.vars.touch,eventType="click touchend MSPointerUp keyup",watchedEvent="",watchedEventClearTimer,vertical=slider.vars.direction==="vertical",reverse=slider.vars.reverse,carousel=slider.vars.itemWidth>0,fade=slider.vars.animation==="fade",asNav=slider.vars.asNavFor!=="",methods={};$.data(el,"flexslider",slider);methods={init:function(){slider.animating=false;slider.currentSlide=parseInt(slider.vars.startAt?slider.vars.startAt:0,10);if(isNaN(slider.currentSlide)){slider.currentSlide=0}slider.animatingTo=slider.currentSlide;slider.atEnd=slider.currentSlide===0||slider.currentSlide===slider.last;slider.containerSelector=slider.vars.selector.substr(0,slider.vars.selector.search(" "));slider.slides=$(slider.vars.selector,slider);slider.container=$(slider.containerSelector,slider);slider.count=slider.slides.length;slider.syncExists=$(slider.vars.sync).length>0;if(slider.vars.animation==="slide"){slider.vars.animation="swing"}slider.prop=vertical?"top":"marginLeft";slider.args={};slider.manualPause=false;slider.stopped=false;slider.started=false;slider.startTimeout=null;slider.transitions=!slider.vars.video&&!fade&&slider.vars.useCSS&&function(){var obj=document.createElement("div"),props=["perspectiveProperty","WebkitPerspective","MozPerspective","OPerspective","msPerspective"];for(var i in props){if(obj.style[props[i]]!==undefined){slider.pfx=props[i].replace("Perspective","").toLowerCase();slider.prop="-"+slider.pfx+"-transform";return true}}return false}();slider.ensureAnimationEnd="";if(slider.vars.controlsContainer!=="")slider.controlsContainer=$(slider.vars.controlsContainer).length>0&&$(slider.vars.controlsContainer);if(slider.vars.manualControls!=="")slider.manualControls=$(slider.vars.manualControls).length>0&&$(slider.vars.manualControls);if(slider.vars.customDirectionNav!=="")slider.customDirectionNav=$(slider.vars.customDirectionNav).length===2&&$(slider.vars.customDirectionNav);if(slider.vars.randomize){slider.slides.sort(function(){return Math.round(Math.random())-.5});slider.container.empty().append(slider.slides)}slider.doMath();slider.setup("init");if(slider.vars.controlNav){methods.controlNav.setup()}if(slider.vars.directionNav){methods.directionNav.setup()}if(slider.vars.keyboard&&($(slider.containerSelector).length===1||slider.vars.multipleKeyboard)){$(document).bind("keyup",function(event){var keycode=event.keyCode;if(!slider.animating&&(keycode===39||keycode===37)){var target=keycode===39?slider.getTarget("next"):keycode===37?slider.getTarget("prev"):false;slider.flexAnimate(target,slider.vars.pauseOnAction)}})}if(slider.vars.mousewheel){slider.bind("mousewheel",function(event,delta,deltaX,deltaY){event.preventDefault();var target=delta<0?slider.getTarget("next"):slider.getTarget("prev");slider.flexAnimate(target,slider.vars.pauseOnAction)})}if(slider.vars.pausePlay){methods.pausePlay.setup()}if(slider.vars.slideshow&&slider.vars.pauseInvisible){methods.pauseInvisible.init()}if(slider.vars.slideshow){if(slider.vars.pauseOnHover){slider.hover(function(){if(!slider.manualPlay&&!slider.manualPause){slider.pause()}},function(){if(!slider.manualPause&&!slider.manualPlay&&!slider.stopped){slider.play()}})}if(!slider.vars.pauseInvisible||!methods.pauseInvisible.isHidden()){slider.vars.initDelay>0?slider.startTimeout=setTimeout(slider.play,slider.vars.initDelay):slider.play()}}if(asNav){methods.asNav.setup()}if(touch&&slider.vars.touch){methods.touch()}if(!fade||fade&&slider.vars.smoothHeight){$(window).bind("resize orientationchange focus",methods.resize)}slider.find("img").attr("draggable","false");setTimeout(function(){slider.vars.start(slider)},200)},asNav:{setup:function(){slider.asNav=true;slider.animatingTo=Math.floor(slider.currentSlide/slider.move);slider.currentItem=slider.currentSlide;slider.slides.removeClass(namespace+"active-slide").eq(slider.currentItem).addClass(namespace+"active-slide");if(!msGesture){slider.slides.on(eventType,function(e){e.preventDefault();var $slide=$(this),target=$slide.index();var posFromLeft=$slide.offset().left-$(slider).scrollLeft();if(posFromLeft<=0&&$slide.hasClass(namespace+"active-slide")){slider.flexAnimate(slider.getTarget("prev"),true)}else if(!$(slider.vars.asNavFor).data("flexslider").animating&&!$slide.hasClass(namespace+"active-slide")){slider.direction=slider.currentItem<target?"next":"prev";slider.flexAnimate(target,slider.vars.pauseOnAction,false,true,true)}})}else{el._slider=slider;slider.slides.each(function(){var that=this;that._gesture=new MSGesture;that._gesture.target=that;that.addEventListener("MSPointerDown",function(e){e.preventDefault();if(e.currentTarget._gesture){e.currentTarget._gesture.addPointer(e.pointerId)}},false);that.addEventListener("MSGestureTap",function(e){e.preventDefault();var $slide=$(this),target=$slide.index();if(!$(slider.vars.asNavFor).data("flexslider").animating&&!$slide.hasClass("active")){slider.direction=slider.currentItem<target?"next":"prev";slider.flexAnimate(target,slider.vars.pauseOnAction,false,true,true)}})})}}},controlNav:{setup:function(){if(!slider.manualControls){methods.controlNav.setupPaging()}else{methods.controlNav.setupManual()}},setupPaging:function(){var type=slider.vars.controlNav==="thumbnails"?"control-thumbs":"control-paging",j=1,item,slide;slider.controlNavScaffold=$('<ol class="'+namespace+"control-nav "+namespace+type+'"></ol>');if(slider.pagingCount>1){for(var i=0;i<slider.pagingCount;i++){slide=slider.slides.eq(i);if(undefined===slide.attr("data-thumb-alt")){slide.attr("data-thumb-alt","")}altText=""!==slide.attr("data-thumb-alt")?altText=' alt="'+slide.attr("data-thumb-alt")+'"':"";item=slider.vars.controlNav==="thumbnails"?'<img src="'+slide.attr("data-thumb")+'"'+altText+"/>":'<a href="#">'+j+"</a>";if("thumbnails"===slider.vars.controlNav&&true===slider.vars.thumbCaptions){var captn=slide.attr("data-thumbcaption");if(""!==captn&&undefined!==captn){item+='<span class="'+namespace+'caption">'+captn+"</span>"}}slider.controlNavScaffold.append("<li>"+item+"</li>");j++}}slider.controlsContainer?$(slider.controlsContainer).append(slider.controlNavScaffold):slider.append(slider.controlNavScaffold);methods.controlNav.set();methods.controlNav.active();slider.controlNavScaffold.delegate("a, img",eventType,function(event){event.preventDefault();if(watchedEvent===""||watchedEvent===event.type){var $this=$(this),target=slider.controlNav.index($this);if(!$this.hasClass(namespace+"active")){slider.direction=target>slider.currentSlide?"next":"prev";slider.flexAnimate(target,slider.vars.pauseOnAction)}}if(watchedEvent===""){watchedEvent=event.type}methods.setToClearWatchedEvent()})},setupManual:function(){slider.controlNav=slider.manualControls;methods.controlNav.active();slider.controlNav.bind(eventType,function(event){event.preventDefault();if(watchedEvent===""||watchedEvent===event.type){var $this=$(this),target=slider.controlNav.index($this);if(!$this.hasClass(namespace+"active")){target>slider.currentSlide?slider.direction="next":slider.direction="prev";slider.flexAnimate(target,slider.vars.pauseOnAction)}}if(watchedEvent===""){watchedEvent=event.type}methods.setToClearWatchedEvent()})},set:function(){var selector=slider.vars.controlNav==="thumbnails"?"img":"a";slider.controlNav=$("."+namespace+"control-nav li "+selector,slider.controlsContainer?slider.controlsContainer:slider)},active:function(){slider.controlNav.removeClass(namespace+"active").eq(slider.animatingTo).addClass(namespace+"active")},update:function(action,pos){if(slider.pagingCount>1&&action==="add"){slider.controlNavScaffold.append($('<li><a href="#">'+slider.count+"</a></li>"))}else if(slider.pagingCount===1){slider.controlNavScaffold.find("li").remove()}else{slider.controlNav.eq(pos).closest("li").remove()}methods.controlNav.set();slider.pagingCount>1&&slider.pagingCount!==slider.controlNav.length?slider.update(pos,action):methods.controlNav.active()}},directionNav:{setup:function(){var directionNavScaffold=$('<ul class="'+namespace+'direction-nav"><li class="'+namespace+'nav-prev"><a class="'+namespace+'prev" href="#">'+slider.vars.prevText+'</a></li><li class="'+namespace+'nav-next"><a class="'+namespace+'next" href="#">'+slider.vars.nextText+"</a></li></ul>");if(slider.customDirectionNav){slider.directionNav=slider.customDirectionNav}else if(slider.controlsContainer){$(slider.controlsContainer).append(directionNavScaffold);slider.directionNav=$("."+namespace+"direction-nav li a",slider.controlsContainer)}else{slider.append(directionNavScaffold);slider.directionNav=$("."+namespace+"direction-nav li a",slider)}methods.directionNav.update();slider.directionNav.bind(eventType,function(event){event.preventDefault();var target;if(watchedEvent===""||watchedEvent===event.type){target=$(this).hasClass(namespace+"next")?slider.getTarget("next"):slider.getTarget("prev");slider.flexAnimate(target,slider.vars.pauseOnAction)}if(watchedEvent===""){watchedEvent=event.type}methods.setToClearWatchedEvent()})},update:function(){var disabledClass=namespace+"disabled";if(slider.pagingCount===1){slider.directionNav.addClass(disabledClass).attr("tabindex","-1")}else if(!slider.vars.animationLoop){if(slider.animatingTo===0){slider.directionNav.removeClass(disabledClass).filter("."+namespace+"prev").addClass(disabledClass).attr("tabindex","-1")}else if(slider.animatingTo===slider.last){slider.directionNav.removeClass(disabledClass).filter("."+namespace+"next").addClass(disabledClass).attr("tabindex","-1")}else{slider.directionNav.removeClass(disabledClass).removeAttr("tabindex")}}else{slider.directionNav.removeClass(disabledClass).removeAttr("tabindex")}}},pausePlay:{setup:function(){var pausePlayScaffold=$('<div class="'+namespace+'pauseplay"><a href="#"></a></div>');if(slider.controlsContainer){slider.controlsContainer.append(pausePlayScaffold);slider.pausePlay=$("."+namespace+"pauseplay a",slider.controlsContainer)}else{slider.append(pausePlayScaffold);slider.pausePlay=$("."+namespace+"pauseplay a",slider)}methods.pausePlay.update(slider.vars.slideshow?namespace+"pause":namespace+"play");slider.pausePlay.bind(eventType,function(event){event.preventDefault();if(watchedEvent===""||watchedEvent===event.type){if($(this).hasClass(namespace+"pause")){slider.manualPause=true;slider.manualPlay=false;slider.pause()}else{slider.manualPause=false;slider.manualPlay=true;slider.play()}}if(watchedEvent===""){watchedEvent=event.type}methods.setToClearWatchedEvent()})},update:function(state){state==="play"?slider.pausePlay.removeClass(namespace+"pause").addClass(namespace+"play").html(slider.vars.playText):slider.pausePlay.removeClass(namespace+"play").addClass(namespace+"pause").html(slider.vars.pauseText)}},touch:function(){var startX,startY,offset,cwidth,dx,startT,onTouchStart,onTouchMove,onTouchEnd,scrolling=false,localX=0,localY=0,accDx=0;if(!msGesture){onTouchStart=function(e){if(slider.animating){e.preventDefault()}else if(window.navigator.msPointerEnabled||e.touches.length===1){slider.pause();cwidth=vertical?slider.h:slider.w;startT=Number(new Date);localX=e.touches[0].pageX;localY=e.touches[0].pageY;offset=carousel&&reverse&&slider.animatingTo===slider.last?0:carousel&&reverse?slider.limit-(slider.itemW+slider.vars.itemMargin)*slider.move*slider.animatingTo:carousel&&slider.currentSlide===slider.last?slider.limit:carousel?(slider.itemW+slider.vars.itemMargin)*slider.move*slider.currentSlide:reverse?(slider.last-slider.currentSlide+slider.cloneOffset)*cwidth:(slider.currentSlide+slider.cloneOffset)*cwidth;startX=vertical?localY:localX;startY=vertical?localX:localY;el.addEventListener("touchmove",onTouchMove,false);el.addEventListener("touchend",onTouchEnd,false)}};onTouchMove=function(e){localX=e.touches[0].pageX;localY=e.touches[0].pageY;dx=vertical?startX-localY:startX-localX;scrolling=vertical?Math.abs(dx)<Math.abs(localX-startY):Math.abs(dx)<Math.abs(localY-startY);var fxms=500;if(!scrolling||Number(new Date)-startT>fxms){e.preventDefault();if(!fade&&slider.transitions){if(!slider.vars.animationLoop){dx=dx/(slider.currentSlide===0&&dx<0||slider.currentSlide===slider.last&&dx>0?Math.abs(dx)/cwidth+2:1)}slider.setProps(offset+dx,"setTouch")}}};onTouchEnd=function(e){el.removeEventListener("touchmove",onTouchMove,false);if(slider.animatingTo===slider.currentSlide&&!scrolling&&!(dx===null)){var updateDx=reverse?-dx:dx,target=updateDx>0?slider.getTarget("next"):slider.getTarget("prev");if(slider.canAdvance(target)&&(Number(new Date)-startT<550&&Math.abs(updateDx)>50||Math.abs(updateDx)>cwidth/2)){slider.flexAnimate(target,slider.vars.pauseOnAction)}else{if(!fade){slider.flexAnimate(slider.currentSlide,slider.vars.pauseOnAction,true)}}}el.removeEventListener("touchend",onTouchEnd,false);startX=null;startY=null;dx=null;offset=null};el.addEventListener("touchstart",onTouchStart,false)}else{el.style.msTouchAction="none";el._gesture=new MSGesture;el._gesture.target=el;el.addEventListener("MSPointerDown",onMSPointerDown,false);el._slider=slider;el.addEventListener("MSGestureChange",onMSGestureChange,false);el.addEventListener("MSGestureEnd",onMSGestureEnd,false);function onMSPointerDown(e){e.stopPropagation();if(slider.animating){e.preventDefault()}else{slider.pause();el._gesture.addPointer(e.pointerId);accDx=0;cwidth=vertical?slider.h:slider.w;startT=Number(new Date);offset=carousel&&reverse&&slider.animatingTo===slider.last?0:carousel&&reverse?slider.limit-(slider.itemW+slider.vars.itemMargin)*slider.move*slider.animatingTo:carousel&&slider.currentSlide===slider.last?slider.limit:carousel?(slider.itemW+slider.vars.itemMargin)*slider.move*slider.currentSlide:reverse?(slider.last-slider.currentSlide+slider.cloneOffset)*cwidth:(slider.currentSlide+slider.cloneOffset)*cwidth}}function onMSGestureChange(e){e.stopPropagation();var slider=e.target._slider;if(!slider){return}var transX=-e.translationX,transY=-e.translationY;accDx=accDx+(vertical?transY:transX);dx=accDx;scrolling=vertical?Math.abs(accDx)<Math.abs(-transX):Math.abs(accDx)<Math.abs(-transY);if(e.detail===e.MSGESTURE_FLAG_INERTIA){setImmediate(function(){el._gesture.stop()});return}if(!scrolling||Number(new Date)-startT>500){e.preventDefault();if(!fade&&slider.transitions){if(!slider.vars.animationLoop){dx=accDx/(slider.currentSlide===0&&accDx<0||slider.currentSlide===slider.last&&accDx>0?Math.abs(accDx)/cwidth+2:1)}slider.setProps(offset+dx,"setTouch")}}}function onMSGestureEnd(e){e.stopPropagation();var slider=e.target._slider;if(!slider){return}if(slider.animatingTo===slider.currentSlide&&!scrolling&&!(dx===null)){var updateDx=reverse?-dx:dx,target=updateDx>0?slider.getTarget("next"):slider.getTarget("prev");if(slider.canAdvance(target)&&(Number(new Date)-startT<550&&Math.abs(updateDx)>50||Math.abs(updateDx)>cwidth/2)){slider.flexAnimate(target,slider.vars.pauseOnAction)}else{if(!fade){slider.flexAnimate(slider.currentSlide,slider.vars.pauseOnAction,true)}}}startX=null;startY=null;dx=null;offset=null;accDx=0}}},resize:function(){if(!slider.animating&&slider.is(":visible")){if(!carousel){slider.doMath()}if(fade){methods.smoothHeight()}else if(carousel){slider.slides.width(slider.computedW);slider.update(slider.pagingCount);slider.setProps()}else if(vertical){slider.viewport.height(slider.h);slider.setProps(slider.h,"setTotal")}else{if(slider.vars.smoothHeight){methods.smoothHeight()}slider.newSlides.width(slider.computedW);slider.setProps(slider.computedW,"setTotal")}}},smoothHeight:function(dur){if(!vertical||fade){var $obj=fade?slider:slider.viewport;dur?$obj.animate({height:slider.slides.eq(slider.animatingTo).height()},dur):$obj.height(slider.slides.eq(slider.animatingTo).height())}},sync:function(action){var $obj=$(slider.vars.sync).data("flexslider"),target=slider.animatingTo;switch(action){case"animate":$obj.flexAnimate(target,slider.vars.pauseOnAction,false,true);break;case"play":if(!$obj.playing&&!$obj.asNav){$obj.play()}break;case"pause":$obj.pause();break}},uniqueID:function($clone){$clone.filter("[id]").add($clone.find("[id]")).each(function(){var $this=$(this);$this.attr("id",$this.attr("id")+"_clone")});return $clone},pauseInvisible:{visProp:null,init:function(){var visProp=methods.pauseInvisible.getHiddenProp();if(visProp){var evtname=visProp.replace(/[H|h]idden/,"")+"visibilitychange";document.addEventListener(evtname,function(){if(methods.pauseInvisible.isHidden()){if(slider.startTimeout){clearTimeout(slider.startTimeout)}else{slider.pause()}}else{if(slider.started){slider.play()}else{if(slider.vars.initDelay>0){setTimeout(slider.play,slider.vars.initDelay)}else{slider.play()}}}})}},isHidden:function(){var prop=methods.pauseInvisible.getHiddenProp();if(!prop){return false}return document[prop]},getHiddenProp:function(){var prefixes=["webkit","moz","ms","o"];if("hidden"in document){return"hidden"}for(var i=0;i<prefixes.length;i++){if(prefixes[i]+"Hidden"in document){return prefixes[i]+"Hidden"}}return null}},setToClearWatchedEvent:function(){clearTimeout(watchedEventClearTimer);watchedEventClearTimer=setTimeout(function(){watchedEvent=""},3e3)}};slider.flexAnimate=function(target,pause,override,withSync,fromNav){if(!slider.vars.animationLoop&&target!==slider.currentSlide){slider.direction=target>slider.currentSlide?"next":"prev"}if(asNav&&slider.pagingCount===1)slider.direction=slider.currentItem<target?"next":"prev";if(!slider.animating&&(slider.canAdvance(target,fromNav)||override)&&slider.is(":visible")){if(asNav&&withSync){var master=$(slider.vars.asNavFor).data("flexslider");slider.atEnd=target===0||target===slider.count-1;master.flexAnimate(target,true,false,true,fromNav);slider.direction=slider.currentItem<target?"next":"prev";master.direction=slider.direction;if(Math.ceil((target+1)/slider.visible)-1!==slider.currentSlide&&target!==0){slider.currentItem=target;slider.slides.removeClass(namespace+"active-slide").eq(target).addClass(namespace+"active-slide");target=Math.floor(target/slider.visible)}else{slider.currentItem=target;slider.slides.removeClass(namespace+"active-slide").eq(target).addClass(namespace+"active-slide");return false}}slider.animating=true;slider.animatingTo=target;if(pause){slider.pause()}slider.vars.before(slider);if(slider.syncExists&&!fromNav){methods.sync("animate")}if(slider.vars.controlNav){methods.controlNav.active()}if(!carousel){slider.slides.removeClass(namespace+"active-slide").eq(target).addClass(namespace+"active-slide")}slider.atEnd=target===0||target===slider.last;if(slider.vars.directionNav){methods.directionNav.update()}if(target===slider.last){slider.vars.end(slider);if(!slider.vars.animationLoop){slider.pause()}}if(!fade){var dimension=vertical?slider.slides.filter(":first").height():slider.computedW,margin,slideString,calcNext;if(carousel){margin=slider.vars.itemMargin;calcNext=(slider.itemW+margin)*slider.move*slider.animatingTo;slideString=calcNext>slider.limit&&slider.visible!==1?slider.limit:calcNext}else if(slider.currentSlide===0&&target===slider.count-1&&slider.vars.animationLoop&&slider.direction!=="next"){slideString=reverse?(slider.count+slider.cloneOffset)*dimension:0}else if(slider.currentSlide===slider.last&&target===0&&slider.vars.animationLoop&&slider.direction!=="prev"){slideString=reverse?0:(slider.count+1)*dimension}else{slideString=reverse?(slider.count-1-target+slider.cloneOffset)*dimension:(target+slider.cloneOffset)*dimension}slider.setProps(slideString,"",slider.vars.animationSpeed);if(slider.transitions){if(!slider.vars.animationLoop||!slider.atEnd){slider.animating=false;slider.currentSlide=slider.animatingTo}slider.container.unbind("webkitTransitionEnd transitionend");slider.container.bind("webkitTransitionEnd transitionend",function(){clearTimeout(slider.ensureAnimationEnd);slider.wrapup(dimension)});clearTimeout(slider.ensureAnimationEnd);slider.ensureAnimationEnd=setTimeout(function(){slider.wrapup(dimension)},slider.vars.animationSpeed+100)}else{slider.container.animate(slider.args,slider.vars.animationSpeed,slider.vars.easing,function(){slider.wrapup(dimension)})}}else{if(!touch){slider.slides.eq(slider.currentSlide).css({zIndex:1}).animate({opacity:0},slider.vars.animationSpeed,slider.vars.easing);slider.slides.eq(target).css({zIndex:2}).animate({opacity:1},slider.vars.animationSpeed,slider.vars.easing,slider.wrapup)}else{slider.slides.eq(slider.currentSlide).css({opacity:0,zIndex:1});slider.slides.eq(target).css({opacity:1,zIndex:2});slider.wrapup(dimension)}}if(slider.vars.smoothHeight){methods.smoothHeight(slider.vars.animationSpeed)}}};slider.wrapup=function(dimension){if(!fade&&!carousel){if(slider.currentSlide===0&&slider.animatingTo===slider.last&&slider.vars.animationLoop){slider.setProps(dimension,"jumpEnd")}else if(slider.currentSlide===slider.last&&slider.animatingTo===0&&slider.vars.animationLoop){slider.setProps(dimension,"jumpStart")}}slider.animating=false;slider.currentSlide=slider.animatingTo;slider.vars.after(slider)};slider.animateSlides=function(){if(!slider.animating&&focused){slider.flexAnimate(slider.getTarget("next"))}};slider.pause=function(){clearInterval(slider.animatedSlides);slider.animatedSlides=null;slider.playing=false;if(slider.vars.pausePlay){methods.pausePlay.update("play")}if(slider.syncExists){methods.sync("pause")}};slider.play=function(){if(slider.playing){clearInterval(slider.animatedSlides)}slider.animatedSlides=slider.animatedSlides||setInterval(slider.animateSlides,slider.vars.slideshowSpeed);slider.started=slider.playing=true;if(slider.vars.pausePlay){methods.pausePlay.update("pause")}if(slider.syncExists){methods.sync("play")}};slider.stop=function(){slider.pause();slider.stopped=true};slider.canAdvance=function(target,fromNav){var last=asNav?slider.pagingCount-1:slider.last;return fromNav?true:asNav&&slider.currentItem===slider.count-1&&target===0&&slider.direction==="prev"?true:asNav&&slider.currentItem===0&&target===slider.pagingCount-1&&slider.direction!=="next"?false:target===slider.currentSlide&&!asNav?false:slider.vars.animationLoop?true:slider.atEnd&&slider.currentSlide===0&&target===last&&slider.direction!=="next"?false:slider.atEnd&&slider.currentSlide===last&&target===0&&slider.direction==="next"?false:true};slider.getTarget=function(dir){slider.direction=dir;if(dir==="next"){return slider.currentSlide===slider.last?0:slider.currentSlide+1}else{return slider.currentSlide===0?slider.last:slider.currentSlide-1}};slider.setProps=function(pos,special,dur){var target=function(){var posCheck=pos?pos:(slider.itemW+slider.vars.itemMargin)*slider.move*slider.animatingTo,posCalc=function(){if(carousel){return special==="setTouch"?pos:reverse&&slider.animatingTo===slider.last?0:reverse?slider.limit-(slider.itemW+slider.vars.itemMargin)*slider.move*slider.animatingTo:slider.animatingTo===slider.last?slider.limit:posCheck}else{switch(special){case"setTotal":return reverse?(slider.count-1-slider.currentSlide+slider.cloneOffset)*pos:(slider.currentSlide+slider.cloneOffset)*pos;case"setTouch":return reverse?pos:pos;case"jumpEnd":return reverse?pos:slider.count*pos;case"jumpStart":return reverse?slider.count*pos:pos;default:return pos}}}();return posCalc*-1+"px"}();if(slider.transitions){target=vertical?"translate3d(0,"+target+",0)":"translate3d("+target+",0,0)";dur=dur!==undefined?dur/1e3+"s":"0s";slider.container.css("-"+slider.pfx+"-transition-duration",dur);slider.container.css("transition-duration",dur)}slider.args[slider.prop]=target;if(slider.transitions||dur===undefined){slider.container.css(slider.args)}slider.container.css("transform",target)};slider.setup=function(type){if(!fade){var sliderOffset,arr;if(type==="init"){slider.viewport=$('<div class="'+namespace+'viewport"></div>').css({overflow:"hidden",position:"relative"}).appendTo(slider).append(slider.container);slider.cloneCount=0;slider.cloneOffset=0;if(reverse){arr=$.makeArray(slider.slides).reverse();slider.slides=$(arr);slider.container.empty().append(slider.slides)}}if(slider.vars.animationLoop&&!carousel){slider.cloneCount=2;slider.cloneOffset=1;if(type!=="init"){slider.container.find(".clone").remove()}slider.container.append(methods.uniqueID(slider.slides.first().clone().addClass("clone")).attr("aria-hidden","true")).prepend(methods.uniqueID(slider.slides.last().clone().addClass("clone")).attr("aria-hidden","true"))}slider.newSlides=$(slider.vars.selector,slider);sliderOffset=reverse?slider.count-1-slider.currentSlide+slider.cloneOffset:slider.currentSlide+slider.cloneOffset;if(vertical&&!carousel){slider.container.height((slider.count+slider.cloneCount)*200+"%").css("position","absolute").width("100%");setTimeout(function(){slider.newSlides.css({display:"block"});slider.doMath();slider.viewport.height(slider.h);slider.setProps(sliderOffset*slider.h,"init")},type==="init"?100:0)}else{slider.container.width((slider.count+slider.cloneCount)*200+"%");slider.setProps(sliderOffset*slider.computedW,"init");setTimeout(function(){slider.doMath();slider.newSlides.css({width:slider.computedW,marginRight:slider.computedM,"float":"left",display:"block"});if(slider.vars.smoothHeight){methods.smoothHeight()}},type==="init"?100:0)}}else{slider.slides.css({width:"100%","float":"left",marginRight:"-100%",position:"relative"});if(type==="init"){if(!touch){if(slider.vars.fadeFirstSlide==false){slider.slides.css({opacity:0,display:"block",zIndex:1}).eq(slider.currentSlide).css({zIndex:2}).css({opacity:1})}else{slider.slides.css({opacity:0,display:"block",zIndex:1}).eq(slider.currentSlide).css({zIndex:2}).animate({opacity:1},slider.vars.animationSpeed,slider.vars.easing)}}else{slider.slides.css({opacity:0,display:"block",webkitTransition:"opacity "+slider.vars.animationSpeed/1e3+"s ease",zIndex:1}).eq(slider.currentSlide).css({opacity:1,zIndex:2})}}if(slider.vars.smoothHeight){methods.smoothHeight()}}if(!carousel){slider.slides.removeClass(namespace+"active-slide").eq(slider.currentSlide).addClass(namespace+"active-slide")}slider.vars.init(slider)};slider.doMath=function(){var slide=slider.slides.first(),slideMargin=slider.vars.itemMargin,minItems=slider.vars.minItems,maxItems=slider.vars.maxItems;slider.w=slider.viewport===undefined?slider.width():slider.viewport.width();slider.h=slide.height();slider.boxPadding=slide.outerWidth()-slide.width();if(carousel){slider.itemT=slider.vars.itemWidth+slideMargin;slider.itemM=slideMargin;slider.minW=minItems?minItems*slider.itemT:slider.w;slider.maxW=maxItems?maxItems*slider.itemT-slideMargin:slider.w;slider.itemW=slider.minW>slider.w?(slider.w-slideMargin*(minItems-1))/minItems:slider.maxW<slider.w?(slider.w-slideMargin*(maxItems-1))/maxItems:slider.vars.itemWidth>slider.w?slider.w:slider.vars.itemWidth;slider.visible=Math.floor(slider.w/slider.itemW);slider.move=slider.vars.move>0&&slider.vars.move<slider.visible?slider.vars.move:slider.visible;slider.pagingCount=Math.ceil((slider.count-slider.visible)/slider.move+1);slider.last=slider.pagingCount-1;slider.limit=slider.pagingCount===1?0:slider.vars.itemWidth>slider.w?slider.itemW*(slider.count-1)+slideMargin*(slider.count-1):(slider.itemW+slideMargin)*slider.count-slider.w-slideMargin}else{slider.itemW=slider.w;slider.itemM=slideMargin;slider.pagingCount=slider.count;slider.last=slider.count-1}slider.computedW=slider.itemW-slider.boxPadding;slider.computedM=slider.itemM};slider.update=function(pos,action){slider.doMath();if(!carousel){if(pos<slider.currentSlide){slider.currentSlide+=1}else if(pos<=slider.currentSlide&&pos!==0){slider.currentSlide-=1}slider.animatingTo=slider.currentSlide}if(slider.vars.controlNav&&!slider.manualControls){if(action==="add"&&!carousel||slider.pagingCount>slider.controlNav.length){methods.controlNav.update("add")}else if(action==="remove"&&!carousel||slider.pagingCount<slider.controlNav.length){if(carousel&&slider.currentSlide>slider.last){slider.currentSlide-=1;slider.animatingTo-=1}methods.controlNav.update("remove",slider.last)}}if(slider.vars.directionNav){methods.directionNav.update()}};slider.addSlide=function(obj,pos){var $obj=$(obj);slider.count+=1;slider.last=slider.count-1;if(vertical&&reverse){pos!==undefined?slider.slides.eq(slider.count-pos).after($obj):slider.container.prepend($obj)}else{pos!==undefined?slider.slides.eq(pos).before($obj):slider.container.append($obj)}slider.update(pos,"add");slider.slides=$(slider.vars.selector+":not(.clone)",slider);slider.setup();slider.vars.added(slider)};slider.removeSlide=function(obj){var pos=isNaN(obj)?slider.slides.index($(obj)):obj;slider.count-=1;slider.last=slider.count-1;if(isNaN(obj)){$(obj,slider.slides).remove()}else{vertical&&reverse?slider.slides.eq(slider.last).remove():slider.slides.eq(obj).remove()}slider.doMath();slider.update(pos,"remove");slider.slides=$(slider.vars.selector+":not(.clone)",slider);slider.setup();slider.vars.removed(slider)};methods.init()};$(window).blur(function(e){focused=false}).focus(function(e){focused=true});$.flexslider.defaults={namespace:"flex-",selector:".slides > li",animation:"fade",easing:"swing",direction:"horizontal",reverse:false,animationLoop:true,smoothHeight:false,startAt:0,slideshow:true,slideshowSpeed:7e3,animationSpeed:600,initDelay:0,randomize:false,fadeFirstSlide:true,thumbCaptions:false,pauseOnAction:true,pauseOnHover:false,pauseInvisible:true,useCSS:true,touch:true,video:false,controlNav:true,directionNav:true,prevText:"Previous",nextText:"Next",keyboard:true,multipleKeyboard:false,mousewheel:false,pausePlay:false,pauseText:"Pause",playText:"Play",controlsContainer:"",manualControls:"",customDirectionNav:"",sync:"",asNavFor:"",itemWidth:0,itemMargin:0,minItems:1,maxItems:0,move:0,allowOneSlide:true,start:function(){},before:function(){},after:function(){},end:function(){},added:function(){},removed:function(){},init:function(){}};$.fn.flexslider=function(options){if(options===undefined){options={}}if(typeof options==="object"){return this.each(function(){var $this=$(this),selector=options.selector?options.selector:".slides > li",$slides=$this.find(selector);if($slides.length===1&&options.allowOneSlide===true||$slides.length===0){$slides.fadeIn(400);if(options.start){options.start($this)}}else if($this.data("flexslider")===undefined){new $.flexslider(this,options)}})}else{var $slider=$(this).data("flexslider");switch(options){case"play":$slider.play();break;case"pause":$slider.pause();break;case"stop":$slider.stop();break;case"next":$slider.flexAnimate($slider.getTarget("next"),true);break;case"prev":case"previous":$slider.flexAnimate($slider.getTarget("prev"),true);break;default:if(typeof options==="number"){$slider.flexAnimate(options,true)}}}}})(jQuery);








jQuery.fn.postLike = function() {
  if (jQuery(this).hasClass('done')) {
    return false;
  } else {
    jQuery(this).addClass('done');
    var id = jQuery(this).data("id"),
      action = jQuery(this).data('action'),
      rateHolder = jQuery(this).children('.love-count');
    var ajax_data = {
      action: "mzw_like",
      um_id: id,
      um_action: action
    };
    jQuery.post(ajax.ajax_url, ajax_data,
      function(data) {
        jQuery(rateHolder).html(data);
      });
    return false;
  }
};
jQuery(document).on("click", ".favorite", function() {
  jQuery(this).postLike()
});

$.fn.typing = function(n) {
  var options = {
    speed: 100,
    range: 0,
    repeat: true,
    flashback: true,
    flicker: false
  }
  $.extend(options, n);
  var _this = $(this);
  var str = $(this).text().split('');
  var index = 0;
  var direction = 1;
  $(str).each(function(i, k) {
    str[i] = (str[i - 1] ? str[i - 1] : '') + str[i];
  });
  _this.css('border-right', '1px solid #000');
  setTimeout(init, options.speed);

  function init() {
    _this.text(str[index]);
    if (index >= (str.length - 1) && options.repeat) {
      if (options.flashback) {
        direction = -1;
      } else {
        index = 0;
      }
      if (options.flicker) {
        _this.delay(200).fadeOut(1).delay(400).fadeIn(1).delay(200).fadeOut(1).delay(400).fadeIn(1);
      }
      setTimeout(init, 2000);
    } else if (index >= (str.length - 1) && !options.repeat) {
      if (options.flicker) {
        _this.delay(200).fadeOut(1).delay(400).fadeIn(1).delay(200).fadeOut(1).delay(400).fadeIn(1);
      }
      _this.css('border-right', '');
    } else if (index < 0) {
      index = 0;
      direction = 1;
      setTimeout(init, Math.random() * options.range + options.speed);
    } else {
      setTimeout(init, Math.random() * options.range + options.speed);
    }
    index += direction;
  }
};

$('#header .desc span').typing({
  range: 200,
  repeat: true
});

jQuery(document).ready(function($) {

  //顶部二级菜单展开
  $('#main-nav li.menu-item-has-children').hover(function(){
    $(this).find('.sub-menu').stop().show('normal');
  }, function(){
    $(this).find('.sub-menu').stop().hide('normal');
  });

  var $commentform = $('#commentform'),
    txt1 = '<div id="loading"><i class="fa fa-circle-o-notch fa-spin"></i> 正在提交, 请稍候...</div>',
    txt2 = '<div id="error">#</div>',
    txt3 = '">提交成功',
    edt1 = ', 刷新页面之前可以<a rel="nofollow" class="comment-reply-link" href="#edit" onclick=\'return addComment.moveForm("',
    edt2 = ')\'>重新编辑</a>',
    cancel_edit = '取消编辑',
    edit,
    num = 1,
    $comments = $('#comments-title span'),
    $cancel = $('#cancel-comment-reply-link'),
    cancel_text = $cancel.text(),
    $submit = $('#commentform #submit');
  $submit.attr('disabled', false),
    $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body'),
    comm_array = [];
  comm_array.push('');
  $('#comment').after(txt1 + txt2);
  $('#loading').hide();
  $('#error').hide();
  $(document).on("submit", "#commentform",
    function() {
      if (edit) $('#comment').after('<input type="text" name="edit_id" id="edit_id" value="' + edit + '" style="display:none;" />');
      editcode();
      $submit.attr('disabled', true).fadeTo('slow', 0.5);
      $('#loading').slideDown();
      $.ajax({
        url: ajax.ajax_url,
        data: $(this).serialize() + "&action=ajax_comment",
        type: $(this).attr('method'),
        error: function(request) {
          $('#loading').hide();
          $("#error").slideDown().html(request.responseText);
          setTimeout(function() {
              $submit.attr('disabled', false).fadeTo('slow', 1);
              $('#error').slideUp();
            },
            3000);
        },
        success: function(data) {
          $('#loading').hide();
          comm_array.push($('#comment').val());
          $('textarea').each(function() {
            this.value = ''
          });
          var t = addComment,
            cancel = t.I('cancel-comment-reply-link'),
            temp = t.I('wp-temp-form-div'),
            respond = t.I(t.respondId),
            post = t.I('comment_post_ID').value,
            parent = t.I('comment_parent').value;
          if (!edit && $comments.length) {
            n = parseInt($comments.text().match(/\d+/));
            $comments.text($comments.text().replace(n, n + 1));
          }
          new_htm = '" id="new_comm_' + num + '"></';
          new_htm = (parent == '0') ? ('\n<ol style="clear:both;" class="commentlist' + new_htm + 'ol>') : ('\n<ul class="children' + new_htm + 'ul>');
          ok_htm = '\n<div class="ajax-notice" id="success_' + num + txt3;
          div_ = (document.body.innerHTML.indexOf('div-comment-') == -1) ? '' : ((document.body.innerHTML.indexOf('li-comment-') == -1) ? 'div-' : '');
          ok_htm = ok_htm.concat(edt1, div_, 'comment-', parent, '", "', parent, '", "respond", "', post, '", ', num, edt2);
          ok_htm += '</span><span></span>\n';
          ok_htm += '</div>\n';
          $('#respond').before(new_htm);
          $('#new_comm_' + num).append(data);
          $('#new_comm_' + num + ' li').append(ok_htm);
          $body.animate({
              scrollTop: $('#new_comm_' + num).offset().top - 200
            },
            900);
          countdown();
          num++;
          edit = '';
          $('*').remove('#edit_id');
          cancel.style.display = 'none';
          cancel.onclick = null;
          t.I('comment_parent').value = '0';
          if (temp && respond) {
            temp.parentNode.insertBefore(respond, temp);
            temp.parentNode.removeChild(temp)
          }
        }
      });
      return false;
    });
  addComment = {
    moveForm: function(commId, parentId, respondId, postId, num) {
      var t = this,
        div,
        comm = t.I(commId),
        respond = t.I(respondId),
        cancel = t.I('cancel-comment-reply-link'),
        parent = t.I('comment_parent'),
        post = t.I('comment_post_ID');
      if (edit) exit_prev_edit();
      num ? (t.I('comment').value = comm_array[num], edit = t.I('new_comm_' + num).innerHTML.match(/(comment-)(\d+)/)[2], $new_sucs = $('#success_' + num), $new_sucs.hide(), $new_comm = $('#new_comm_' + num), $new_comm.hide(), $cancel.text(cancel_edit)) : $cancel.text(cancel_text);
      t.respondId = respondId;
      postId = postId || false;
      if (!t.I('wp-temp-form-div')) {
        div = document.createElement('div');
        div.id = 'wp-temp-form-div';
        div.style.display = 'none';
        respond.parentNode.insertBefore(div, respond)
      }!comm ? (temp = t.I('wp-temp-form-div'), t.I('comment_parent').value = '0', temp.parentNode.insertBefore(respond, temp), temp.parentNode.removeChild(temp)) : comm.parentNode.insertBefore(respond, comm.nextSibling);
      $body.animate({
          scrollTop: $('#respond').offset().top - 180
        },
        400);
      if (post && postId) post.value = postId;
      parent.value = parentId;
      cancel.style.display = '';
      cancel.onclick = function() {
        if (edit) exit_prev_edit();
        var t = addComment,
          temp = t.I('wp-temp-form-div'),
          respond = t.I(t.respondId);
        t.I('comment_parent').value = '0';
        if (temp && respond) {
          temp.parentNode.insertBefore(respond, temp);
          temp.parentNode.removeChild(temp);
        }
        this.style.display = 'none';
        this.onclick = null;
        return false;
      };
      try {
        t.I('comment').focus();
      } catch (e) {}
      return false;
    },
    I: function(e) {
      return document.getElementById(e);
    }
  };

  function exit_prev_edit() {
    $new_comm.show();
    $new_sucs.show();
    $('textarea').each(function() {
      this.value = ''
    });
    edit = '';
  }
  var wait = 15,
    submit_val = $submit.val();

  function countdown() {
    if (wait > 0) {
      $submit.val(wait);
      wait--;
      setTimeout(countdown, 1000);
    } else {
      $submit.val(submit_val).attr('disabled', false).fadeTo('slow', 1);
      wait = 15;
    }
  }

  function editcode() {
    var a = "",
      b = $("#comment").val(),
      start = b.indexOf("<code>"),
      end = b.indexOf("</code>");
    if (start > -1 && end > -1 && start < end) {
      a = "";
      while (end != -1) {
        a += b.substring(0, start + 6) + b.substring(start + 6, end).replace(/<(?=[^>]*?>)/gi, "&lt;").replace(/>/gi, "&gt;");
        b = b.substring(end + 7, b.length);
        start = b.indexOf("<code>") == -1 ? -6 : b.indexOf("<code>");
        end = b.indexOf("</code>");
        if (end == -1) {
          a += "</code>" + b;
          $("#comment").val(a)
        } else if (start == -6) {
          myFielde += "&lt;/code&gt;"
        } else {
          a += "</code>"
        }
      }
    }
    var b = a ? a : $("#comment").val(),
      a = "",
      start = b.indexOf("<pre>"),
      end = b.indexOf("</pre>");
    if (start > -1 && end > -1 && start < end) {
      a = a
    } else return;
    while (end != -1) {
      a += b.substring(0, start + 5) + b.substring(start + 5, end).replace(/<(?=[^>]*?>)/gi, "&lt;").replace(/>/gi, "&gt;");
      b = b.substring(end + 6, b.length);
      start = b.indexOf("<pre>") == -1 ? -5 : b.indexOf("<pre>");
      end = b.indexOf("</pre>");
      if (end == -1) {
        a += "</pre>" + b;
        $("#comment").val(a)
      } else if (start == -5) {
        myFielde += "&lt;/pre&gt;"
      } else {
        a += "</pre>"
      }
    }
  }

  function grin(a) {
    var b;
    a = " " + a + " ";
    if (document.getElementById("comment") && document.getElementById("comment").type == "textarea") {
      b = document.getElementById("comment")
    } else {
      return false
    }
    if (document.selection) {
      b.focus();
      sel = document.selection.createRange();
      sel.text = a;
      b.focus()
    } else if (b.selectionStart || b.selectionStart == "0") {
      var c = b.selectionStart;
      var d = b.selectionEnd;
      var e = d;
      b.value = b.value.substring(0, c) + a + b.value.substring(d, b.value.length);
      e += a.length;
      b.focus();
      b.selectionStart = e;
      b.selectionEnd = e
    } else {
      b.value += a;
      b.focus()
    }
  }
});

$(document).on("click", ".post-share>a", function(e) {
  e.preventDefault();
  if ($(this).parent().hasClass('share-on')) {
    $(this).parent().removeClass('share-on')
    $(this).next().hide();
  } else {
    $(this).parent().addClass('share-on')
    $(this).next().show();
  }
  return false;
});
$(document).on("click", ".post-share ul li a", function(e) {
  $(this).parent().parent().parent().removeClass('share-on')
  $(this).parent().parent().hide();
});

var ajaxBinded = false;

$(document).ready(function(e) {
  initgallary();
  refresh_qrimg();
  $('#qr').hover(function() {
    $('#qrimg').stop().fadeIn('normal');
  }, function() {
    $('#qrimg').stop().fadeOut('normal');
  });
});

function refresh_qrimg() {
  $('#qrimg').attr('src', 'http://s.jiathis.com/qrcode.php?url=' + location.href);
}

function initgallary() {
  $('.flexslider').flexslider({
    animation: "slide",
    controlNav: "thumbnails",
    smoothHeight: true,
    touch: true
  });
}


jQuery(window).scroll(function() {
  jQuery(this).scrollTop() > 100 ? jQuery("#gotop").css({
    bottom: "110px"
  }) : jQuery("#gotop").css({
    bottom: "-110px"
  })
});
jQuery("#gotop").click(function() {
  return jQuery("body,html").animate({ scrollTop: 0 }, 800), !1
});

//侧边栏悬停
var rollbox = $('#sidebar .widget'),
  rolllen = rollbox.length;
var asr_1=parseInt(ajax.fly1), asr_2=parseInt(ajax.fly2);
if ( asr_1!==-24 && asr_2!==-38 && rolllen!==0 && $('#sidebar').css('display')!=="none" ) {
  var sidebar_flying = false;
  $(window).scroll(function() {
    var roll = document.documentElement.scrollTop + document.body.scrollTop;
    if (roll > rollbox.eq(rolllen - 1).offset().top + rollbox.eq(rolllen - 1).height()) {
      if ($('.widgetRoller').length == 0) {
        rollbox.parent().append('<aside class="widgetRoller"></aside>');
        rollbox.eq(asr_1 - 1).clone().appendTo('.widgetRoller');
        if (asr_1 !== asr_2)
          rollbox.eq(asr_2 - 1).clone().appendTo('.widgetRoller')
        $('.widgetRoller').css({
          position: 'fixed',
          top: 10,
          display: 'none'
        });
      }
      if(!sidebar_flying)
        $('.widgetRoller').fadeIn('normal');
      sidebar_flying = true;
    } else {
      if(sidebar_flying)
        $('.widgetRoller').fadeOut('normal');
      sidebar_flying = false;
    }
  })
};

$(document).on("click", ".commentnav a", function() {
  var baseUrl = $(this).attr("href"),
    commentsHolder = $(".commentshow"),
    id = $(this).parent().data("postid"),
    page = 1,
    concelLink = $("#cancel-comment-reply-link");
  /comment-page-/i.test(baseUrl) ? page = baseUrl.split(/comment-page-/i)[1].split(/(\/|#|&).*jQuery/)[0] : /cpage=/i.test(baseUrl) && (page = baseUrl.split(/cpage=/)[1].split(/(\/|#|&).*jQuery/)[0]);
  concelLink.click();
  page = page.split('#')[0];
  var ajax_data = {
    action: "ajax_comment_page_nav",
    um_post: id,
    um_page: page
  };
  commentsHolder.html('<div>loading..</div>');
  jQuery("body, html").animate({
      scrollTop: commentsHolder.offset().top - 150
    },
    1e3);
  //add loading
  jQuery.post(ajax.ajax_url, ajax_data,
    function(data) {
      commentsHolder.html(data);
      //remove loading
      $("body, html").animate({
          scrollTop: commentsHolder.offset().top - 50
        },
        1e3)
    });
  return false;
});

jQuery(document).on("click", ".open-nav", function() {
  if (jQuery('body').hasClass('has-opened')) {
    jQuery('body').removeClass('has-opened');
    jQuery('#mobile-nav').delay(500).hide(100);
  } else {
    jQuery('#mobile-nav').show();
    jQuery('body').addClass('has-opened');
  }
});
jQuery(document).on("touchstart", ".has-opened #wrap", function() {
  jQuery('body').removeClass('has-opened');
  jQuery('#mobile-nav').delay(500).hide(100);
});

jQuery(document).ready(function($) {
  jQuery('.archives ul.archives-monthlisting').hide();
  jQuery('.archives ul.archives-monthlisting:first').show();
  //归档页面的开关
  jQuery('.archives .m-title').click(function() {
    jQuery(this).next().slideToggle('fast');
    return false;
  });
  add_views();
});

//AJAX增加访问量
function add_views() {
  var tmp = jQuery('article');
  if(tmp.length!=1)
    return;
  tmp = tmp.attr('class');

  var suzu = tmp.match(/post-([0-9]*)/);
  if(suzu===null || suzu.length<2 )
    return;
  var post_ID = suzu[1];

  var data = {
    'action': 'add_views',
    'post_ID': post_ID
  };
	jQuery.post(ajax.ajax_url, data);
}
