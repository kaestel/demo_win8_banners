Util.Objects["hwundcontroller"] = new function() {
	this.init = function(controller) {

		u.bug_position = "fixed";

		u.ac(controller, "hw_banner_controller");

		// remember start bg color
		controller._bg_color = u.gcs(document.body, "background-color");


		// locate banners
		controller.banners = new Array();
		controller.banners.push(u.qs("#hwundtiles"));

		controller.t_scroll = false;


		var a = u.qs("#hwundtiles");
		var fullclick = u.ae(a, "div", {"class":"fullclick"});
		u.e.click(fullclick);
		fullclick.clicked = function() {
			window.open(u.qs(".learnmore a", a).href, "_blank");
		}

		controller.current_state = false;

		// reset all banners
		controller.globalReset = function() {

		}


		window.resizeHandler = function() {
			u.qs(".hw_banner_controller").resizeHandler();
		}
		controller.resizeHandler = function() {
//			u.bug("resize:" + u.scrollY() + ":" + u.htmlH());

			this.globalReset();
		}
		u.e.addEvent(window, "resize", window.resizeHandler);

		// start intialization process
		controller.resizeHandler();

	}
}