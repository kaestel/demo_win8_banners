Util.Objects["hwundcontroller"] = new function() {
	this.init = function(banner) {

		u.bug_position = "fixed";
		u.bug_force = true;

		// controller already exists?
		var ctl = u.qs(".hwundcontroller");
		// if not - make current banner the controller
		if(!ctl || !ctl.banners) {
			u.ac(banner, "hwundcontroller");
			ctl = banner;

			// banner collection
			ctl.banners = new Array();

			// remember start bg color, in case banner wants to work with backgrounds
			ctl._bg_color = u.gcs(document.body, "background-color");

			// start values
			ctl.t_scroll = false;
			ctl.current_state = false;


			// reset handler - looking at all banners
			ctl.globalReset = function() {

				var i, banner;
				for(i = 0; banner = this.banners[i]; i++) {
					if(banner.in_focus) {
						banner._reset(this.current_state);
					}
					else {
						if(!u.hc(banner, this.current_state)) {
							u.rc(banner, "full|tablet|mobile", 1);
							u.ac(banner, this.current_state);
						}
					}
				}

				// delay callback, to avoid updating unnecessary updates, while user is still resizing
				this.t_scroll = u.t.setTimer(this, this.scrollHandler, 500);
	//			this.scrollHandler();
			}


			window.scrollHandler = function() {
				u.qs(".hwundcontroller").scrollHandler();
			}
			ctl.scrollHandler = function() {
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
							if(!banner._initialized || !banner._version.match(this.current_state)) {

								// banner initialization
								if(this.current_state == "mobile") {
									u.o[banner.id+"_"+this.current_state].init(banner);
								}
								else {
									u.o[banner.id].init(banner);
								}

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



			window.resizeHandler = function() {
				u.qs(".hwundcontroller").resizeHandler();
			}
			ctl.resizeHandler = function() {
	//			u.bug("resize:" + u.scrollY() + ":" + u.htmlH());

				u.t.resetTimer(this.t_scroll);
				if(u.browserW() < 768) {
					if(this.current_state != "mobile") {
						this.current_state = "mobile";
					}
				}
				else if(u.browserW() < 980) {
					if(this.current_state != "tablet") {
						this.current_state = "tablet";
					}
				}
				else {
					if(this.current_state != "full") {
						this.current_state = "full";
					}
				}
				this.globalReset();
			}
			u.e.addEvent(window, "resize", window.resizeHandler);


		}

		// add current banner to controller
		ctl.banners.push(banner);


		// start intialization process
		ctl.resizeHandler();

	}
}