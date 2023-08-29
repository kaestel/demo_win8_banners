Util.Objects["banners"] = new function() {
	this.init = function(controller) {

		u.bug_position = "fixed";
		u.bug_force = true;

		u.ac(controller, "hw_banner_controller");

		// remember start bg color
		controller._bg_color = u.gcs(document.body, "background-color");


		// locate banners
		controller.banners = new Array();
		controller.banners.push(u.qs("#hwundwina"));

		controller.t_scroll = false;


		controller.current_state = false;

		// reset all banners
		controller.globalReset = function() {

			var i, banner;
			for(i = 0; banner = this.banners[i]; i++) {
				if(banner.in_focus) {
					banner._reset();
				}
			}


			// delay callback, to avoid updating unnecessary updates, while user is still resizing
			this.t_scroll = u.t.setTimer(this, this.scrollHandler, 500);
//			this.scrollHandler();
		}

		window.scrollHandler = function() {
			u.qs(".hw_banner_controller").scrollHandler();
		}
		controller.scrollHandler = function() {
//			u.bug("scroll:" + u.scrollY() + "::" + u.browserH());

			// find current position
			var scrolled_y = u.scrollY();
			var browser_height = u.browserH();

			// focus area - 80% of viewable area
			var margin = (browser_height - browser_height*0.8)/2;
			var focus_top = scrolled_y + margin;
			var focus_bottom = scrolled_y + browser_height - margin;


			var i, banner;
			for(i = 0; banner = this.banners[i]; i++) {
				banner.top_y = u.absY(banner);
				banner.center_y = banner.top_y + (banner.offsetHeight/2);
				banner.bottom_y = banner.top_y + banner.offsetHeight;


				if(banner.center_y > focus_top && banner.center_y < focus_bottom) {

					// focus and (not playing or ready to play)
					if(!banner.in_focus || banner._iscleared) {

						// not initialized or state changed
						if(!banner._initialized) {

							// banner initialization
								u.o[banner.id].init(banner);

						}
						// already initialized and ready
						// banner playback
						else if(banner._iscleared) {

//							u.bug("banner.ready")
							banner.ready(true);


						}
					}
					// in focus, but not ready - play when ready
					else {
//						u.bug("in focus, but not ready:" + banner._iscleared);
						banner._autoplay = true;
					}
					banner.in_focus = true;


				}
				// reset banner
				else {
//					u.bug("no focus")
					if(banner.in_focus && !banner._isreset) {
//						u.bug("banner.reset")
//						banner._autoplay = false;
						banner._reset(this.current_state);
						banner.in_focus = false;
					}
				}

			
			}

		}

		u.e.addEvent(window, "scroll", window.scrollHandler);

		// u.e.beforeScroll(document.body);
		// document.body.picked = function(event) {
		// 	window.scrollHandler();
		// }
		// resize handler calls back to scrollhandler
//		banner.scrollHandler();



		window.resizeHandler = function() {
			u.qs(".hw_banner_controller").resizeHandler();
		}
		controller.resizeHandler = function() {
//			u.bug("resize:" + u.scrollY() + ":" + u.htmlH());

			u.t.resetTimer(this.t_scroll);
			this.globalReset();
		}
		u.e.addEvent(window, "resize", window.resizeHandler);

		// start intialization process
		controller.resizeHandler();

	}
}
