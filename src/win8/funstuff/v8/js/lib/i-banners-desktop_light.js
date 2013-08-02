Util.Objects["banners"] = new function() {
	this.init = function(controller) {

		u.bug_position = "fixed";

		u.ac(controller, "hw_banner_controller");

		// remember start bg color
		controller._bg_color = u.gcs(document.body, "background-color");


		// locate banners
		controller.banners = new Array();
		controller.banners.push(u.qs("#hwundwina"));
		controller.banners.push(u.qs("#hwundwinb"));
		controller.banners.push(u.qs("#hwundwinc"));
		controller.banners.push(u.qs("#hwundwind"));

		controller.t_scroll = false;


		var a = u.qs("#hwundwina");
		var fullclick = u.ae(a, "div", {"class":"fullclick"});
		u.e.click(fullclick);
		fullclick.clicked = function() {
			window.open(u.qs(".learnmore a", a).href, "_blank");
		}

		var prerollclick = u.ae(a, "div", {"class":"prerollclick"});
		u.e.click(prerollclick);
		prerollclick.clicked = function() {
			window.open("http://script.tailsweep.com/csClick/17331107/http://www.youtube.com/watch?v=qOpt8kOvhmY", "_blank");
		}

		var b = u.qs("#hwundwinb");
		var fullclick = u.ae(b, "div", {"class":"fullclick"});
		u.e.click(fullclick);
		fullclick.clicked = function() {
			window.open(u.qs(".learnmore a", b).href, "_blank");
		}

		var c = u.qs("#hwundwinc");
		var fullclick = u.ae(c, "div", {"class":"fullclick"});
		u.e.click(fullclick);
		fullclick.clicked = function() {
			window.open(u.qs(".learnmore a", c).href, "_blank");
		}

		var d = u.qs("#hwundwind");
		var fullclick = u.ae(d, "div", {"class":"fullclick"});
		u.e.click(fullclick);
		fullclick.clicked = function() {
			window.open(u.qs(".learnmore a", d).href, "_blank");
		}

		controller.current_state = false;

		// reset all banners
		controller.globalReset = function() {

			var i, banner;
			for(i = 0; banner = this.banners[i]; i++) {
				if(!u.hc(banner, this.current_state)) {
					u.rc(banner, "full|tablet|mobile", 1);
					u.ac(banner, this.current_state);
				}
			}
		}


		window.resizeHandler = function() {
			u.qs(".hw_banner_controller").resizeHandler();
		}
		controller.resizeHandler = function() {
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

		// start intialization process
		controller.resizeHandler();

	}
}