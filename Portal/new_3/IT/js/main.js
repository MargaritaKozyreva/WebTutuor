(function($,doc,win) {
	win.App = win.App || {};
	$.extend(true, App, {
		_q: [],
		window: $(win),
		document: $(doc),
		page: $('html, body'),
		body: $('body'),
		_currentNiche: App._currentNiche || 0,
		lock_scroll_body:function($contain){
		   var scrollTop=$(win).scrollTop();
		   App.body.css('margin-top', '-'+scrollTop+'px')
		   App.body.data('scroll', scrollTop)
		   App.body.addClass('scroll_lock');
		   var selScrollable = $contain;
		   $(document).on('touchmove',function(e){
		    e.preventDefault();
		   });
		   App.body.on('touchstart', selScrollable, function(e) {
		    if (e.currentTarget.scrollTop === 0) {
		     e.currentTarget.scrollTop = 1;
		    } else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight) {
		     e.currentTarget.scrollTop -= 1;
		    }
		   });
		   App.body.on('touchmove', selScrollable, function(e) {
		    e.stopPropagation();
		   }); 
		   $($contain).focus();
		  },
		  unlock_scroll_body: function(){
		   App.body.removeAttr('style')
		   App.body.removeClass('scroll_lock')
		   $(win).scrollTop(App.body.data('scroll')) 
		   $(document).off('touchmove');
		   App.body.off('touchstart');
		   App.body.off('touchmove');
		  },
		//add scroll lo
		initSlider: function(){
			var slider = '';

			slider = $('.bxslider').bxSlider({
			  	controls:true,
				stopAutoOnClick: true,
				auto:true,
				pager: true,
			});
			$(window).on('resize', function() {
				slider.reloadSlider();
			})
		},
		initMansory: function() {
            $(win).on('load',function() {
                $('.posts').fadeIn('slow').css('display', 'flex');
                masonry=$('.posts').masonry({
                    gutter:30,
                    itemSelector: '.post'
                });
                setTimeout(function(){
                    masonry.masonry('reloadItems');
                    console.log('masonry')
                }, 1500)
	            console.log(masonry)

                var masTab = $('.personal-board .tabs-btn .btn');
	            var masCont = $('.personal-board .tabs-content .tab-content');
	            $(masTab).on('click',function(){
	                $(masTab).removeClass('active');
	                $(this).addClass('active');
	                $(masCont).hide();
	                $(masCont[$(this).index()]).fadeIn(
	                	function(){
	                		masonry.masonry('destroy');
	                		$('.posts').masonry({
			                    gutter:30,
			                    itemSelector: '.post'
			                });
	                	}
	                	);
	                console.log(masonry)
	            });
            });
        },
        initScroll:function(){
        	$('.sidebar').customScroll();
        	$('.window_filter').customScroll();
        	$('.contain_flow').customScroll();
        	$('.submenu-wrap').customScroll();
        },
        initFixed:function(){
        	min_right=46;
			fixed_container=$(".filter");
			fixed_filters=$('.window_filter');
			inside_container=$(".main");
			if(fixed_container.length){
				offset_top=fixed_container.offset().top-fixed_container.outerHeight();
				$(win).scroll(function() {
					var scrollTop =$(this).scrollTop(),
					offset_right=$(win).outerWidth()-(inside_container.offset().left + inside_container.outerWidth() - min_right);
					if (offset_top <= scrollTop) {
						fixed_container.css('right', offset_right)
						fixed_filters.css('right', offset_right)
						fixed_filters.css('width', inside_container.width());
						if(fixed_container.hasClass('fixed')) return false;
						fixed_filters.addClass('fixed')
						fixed_container.addClass('fixed');
					} else {
						fixed_container.removeClass('fixed');
						fixed_filters.css('right', min_right)
						fixed_filters.removeClass('fixed')
					}
				});
				$(win).resize(function(){
					$(this).scroll()
				})
			}
		},
         initFilter:function(){
			$('.filter').on('click', function(){
				inside_container=$(".main");
	            $(this).toggleClass('active');
	            if($(this).hasClass('active')){
	            	$('.window_filter').fadeIn()
	            	$('.window_filter').css('max-width', inside_container.width())
	            } else {	
	            	$('.window_filter').fadeOut()
	            }
            })
            $('.cancel').on('click', function(){
            	$('.window_filter').fadeOut();
            	$('.filter').removeClass('active');
            })
        },
        initSize:function(){
			$(window).on('resize', function() {
				inside_container=$(".main"); 
				$('.window_filter').css('max-width', inside_container.width())
			});
        },
         initDate:function(){
                $( ".calendar input[type='text']" ).datepicker();
                $('select').selectmenu(); 
        },
        initMenu: function() {
            $('header .btn').on('click',function(){
                $(this).toggleClass('active');
                $('header .submenu-wrap').toggle();
            });
        },
        //popup
        initPopup:function(){
			$(doc).on('click','[data-popup]',function(e){
			    e.preventDefault()
			    if($($(this).data('popup')).length){
			     App.lock_scroll_body($(this).data('popup'));
			     $($(this).data('popup')).fadeIn('slow', function(){
			      $(this).addClass('opened'); 
			     }).css('display', 'flex');
			    }
			   });
			   $(doc).on('click','.popup .close, .popup .close_btn, .popup .cancel, .popup .close_container', function(e) {
			    e.preventDefault();
			    var t=$(this);
			    App.unlock_scroll_body('slow')
			    t.parents('.popup').fadeOut();
			    t.parents('.popup').removeClass('opened');
			   });
        },
        initComp:function(){
			//присваиваем чекбоксам событие отметить детей
			var treeParent = document.getElementsByClassName("tree_parent");
			for (var i = 0; i < treeParent.length; i++) {
			  treeParent[i].addEventListener("click", checkChildrenHandler);
			}
			function checkChildrenHandler() {
			  checkChildren(this);
			}
			//отмечаем детей если отмечен родитель
			function checkChildren(treeParent) {
			  var treeParent = treeParent;
			  var treeChildnodes = treeParent.parentNode.parentNode.parentNode.getElementsByClassName("tree_child");
			  for (var j = 0; j < treeChildnodes.length; j++) {
			    if (treeParent.checked) {
			      treeChildnodes[j].checked = true;
			    } else {
			      treeChildnodes[j].checked = false;
			    }
			  }
			}
			//присваиваем кнопкам событие закрыть/раскрыть детей
			var openButtons = document.getElementsByClassName("opened");
			var closeButtons = document.getElementsByClassName("closed");
			for (var k = 0; k < openButtons.length; k++) {
			  openButtons[k].addEventListener("click", closeOpenHandler);
			  closeButtons[k].addEventListener("click", closeOpenHandler);
			}
			function closeOpenHandler(event) {
			   event.preventDefault();
			  closeOpen(this);
			}
			//закрываем/раскрываем детей
			function closeOpen(thisButton) {
			  var thisButton = thisButton;
			  var list = thisButton.parentNode.parentNode.querySelector(".tree_children");
			  if (thisButton.className == "opened") {
			    thisButton.style.display = "none";
			    thisButton.nextSibling.nextSibling.style.display = "block";
			    list.style.display = "none";
			  } else {
			    console.log(thisButton);
			    thisButton.style.display = "none";
			    thisButton.previousSibling.previousSibling.style.display = "block";
			    list.style.display = "block";
			  }
			}
        },
        initThree:function(){
        	 $(win).on('load',function() {
        	 	 $('.list_structure').fadeIn('slow');
        	 })
                $(".tree").treemenu({delay:300}).openActive(); 

        },
		initApp: function() {
			App.initSize();
			App.initScroll();
			App.initSlider();
			App.initFilter();
			App.initFixed();
			App.initDate();
			App.initMenu();
			App.initPopup();
			App.initComp();
			App.initMansory();
			App.initThree();
		}
	});
	App.initApp();
})(jQuery,document,window);

//App._q.push(function(){
// App.init();
//});