Util.Objects["hwundwinc_mobile"] = new function() {
	this.init = function(banner) {

		banner._initialized = true;
		banner._version = "mobile";
		banner.t_delay = false;
		banner._isreset = true;
		banner._iscleared = true;

		banner._initcontent = banner.innerHTML;


		// // clean up after other segments
		// if(u.qs(".fullclick", banner)) {
		// 	banner.removeChild(u.qs(".fullclick", banner));
		// }
		// if(u.qs(".animation", banner)) {
		// 	banner.removeChild(u.qs(".animation", banner));
		// }
		// if(u.qs(".prev_next", banner)) {
		// 	banner.removeChild(u.qs(".prev_next", banner));
		// }
		// if(u.qs(".show_next", banner)) {
		// 	banner.removeChild(u.qs(".show_next", banner));
		// }


		// animation frames
		banner._images = new Array();
		for(i = 0; i <= 85; i++) {
			banner._images.push("/win8/funstuff/v8/img/c_mobile/PcSelector_Mobile_0" + ((i > 9 ? i > 99 ? "0" : "00" : "000") + i) + ".jpg");
		}
		banner._framerate = 1000/12; // 12 frames a second





		banner.activateComp = function(comp) {

			comp.banner = this;
			comp._id = comp.className.match(/\d/);
//			u.bug("id:" + comp._id);
			comp._h3 = u.qs("h3", comp);
			u.as(comp._h3, "display", "block");


			comp.showSpec = function(spec) {
//				u.a.setOpacity(this, 0);
//				u.bug("show specs:" + this.className)
				u.a.transition(spec, "none");
				u.as(spec, "display", "block");

				u.a.transition(spec, "all 0.3s ease-in");
				u.a.setOpacity(spec, 1);
			}
			comp.hideSpec = function(spec) {
//				u.bug("hide specs:" + this.className)
				spec.transitioned = function() {
//					u.bug("specs hidden:" + this.className)
					this.transitioned = null;
					u.a.transition(this, "none");
					u.as(this, "display", "none");
					if(typeof(this.specHidden) == "function") {
						this.specHidden();
					}
				}

				if(u.gcs(spec, "opacity") != 0) {
					u.a.transition(spec, "all 0.5s ease-in");
					u.a.setOpacity(spec, 0);
				}
				else {
					spec.transitioned();
				}
			}

			comp.spec1 = u.qs(".hotspot1", comp);
			comp.spec1.comp = comp;
			comp.spec1.banner = this;
			u.a.transition(comp.spec1, "none");
			u.a.setOpacity(comp.spec1, 0);

			comp.spec2 = u.qs(".hotspot2", comp);
			comp.spec2.comp = comp;
			comp.spec2.banner = this;
			u.a.transition(comp.spec2, "none");
			u.a.setOpacity(comp.spec2, 0);

		}

		// banner resat, update state
		banner.cleared = function() {

			this.innerHTML = this._initcontent;
			// 
			// 
			// // remove specific settings, before possible format switch
			// u.a.transition(this.logo, "none");
			// u.a.translate(this.logo, 0, 0);
			// 
			// // if(this.comp1._h3) {
			// // 	u.a.transition(this.comp1._h3, "none");
			// // 	u.as(this.comp1._h3, "display", "none");
			// // }
			// // if(this.comp2._h3) {
			// // 	u.a.transition(this.comp2._h3, "none");
			// // 	u.as(this.comp2._h3, "display", "none");
			// // }
			// // if(this.comp3._h3) {
			// // 	u.a.transition(this.comp3._h3, "none");
			// // 	u.as(this.comp3._h3, "display", "none");
			// // }
			// 
			// 
			// if(this.comp1.spec1) {
			// 	u.a.transition(this.comp1.spec1, "none");
			// 	u.a.setOpacity(this.comp1.spec1, 1);
			// 	u.as(this.comp1.spec1, "display", "block");
			// }
			// if(this.comp1.spec2) {
			// 	u.a.transition(this.comp1.spec2, "none");
			// 	u.a.setOpacity(this.comp1.spec2, 1);
			// 	u.as(this.comp1.spec2, "display", "block");
			// }
			// 
			// if(this.comp2.spec1) {
			// 	u.a.transition(this.comp2.spec1, "none");
			// 	u.a.setOpacity(this.comp2.spec1, 1);
			// 	u.as(this.comp2.spec1, "display", "block");
			// }
			// if(this.comp2.spec2) {
			// 	u.a.transition(this.comp2.spec2, "none");
			// 	u.a.setOpacity(this.comp2.spec2, 1);
			// 	u.as(this.comp2.spec2, "display", "block");
			// }
			// 
			// if(this.comp3.spec1) {
			// 	u.a.transition(this.comp3.spec1, "none");
			// 	u.a.setOpacity(this.comp3.spec1, 1);
			// 	u.as(this.comp3.spec1, "display", "block");
			// }
			// if(this.comp3.spec2) {
			// 	u.a.transition(this.comp3.spec2, "none");
			// 	u.a.setOpacity(this.comp3.spec2, 1);
			// 	u.as(this.comp3.spec2, "display", "block");
			// }
			// 
			// u.a.transition(this.comp1, "none");
			// u.a.translate(this.comp1, 0, 0);
			// u.a.transition(this.comp2, "none");
			// u.a.translate(this.comp2, 0, 0);
			// u.a.transition(this.comp3, "none");
			// u.a.translate(this.comp3, 0, 0);
			// 
			// 
			// u.a.transition(this.learnmore, "none");
			// u.a.translate(this.learnmore, 0, 0);

		}


		// banner is ready - start loop here
		banner.ready = function(play) {

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
			this.h2.org_text = this.h2.innerHTML;

			this.hint1 = u.qs(".hint1", this);
			this.hint1.banner = this;


			this.comp1 = u.qs(".comp.comp1", this);
			this.comp2 = u.qs(".comp.comp2", this);
			this.comp3 = u.qs(".comp.comp3", this);


			this.logo = u.qs(".logo", this);
			this.learnmore_irl = u.qs(".learnmore.irl", this);
			this.learnmore_irl.banner = this;
			u.link(this.learnmore_irl);
			this.learnmore_irl.moved = function(event) {
				u.e.resetEvents(this);
			}
			this.learnmore_irl.clicked = function() {
				window.open(this.url, "_blank");
			}
			this.learnmore_web = u.qs(".learnmore.web", this);
			this.learnmore_web.banner = this;
			u.link(this.learnmore_web);
			this.learnmore_web.moved = function(event) {
				u.e.resetEvents(this);
			}
			this.learnmore_web.clicked = function() {
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

			u.a.transition(this.hint1, "none");
			u.a.translate(this.hint1, this.offsetWidth, 0);
			u.as(this.hint1, "display", "block");

			u.a.transition(this.hint1, "all 0.5s ease-in");
			u.a.setOpacity(this.hint1, 1);

			u.a.transition(this.comp1, "none");
			u.a.translate(this.comp1, this.offsetWidth, 0);
			u.as(this.comp1, "display", "block");
			u.a.setOpacity(this.comp1, 1);

			u.a.transition(this.comp2, "none");
			u.a.translate(this.comp2, this.offsetWidth, 0);
			u.as(this.comp2, "display", "block");
			u.a.setOpacity(this.comp2, 1);

			u.a.transition(this.comp3, "none");
			u.a.translate(this.comp3, this.offsetWidth, 0);
			u.as(this.comp3, "display", "block");
			u.a.setOpacity(this.comp3, 1);


			// u.a.transition(this.logo, "none");
			// u.as(this.logo, "display", "none");
			// u.a.translate(this.logo, this.offsetWidth, 0);
			// u.a.setOpacity(this.logo, 1);

			u.a.transition(this.learnmore_irl, "none");
			u.as(this.learnmore_irl, "display", "none");
			u.a.translate(this.learnmore_irl, this.offsetWidth, 0);
			u.a.setOpacity(this.learnmore_irl, 1);
			u.a.transition(this.learnmore_web, "none");
			u.as(this.learnmore_web, "display", "none");
			u.a.translate(this.learnmore_web, this.offsetWidth, 0);
			u.a.setOpacity(this.learnmore_web, 1);

			// start playback after 1.5 seconds
//			this.t_delay = u.t.setTimer(this, this.sq1, 1500);
			this.preload(85, 80, "sq1", 1500);
		}

		// sequence 1
		// exit h2
		banner.sq1 = function() {
			u.a.transition(this.h2, "all 0.4s ease-in");
			u.a.translate(this.h2, -(this.offsetWidth), 0);

			this.t_delay = u.t.setTimer(this, this.c1enter, 500);

			this.activateComp(this.comp1);
		}

		banner.c1enter = function() {
//			this.updateHeading(this.comp1);

			u.a.transition(this.comp1, "all 0.3s ease-in");
			u.a.translate(this.comp1, 0, 0);

			this.setup(80, 85, "sq2");
		}

		banner.sq2 = function() {
			this.preload(0, 26, "sq3", 1000);
		}

		banner.sq3 = function() {
			this.c1turn1in();
		}


		banner.c1turn1in = function() {
			this.setup(0, 7, "c1turn1out");
		}
		banner.c1turn1out = function() {
			this.setup(7, 0, "c1turn2in");
		}
		banner.c1turn2in = function() {
			this.setup(8, 17, "c1turn2out");
		}
		banner.c1turn2out = function() {
			this.setup(17, 8, "c1exit");
		}
		banner.c1exit = function() {

			u.a.transition(this.comp1, "all 0.3s ease-in");
			u.a.translate(this.comp1, -(this.offsetWidth), 0);

			this.setup(18, 22, "c2enter");

			this.activateComp(this.comp2);
		}


		banner.c2enter = function() {
			u.a.transition(this.comp2, "all 0.3s ease-in");
			u.a.translate(this.comp2, 0, 0);

			this.setup(22, 26, "sq6");
		}

		banner.sq6 = function() {
			this.preload(26, 56, "sq7", 1000);
		}

		banner.sq7 = function() {
			this.c2turn1in();
		}

		banner.c2turn1in = function() {
			this.setup(26, 35, "c2turn1out");
		}
		banner.c2turn1out = function() {
			this.setup(35, 26, "c2turn2in");
		}
		banner.c2turn2in = function() {
			this.setup(36, 44, "c2turn2out");
		}
		banner.c2turn2out = function() {
			this.setup(44, 36, "c2exit");
		}
		banner.c2exit = function() {
			u.a.transition(this.comp2, "all 0.3s ease-in");
			u.a.translate(this.comp2, -(this.offsetWidth), 0);

			this.setup(45, 50, "c3enter");

			this.activateComp(this.comp3);
		}


		banner.c3enter = function() {
			u.a.transition(this.comp3, "all 0.3s ease-in");
			u.a.translate(this.comp3, 0, 0);

			this.setup(50, 56, "sq10");
		}

		banner.sq10 = function() {
			this.preload(56, 80, "sq11", 1000);
		}

		banner.sq11 = function() {
			this.c3turn1in();
		}

		banner.c3turn1in = function() {
			this.setup(56, 64, "c3turn1out");
		}
		banner.c3turn1inWait = function() {
			this.t_delay = u.t.setTimer(this, this.c3turn1out, 400);
		}
		banner.c3turn1out = function() {
			this.setup(64, 56, "c3turn2in");
		}
		banner.c3turn2in = function() {
			this.setup(66, 73, "c3turn2out");
		}
		banner.c3turn2out = function() {
			this.setup(73, 66, "c3exit");
		}

		banner.c3exit = function() {
			u.a.transition(this.comp3, "all 0.3s ease-in");
			u.a.translate(this.comp3, -(this.offsetWidth), 0);

			this.setup(74, 80, "sq14");
		}

		banner.sq14 = function() {
			u.a.transition(this.hint1, "all 0.3s ease-in");
			u.a.translate(this.hint1, 0, 0);

//			this.setup(50, 56, "sq10");
			this.t_delay = u.t.setTimer(this, this.sq15, 1600);
		}

		banner.sq15 = function() {
			u.a.transition(this.hint1, "all 0.3s ease-in");
			u.a.translate(this.hint1, -(this.offsetWidth), 0);

			u.a.transition(this.logo, "all 0.4s ease-in");
			u.a.translate(this.logo, -(this.offsetWidth), 0);

//			this.setup(50, 56, "sq10");
			this.t_delay = u.t.setTimer(this, this.sq16, 500);
		}

		// sequence 8
		// show logo
		banner.sq16 = function() {
//			u.bug("sq8");

			u.a.transition(this.logo, "none");
			u.a.translate(this.logo, this.offsetWidth, 0);
			u.ac(this.logo, "exit");
			u.as(this.logo, "display", "block");
			u.a.transition(this.logo, "all 0.4s ease-in");

			// u.a.transition(this.learnmore, "none");
			// u.a.translate(this.learnmore, this.offsetWidth, 0);
			u.as(this.learnmore_irl, "display", "block");
			u.a.transition(this.learnmore_irl, "all 0.4s ease-in");
			u.as(this.learnmore_web, "display", "block");
			u.a.transition(this.learnmore_web, "all 0.4s ease-in");

			u.a.translate(this.logo, 0, 0);
			u.a.translate(this.learnmore_irl, 0, 0);
			u.a.translate(this.learnmore_web, 0, 0);


//			this.t_delay = u.t.setTimer(this, this.sq9, 1600);
		}


	}
}