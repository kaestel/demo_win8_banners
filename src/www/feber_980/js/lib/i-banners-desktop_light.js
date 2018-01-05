Util.Objects["hwundcontroller"] = new function() {
	this.init = function(banner) {

		u.bug_position = "fixed";

		var ctl = u.qs(".hwundcontroller");
		// if not - make current banner the controller
		if(!ctl || !ctl.banners) {
			u.ac(banner, "hwundcontroller");
			ctl = banner;

			// banner collection
			ctl.banners = new Array();

			// start values
			ctl.t_scroll = false;
			ctl.current_state = false;


			// reset all banners
			ctl.globalReset = function() {

				var i, banner;
				for(i = 0; banner = this.banners[i]; i++) {
					if(!u.hc(banner, this.current_state)) {
						u.rc(banner, "full|tablet|mobile", 1);
						u.ac(banner, this.current_state);
					}
				}
			}


			window.resizeHandler = function() {
				u.qs(".hwundcontroller").resizeHandler();
			}
			ctl.resizeHandler = function() {
	//			u.bug("resize:" + u.scrollY() + ":" + u.htmlH());

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

		// set fullclick area on banner
		var fullclick = u.ae(banner, "div", {"class":"fullclick"});
		u.e.click(fullclick);
		fullclick.clicked = function() {
			window.open(u.qs(".learnmore a", banner).href, "_blank");
		}

		// add current banner to controller
		ctl.banners.push(banner);

		// start intialization process
		ctl.resizeHandler();

	}
}