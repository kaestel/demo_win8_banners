Util.Objects["hwundwina_mobile"] = new function() {
	this.init = function(banner) {
//		u.bug("init mobile")

		banner._initialized = true;
		banner._version = "mobile";
		banner.t_delay = false;
		banner._isreset = true;
		banner._iscleared = true;

		banner._initcontent = banner.innerHTML;



		// animation frames
		banner._images = new Array();
		for(i = 0; i <= 84; i++) {
			banner._images.push("/funstuff/v8/img/a_mobile/IntroBanner_Mobile_V001_" + ((i > 9 ? i > 99 ? i > 999 ? "0" : "00" : "000" : "0000") + i) + ".jpg");
		}
		banner._framerate = 1000/12; // 12 frames a second






		// banner resat, update state
		banner.cleared = function() {
//			u.bug("mobile cleared")

			this.innerHTML = this._initcontent;

		}


		// banner is ready - start loop here
		banner.ready = function(play) {
//			u.bug("ready")

			document.body.transitioned = function() {
				u.a.transition(this, "none");
				this.transitioned = null;
			}

			u.a.transition(document.body, "all 0.3s ease-in");
			u.as(document.body, "backgroundColor", u.gcs(this, "background-color"));


			this._autoplay = play;

			this._isreset = false;
			this._iscleared = false;


			// setup banner
			u.o.banner.init(this);


			// banner content
			this.h2 = u.qs("h2", this);
			this.h2.banner = this;

			this.logo = u.qs(".logo", this);
			this.learnmore = u.qs(".learnmore", this);
			this.learnmore.banner = this;
			u.link(this.learnmore);
			this.learnmore.moved = function(event) {
	//			u.e.kill(event);
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

			u.a.transition(this.logo, "none");
			u.as(this.logo, "display", "none");
			u.a.setOpacity(this.logo, 0);


			u.a.transition(this.logo, "none");
			u.a.translate(this.logo, this.offsetWidth, 0);
			u.as(this.logo, "display", "block");
			u.a.setOpacity(this.logo, 1);

			this.preload(0, this.nodes.length-1, "sq1", 1500);
		}

		// sequence 1
		// move h2 out
		banner.sq1 = function() {
//			u.bug("sq1");

			u.a.transition(this.h2, "all 0.4s ease-in");
			u.a.translate(this.h2, -this.offsetWidth, 0);

//			this.sq2();
			this.t_delay = u.t.setTimer(this, this.sq1_logo_in, 400);
		}

		banner.sq1_logo_in = function() {
//			u.bug("sq1");

			u.a.transition(this.logo, "all 0.4s ease-in");
			u.a.translate(this.logo, 0, 0);

//			this.sq2();
			this.t_delay = u.t.setTimer(this, this.sq1_logo_out, 1600);
		}

		banner.sq1_logo_out = function() {
//			u.bug("sq1");

			u.a.transition(this.logo, "all 0.4s ease-in");
			u.a.translate(this.logo, -(this.offsetWidth), 0);

			this.sq2();
//			this.t_delay = u.t.setTimer(this, this.sq2, 600);
		}

		// sequence 2
		// start sequence playback
		banner.sq2 = function() {
//			u.bug("sq2");

			u.a.transition(this.animation, "none");
			u.a.setOpacity(this.animation, 1);
			this.setup(0, this.nodes.length-1, "sq3");
		}

		// sequence 3
		// show logo
		banner.sq3 = function() {
//			u.bug("sq3");

			this.resetAnimation();
			u.a.transition(this.logo, "none");
			u.a.translate(this.logo, this.offsetWidth, 0);
			// u.a.setHeight(this.logo, 40);
			// u.a.setWidth(this.logo, 210);

			u.as(this.logo, "display", "block");
			u.a.transition(this.logo, "all 0.6s ease-in");
//			u.a.setOpacity(this.logo, 1);
			u.a.translate(this.logo, 0, 0);

			this.t_delay = u.t.setTimer(this, this.sq4, 1600);
		}

		// sequence 4
		// shrink logo
		banner.sq4 = function() {
//			u.bug("sq4");
			u.a.transition(this.logo, "none");

			u.a.transition(this.logo, "all 0.6s ease-in");
			u.a.translate(this.logo, -29, 13);
			u.a.setHeight(this.logo, 20);
			u.a.setWidth(this.logo, 106);

//			this.t_delay = u.t.setTimer(this, this.sq5, 600);
			this.sq5();
		}

		// sequence 5
		// show CTA
		banner.sq5 = function() {
//			u.bug("sq5");

			u.a.transition(this.learnmore, "none");
			u.as(this.learnmore, "display", "block");
			u.a.translate(this.learnmore, this.offsetWidth, 0);
			u.a.setOpacity(this.learnmore, 1);

			u.a.transition(this.learnmore, "all 0.6s ease-in");
			u.a.translate(this.learnmore, 0, 0);
		}

		banner.ready(true);

	}
}