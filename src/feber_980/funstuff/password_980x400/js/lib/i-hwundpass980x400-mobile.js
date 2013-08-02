Util.Objects["hwundpass980x400_mobile"] = new function() {
	this.init = function(banner) {

		banner._initialized = true;
		banner._version = "mobile";
		banner.t_delay = false;
		banner._isreset = true;
		banner._iscleared = true;

		banner._initcontent = banner.innerHTML;


		// animation frames
		banner._images = new Array();
		for(i = 0; i <= 98; i++) {
			banner._images.push("/funstuff/password_980x400/img/sequence_mobile/picture_password_mobil_Final_0" + ((i > 9 ? i > 99 ? "0" : "00" : "000") + i) + ".jpg");
		}
		banner._framerate = 1000/12; // 12 frames a second




		// banner resat, update state
		banner.cleared = function() {

			this.innerHTML = this._initcontent;
		}

		// banner is ready - start loop here
		banner.ready = function(play) {

			// document.body.transitioned = function() {
			// 	u.a.transition(this, "none");
			// 	this.transitioned = null;
			// }
			// 
			// u.a.transition(document.body, "all 0.3s ease-in");
			// u.as(document.body, "backgroundColor", u.gcs(this, "background-color"));

			this._autoplay = play;

			this._isreset = false;
			this._iscleared = false;


			// setup banner
			u.o.banner.init(this);


			// banner content
			this.h2 = u.qs("h2", this);
			this.h2.banner = this;
			this.h3 = u.qs("h3", this);
			this.h3.banner = this;


			this.logo = u.qs(".logo", this);
			this.learnmore = u.qs(".learnmore", this);
			this.learnmore.banner = this;
			u.link(this.learnmore);
			this.learnmore.moved = function(event) {
				u.e.resetEvents(this);
			}
			this.learnmore.clicked = function() {
				window.open(this.url, "_blank");
			}

			this.fullclick = u.ae(this, "div", {"class":"fullclick"});
			this.fullclick.banner = this;
			u.e.click(this.fullclick);
			this.fullclick.moved = function(event) {
				u.e.resetEvents(this);
			}
			this.fullclick.clicked = function() {
				window.open(this.banner.learnmore.url, "_blank");
			}


			// u.a.transition(this.h2, "none");
			// u.a.translate(this.h2, 0, 0);
			// u.as(this.h2, "display", "block");
			// 
			// u.a.transition(this.h2, "all 0.5s ease-in");
			// u.a.setOpacity(this.h2, 1);

			u.a.transition(this.h3, "none");
			u.a.translate(this.h3, this.offsetWidth, 0);
			u.as(this.h3, "display", "block");
			u.a.setOpacity(this.h3, 1);


			// u.a.transition(this.logo, "none");
			// u.as(this.logo, "display", "none");
			// u.a.translate(this.logo, this.offsetWidth, 0);
			// u.a.setOpacity(this.logo, 1);

			u.a.transition(this.learnmore, "none");
			u.as(this.learnmore, "display", "none");
			u.a.translate(this.learnmore, this.offsetWidth, 0);
			u.a.setOpacity(this.learnmore, 1);

			// start playback after 1.5 seconds
//			this.t_delay = u.t.setTimer(this, this.sq1, 1500);

			this.preload(0, 50, "sq1", 1500);
		}

		// sequence 1
		// exit h2
		banner.sq1 = function() {
			u.a.transition(this.h2, "all 0.4s ease-in");
			u.a.translate(this.h2, -(this.offsetWidth), 0);

			this.t_delay = u.t.setTimer(this, this.sq2, 500);
		}

		// sequence 2
		// animation
		banner.sq2 = function() {
			this.setup(0, 50, "sq3");
		}

		// sequence 3
		// enter h3
		banner.sq3 = function() {
			u.a.transition(this.h3, "all 0.4s ease-in");
			u.a.translate(this.h3, 0, 0);

			this.preload(51, 98, "sq4", 2500);
//			this.t_delay = u.t.setTimer(this, this.sq4, 2500);
		}

		// sequence 4
		// exit h3
		banner.sq4 = function() {
			u.a.transition(this.h3, "all 0.4s ease-in");
			u.a.translate(this.h3, -(this.offsetWidth), 0);

			this.t_delay = u.t.setTimer(this, this.sq5, 500);
		}

		// sequence 5
		// animation
		banner.sq5 = function() {
			this.setup(51, 98, "sq6");
		}

		// sequence 6
		// enter h2
		banner.sq6 = function() {
			u.a.transition(this.h2, "none");
			u.a.translate(this.h2, this.offsetWidth, 0);

			u.a.transition(this.h2, "all 0.4s ease-in");
			u.a.translate(this.h2, 0, 0);

			this.t_delay = u.t.setTimer(this, this.sq7, 2500);
		}

		// sequence 7
		// exit h2
		banner.sq7 = function() {
			u.a.transition(this.h2, "all 0.4s ease-in");
			u.a.translate(this.h2, -(this.offsetWidth), 0);

			u.a.transition(this.logo, "all 0.4s ease-in");
			u.a.translate(this.logo, -(this.offsetWidth), 0);


			this.t_delay = u.t.setTimer(this, this.sq8, 500);
		}

		// sequence 8
		// show logo
		banner.sq8 = function() {
//			u.bug("sq8");

			u.a.transition(this.logo, "none");
			u.a.translate(this.logo, this.offsetWidth, 0);
			u.ac(this.logo, "exit");
			u.as(this.logo, "display", "block");
			u.a.transition(this.logo, "all 0.4s ease-in");

			u.a.transition(this.learnmore, "none");
			u.a.translate(this.learnmore, this.offsetWidth, 0);
			u.as(this.learnmore, "display", "block");
			u.a.transition(this.learnmore, "all 0.4s ease-in");

			u.a.translate(this.logo, 0, 0);
			u.a.translate(this.learnmore, 0, 0);


//			this.t_delay = u.t.setTimer(this, this.sq9, 1600);
		}


		banner.ready(true);

	}
}