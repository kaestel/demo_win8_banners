Util.Objects["hwundintro980x300"] = new function() {
	this.init = function(banner) {
//		u.bug("init")

		banner._initialized = true;
		banner._version = "tablet,full";
		banner.t_delay = false;
		banner._isreset = true;
		banner._iscleared = true;

		banner._initcontent = banner.innerHTML;

		// animation frames
		banner._images = new Array();
		for(i = 0; i <= 84; i++) {
			banner._images.push("/funstuff/intro_980x300/img/sequence/IntroBanner_V003_" + ((i > 9 ? i > 99 ? i > 999 ? "0" : "00" : "000" : "0000") + i) + ".jpg");
		}
		banner._framerate = 1000/12; // 12 frames a second


		// banner resat, update state
		banner.cleared = function() {
//			u.bug("cleared: autoplay=" + this._autoplay)

			this.innerHTML = this._initcontent;
		}

		// banner is ready - start loop here
		banner.ready = function(play) {
//			u.bug("ready")

//			HW_tailsweepTrack(17331106);

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

			u.a.transition(this.h3, "none");
			u.a.translate(this.h3, -this.offsetWidth, 0);
			u.as(this.h3, "display", "block");
			u.a.setOpacity(this.h3, 1);

			this.preload(0, 79, "sq1", 1500);
		}


		// sequence 1
		// move h2 out, fade down logo and cta, start animation playback
		banner.sq1 = function() {
//			u.bug("sq1");

			u.a.transition(this.h2, "all 0.6s ease-in");
			u.a.translate(this.h2, -this.offsetWidth, 0);

			// u.a.transition(this.logo, "all 1s ease-in");
			// u.a.setOpacity(this.logo, 0);
			
			u.a.transition(this.learnmore, "all 1s ease-in");
			u.a.setOpacity(this.learnmore, 0);

			this.t_delay = u.t.setTimer(this, this.sq2, 600);
		}

		// sequence 2
		banner.sq2 = function() {
//			u.bug("sq2");

			this.setup(0, 79, "sq3");
		}

		banner.sq3 = function() {
//			u.bug("sq3");

			u.a.transition(this.h3, "all 0.6s ease-in");
			u.a.translate(this.h3, 0, 0);

			this.setup(79, this._images.length-1, "sq4");
		}

		banner.sq4 = function() {
//			u.bug("sq4");

			// u.a.transition(this.logo, "all 0.5s ease-in");
			// u.a.setOpacity(this.logo, 1);

			u.a.transition(this.learnmore, "all 0.5s ease-in");
			u.a.setOpacity(this.learnmore, 1);

			this.prerollclick = u.ae(this, "div", {"class":"prerollclick"});
			this.prerollclick.banner = this;
			u.e.click(this.prerollclick);
			this.prerollclick.clicked = function() {
				window.open("http://script.tailsweep.com/csClick/17331107/http://www.youtube.com/watch?v=qOpt8kOvhmY", "_blank");
			}

		}

		banner.ready(true);
	}
}