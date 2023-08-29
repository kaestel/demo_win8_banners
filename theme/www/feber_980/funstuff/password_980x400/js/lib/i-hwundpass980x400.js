Util.Objects["hwundpass980x400"] = new function() {
	this.init = function(banner) {

		banner._initialized = true;
		banner._version = "tablet,full";
		banner.t_delay = false;
		banner._isreset = true;
		banner._iscleared = true;
		banner.selected_view = false;
		banner.t_next = false;

		banner._initcontent = banner.innerHTML;


		// animation frames
		banner._images = new Array();
		for(i = 0; i <= 147; i++) {
			banner._images.push("/feber_980/funstuff/password_980x400/img/sequence/PicturePassword980x400_0" + ((i > 9 ? i > 99 ? "0" : "00" : "000") + i) + ".jpg");
		}
		banner._framerate = 1000/12; // 12 frames a second



		banner.hoverHint = function() {

			this.hint1.transitioned = function() {
				this.transitioned = null;
				u.a.transition(this, "none");

				this.transitioned = function() {
					this.transitioned = null;
					u.a.transition(this, "none");

					this.banner.hoverHint();
				}

				u.a.transition(this, "all 1s ease-in-out");
				u.a.setBgPos(this, 0, 28);
			}

			u.a.transition(this.hint1, "all 1s ease-in-out");
			u.a.setBgPos(this.hint1, 0, 33);

		}

		banner.activateView = function(view) {

			view.banner = this;
			view._id = view.className.match(/\d/);

			u.a.transition(view, "all 0.2s ease-in");
			u.e.click(view);
			view.clicked = function() {
				this.banner.selectView(this._id);
			}
		}

		banner.nextView = function() {
			this.selectView(Number(this.selected_index)+1);
		}

		banner.selectView = function(index) {
//			u.bug("selectView:" + index)

			u.t.resetTimer(this.t_next);

			this.stopAnimation();

			// correct index
			if(index < 1) {
				index = 3;
			}
			else if(index > 3) {
				index = 1;
			}


			if(!this.selected_view) {
				this.selected_index = index;
				this.selected_view = this["view"+index];

				u.ac(this.selected_view, "selected");

				this.viewEnded = function() {
					this.viewEnded = null;

					this.t_next = u.t.setTimer(this, this.nextView, 4000);
					// this.selectView(this.selected_index+1);
				}
				this.selected_view._iscleared = false;
				this["v"+this.selected_view._id+"start"]();

			}
			else {
				this.org_view = this.selected_view;

				this.selected_index = index;
				this.selected_view = this["view"+index];

				u.rc(this.org_view, "selected");
				u.ac(this.selected_view, "selected");


				this.viewExited = function() {

					this.viewEnded = function() {
						this.viewEnded = null;

						this.t_next = u.t.setTimer(this, this.nextView, 3000);

						// this.selectView(this.selected_index+1);
					}
					this.org_view._iscleared = true;
					this.selected_view._iscleared = false;
					this["v"+this.selected_view._id+"start"]();
				}

				if(!this.org_view._iscleared) {
					this["v"+this.org_view._id+"exit"]();
				}
				else {
					this.viewExited();
				}

			}
		}



		// banner resat, update state
		banner.cleared = function() {

			this.innerHTML = this._initcontent;

			u.t.resetTimer(this.t_next);
			this.selected_view = false;
		}


		// banner is ready - start loop here
		banner.ready = function(play) {
//			u.bug("ready")

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

			this.intro_text = "Lösenord123";

			// banner content
			this.h2 = u.qs("h2", this);
			this.h2.banner = this;

			this.hint1 = u.qs("p.hint1", this);
			this.hint1.banner = this;
			this.views = u.qs("ul.views", this);
			this.views.banner = this;

			this.view1 = u.qs("ul.views .view1", this);
			this.view2 = u.qs("ul.views .view2", this);
			this.view3 = u.qs("ul.views .view3", this);

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


			// set everything for new start
			u.a.transition(this.h2, "none");
			u.a.translate(this.h2, -this.offsetWidth, 0);
			u.as(this.h2, "display", "block");
			u.a.setOpacity(this.h2, 1);

			u.a.transition(this.hint1, "none");
			u.a.translate(this.hint1, -this.offsetWidth, 0);
			u.as(this.hint1, "display", "block");
			u.a.setOpacity(this.hint1, 1);

			u.a.transition(this.views, "none");
			u.a.translate(this.views, this.offsetWidth, 0);
			u.as(this.views, "display", "block");
			u.a.setOpacity(this.views, 1);

			// start playback after 1.5 seconds
			this.t_delay = u.t.setTimer(this, this.sq1, 300);

			this.preload(0, this.nodes.length-1, "false", 2500);
		}


		// sequence 1
		// start intro animation
		banner.sq1 = function() {
//			u.bug("sq1");

			this.intro = u.ae(this, "div", {"class":"intro"});
			this.intro.banner = this;

			this.intro.innerHTML = this.intro.innerHTML.replace("_", "") + this.intro_text[0] + "_";
			this.t_delay = u.t.setTimer(this, this.sq2, 100);
		}

		// sequence 2
		banner.sq2 = function() {
//			u.bug("sq2");

			this.intro.innerHTML = this.intro.innerHTML.replace("_", "") + this.intro_text[1] + "_";
			this.t_delay = u.t.setTimer(this, this.sq3, 200);
		}
		// sequence 3
		banner.sq3 = function() {
//			u.bug("sq3");

			this.intro.innerHTML = this.intro.innerHTML.replace("_", "") + this.intro_text[2] + "_";
			this.t_delay = u.t.setTimer(this, this.sq4, 300);
		}
		// sequence 4
		banner.sq4 = function() {
//			u.bug("sq4");

			this.intro.innerHTML = this.intro.innerHTML.replace("_", "") + this.intro_text[3] + "_";
			this.t_delay = u.t.setTimer(this, this.sq5, 200);
		}
		// sequence 5
		banner.sq5 = function() {
//			u.bug("sq5");

			this.intro.innerHTML = this.intro.innerHTML.replace("_", "") + this.intro_text[4] + "_";
			this.t_delay = u.t.setTimer(this, this.sq6, 500);
		}
		// sequence 6
		banner.sq6 = function() {
//			u.bug("sq6");

			this.intro.innerHTML = this.intro.innerHTML.replace("_", "") + this.intro_text[5] + "_";
			this.t_delay = u.t.setTimer(this, this.sq7, 100);
		}
		// sequence 7
		banner.sq7 = function() {
//			u.bug("sq7");

			this.intro.innerHTML = this.intro.innerHTML.replace("_", "") + this.intro_text[6] + "_";
			this.t_delay = u.t.setTimer(this, this.sq8, 100);
		}
		// sequence 8
		banner.sq8 = function() {
//			u.bug("sq8");

			this.intro.innerHTML = this.intro.innerHTML.replace("_", "") + this.intro_text[7] + "_";
			this.t_delay = u.t.setTimer(this, this.sq9, 300);
		}
		// sequence 9
		banner.sq9 = function() {
//			u.bug("sq9");

			this.intro.innerHTML = this.intro.innerHTML.replace("_", "") + this.intro_text[8] + "_";
			this.t_delay = u.t.setTimer(this, this.sq10, 100);
		}
		// sequence 10
		banner.sq10 = function() {
//			u.bug("sq10");

			this.intro.innerHTML = this.intro.innerHTML.replace("_", "") + this.intro_text[9] + "_";
			this.t_delay = u.t.setTimer(this, this.sq11, 200);
		}
		// sequence 11
		banner.sq11 = function() {
//			u.bug("sq11");

			this.intro.innerHTML = this.intro.innerHTML.replace("_", "") + this.intro_text[10] + "_";
			this.t_delay = u.t.setTimer(this, this.sq12, 300);
		}
		// sequence 12
		banner.sq12 = function() {
//			u.bug("sq12");

			this.intro.innerHTML = this.intro.innerHTML.replace("_", "");
			this.t_delay = u.t.setTimer(this, this.sq13, 400);
		}
		// sequence 13
		banner.sq13 = function() {
//			u.bug("sq13");

			this.intro.innerHTML += "_";
			this.t_delay = u.t.setTimer(this, this.sq14, 400);
		}
		// sequence 14
		banner.sq14 = function() {
//			u.bug("sq14");

			this.intro.innerHTML = this.intro.innerHTML.replace("_", "");
			this.t_delay = u.t.setTimer(this, this.sq15, 400);
		}
		// sequence 15
		banner.sq15 = function() {
//			u.bug("sq15");

			this.intro.innerHTML += "_";
			this.t_delay = u.t.setTimer(this, this.sq16, 400);
		}
		// sequence 16
		banner.sq16 = function() {
//			u.bug("sq16");

			this.intro.innerHTML = this.intro.innerHTML.replace("_", "");
			// still loading
			if(this._isloading) {
				this.t_delay = u.t.setTimer(this, this.sq15, 400);
			}
			else {
				this.t_delay = u.t.setTimer(this, this.sq17, 100);
			}
		}

		// sequence 17
		// exit intro, and start animation
		banner.sq17 = function() {
//			u.bug("sq17");

			u.a.transition(this.learnmore, "all 0.5s ease-in");
			u.a.setOpacity(this.learnmore, 1);

			u.a.transition(this.logo, "all 0.5s ease-in");
			u.a.setOpacity(this.logo, 1);

			u.a.transition(this.intro, "all 0.5s ease-out");
			u.a.translate(this.intro, -this.offsetWidth, 0);

			this.activateView(this.view1);
			this.activateView(this.view2);
			this.activateView(this.view3);

			this.selectView(1);

			this.t_delay = u.t.setTimer(this, this.sq18, 400);
		}

		// sequence 18
		// show options and hint, continue animation
		banner.sq18 = function() {
//			u.bug("sq18");

//			this.options
			u.a.transition(this.h2, "all 0.4s ease-in");
			u.a.translate(this.h2, 0, 0);

			u.a.transition(this.views, "all 0.4s ease-in");
			u.a.translate(this.views, 0, 0);

			u.a.transition(this.hint1, "all 0.4s ease-in");
			u.a.translate(this.hint1, 0, 0);
			this.hoverHint();
		}


		banner.v1start = function() {
			this.setup(0, 43, "viewEnded");
		}
		banner.v2start = function() {
			this.setup(100, 137, "viewEnded");
		}
		banner.v3start = function() {
			this.setup(53, 90, "viewEnded");
		}

		banner.v1exit = function() {
			if(this._current_frame < 10) {
				this.setup(this._current_frame, 0, "viewExited");
			}
			else {
				this.setup(43, 50, "viewExited");
			}
		}
		banner.v2exit = function() {
			if(this._current_frame < 110) {
				this.setup(this._current_frame, 100, "viewExited");
			}
			else {
				this.setup(137, 147, "viewExited");
			}
		}
		banner.v3exit = function() {
			if(this._current_frame < 63) {
				this.setup(this._current_frame, 53, "viewExited");
			}
			else {
				this.setup(90, 100, "viewExited");
			}
		}

		banner.ready(true);

	}
}