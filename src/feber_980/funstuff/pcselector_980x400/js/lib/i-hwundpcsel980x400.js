Util.Objects["hwundpcsel980x400"] = new function() {
	this.init = function(banner) {

		banner._initialized = true;
		banner._version = "tablet,full";
		banner.t_delay = false;
		banner._isreset = true;
		banner._iscleared = true;
		banner.selected_comp = false;

		banner._initcontent = banner.innerHTML;


		// animation frames
		banner._images = new Array();
		for(i = 0; i <= 205; i++) {
			banner._images.push("/funstuff/pcselector_980x400/img/sequence/PcSelector_980x400_0" + ((i > 9 ? i > 99 ? "0" : "00" : "000") + i) + ".jpg");
		}
		banner._framerate = 1000/16; // 12 frames a second




		banner.updateHeading = function(comp) {
			u.a.transition(this.h2, "none");

			if(comp) {
				this.h2.new_text = comp._h2.innerHTML;
			}
			else {
				this.h2.new_text = this.h2.org_text;
			}

			this.h2.transitioned = function() {
				this.transitioned = null;
				u.a.transition(this, "none");

				this.innerHTML = this.new_text;

				u.a.transition(this, "all 0.3s ease-in");
				u.a.translate(this, 0, 0);
			}

			if(this.h2.element_x != -this.offsetWidth) {
				u.a.transition(this.h2, "all 0.3s ease-in");
				u.a.translate(this.h2, -this.offsetWidth, 0);
			}
			else {
				this.h2.transitioned();
			}

		}

		banner.changeState = function(turn) {

			this.selected_comp._new_state = turn;

			this.selected_comp.specsHidden = function() {
				this.specsHidden = null;


	//			u.bug("comp:" + this._id + ":" + u.hc(this, "turn[1-9]"));

				if(u.hc(this, "turn[1-9]")) {
					var old_state = this.className.match(/turn(\d)/)[1];

					this.banner.compTurned = function() {
						this.compTurned = null;

						u.rc(this.selected_comp, "turn[0-9]");

						if(this.selected_comp._new_state) {
	//						u.bug("and then turn in to:" + this.selected_comp._new_state)
							this.compTurned = function() {
								this.compTurned = null;
								this.selected_comp.showSpecs();
							}

							u.ac(this.selected_comp, "turn" + this.selected_comp._new_state);
							this["c" + this.selected_comp._id + "turn"  + this.selected_comp._new_state + "in"]();
						}
						else {
							this.selected_comp.showSpecs();
						}
					}

	//				u.bug("turn back first");
	//				u.bug("turn back to base: " + "c" + this.banner.selected_comp._id + "turn"  + old_state + "out")
					this.banner["c" + this.banner.selected_comp._id + "turn"  + old_state + "out"]();
				}
				else {
					this.banner.compTurned = function() {
						this.compTurned = null;

						this.selected_comp.showSpecs();
					}

					u.ac(this.banner.selected_comp, "turn" + this.banner.selected_comp._new_state);

	//				u.bug("turn to: " + "c" + this.banner.selected_comp._id + "turn"  + this.banner.selected_comp._new_state + "in")
					this.banner["c" + this.banner.selected_comp._id + "turn"  + this.banner.selected_comp._new_state + "in"]();
				}
			}
			this.selected_comp.hideSpecs();
		}

		banner.selectComp = function(index) {
	//		u.bug("selectComp:" + index);

			// correct index
			if(index < 1) {
				index = 3;
			}
			else if(index > 3) {
				index = 1;
			}
	//		u.bug("selectComp, corrected:" + index);


			if(!this.selected_comp) {

				this.selected_index = index;
				this.selected_comp = this["comp"+index];

				this.updateHeading(this.selected_comp);
				this.selected_comp.showSpecs();

				// remove old comp, then enter new comp
			}
			else {

				this.org_comp = this.selected_comp;
				this.org_comp.hideSpecs();

				this.selected_index = index;
				this.selected_comp = this["comp"+index];


				this.compTurned = function() {
					this.compTurned = null;

					u.rc(this.org_comp, "turn[0-9]");

					this.compChanged = function() {
						this.compChanged = null;

						this.selected_comp.showSpecs();
					}
					this["c"+this.org_comp._id+"exit_c"+this.selected_comp._id+"enter"]();
					this.updateHeading(this.selected_comp);
				}

				if(u.hc(this.org_comp, "turn[1-9]")) {
					var turn = this.org_comp.className.match(/turn(\d)/)[1];
					this["c"+this.org_comp._id+"turn"+turn+"out"]();

	//				u.bug("change state:" + "c"+this.org_comp._id+"turn"+turn+"out")
				}
				else {
					this.compTurned();
				}


			}
		}


		banner.activateSpec = function(spec) {

			spec._id = spec.className.match(/\d/);
			spec.banner = this;
			spec.spot = u.qs(".spot", spec);
			spec.spot.spec = spec;

			spec.fadeUp = function() {
				u.a.transition(this.spot, "none");

				this.spot.transitioned = function() {
					this.spec.fadeDown();
				}

				if(u.gcs(this.spot, "opacity") != .8) {
					u.a.transition(this.spot, "all 1s ease-in-out");
					u.a.setOpacity(this.spot, .8);
				}
				else {
					this.spot.transitioned();
				}

			}

			spec.fadeDown = function() {
				u.a.transition(this.spot, "none");

				this.spot.transitioned = function() {
					this.spec.fadeUp();
				}

				if(u.gcs(this.spot, "opacity") != .3) {
					u.a.transition(this.spot, "all 1s ease-in-out");
					u.a.setOpacity(this.spot, .3);
				}
				else {
					this.spot.transitioned();
				}

			}

			spec.pause = function() {
				u.a.transition(this, "none");
				this.transitioned = null;
			}

			spec.pulse = function() {
				this.fadeUp();
			}

			u.e.click(spec);

			spec.clicked = function() {
				if(u.hc(this.comp, "turn" + this._id)) {
					this.banner.changeState(0);
				}
				else {
					this.banner.changeState(this._id);
				}
			}
		}

		banner.activateComp = function(comp) {

			u.as(comp, "display", "none");

			comp.banner = this;
			comp._id = comp.className.match(/\d/);
	//		u.bug("id:" + comp._id);
			comp._h2 = u.qs("h4", comp);

			comp.spec1 = u.qs(".hotspot1", comp);
			comp.spec1.comp = comp;

			comp.spec2 = u.qs(".hotspot2", comp);
			comp.spec2.comp = comp;

			this.activateSpec(comp.spec1);
			this.activateSpec(comp.spec2);

			// u.e.click(comp.spec1);
			// u.e.click(comp.spec2);
			// // u.e.click(comp.spec3);
			// 
			// comp.spec1.clicked = function() {
			// 	if(u.hc(this.comp, "turn1")) {
			// 		this.banner.changeState(0);
			// 	}
			// 	else {
			// 		this.banner.changeState(1);
			// 	}
			// }
			// comp.spec2.clicked = function() {
			// 	if(u.hc(this.comp, "turn2")) {
			// 		this.banner.changeState(0);
			// 	}
			// 	else {
			// 		this.banner.changeState(2);
			// 	}
			// }

			comp.showSpecs = function() {
	//			u.a.setOpacity(this, 0);
	//			u.bug("show specs:" + this.className)
				u.a.transition(this, "none");
				u.as(this, "display", "block");

				this.spec1.pulse();
				this.spec2.pulse();

				u.a.transition(this, "all 0.3s ease-in");
				u.a.setOpacity(this, 1);
			}
			comp.hideSpecs = function() {

				this.spec1.pause();
				this.spec2.pause();

	//			u.bug("hide specs:" + this.className)
				this.transitioned = function() {
	//				u.bug("specs hidden:" + this.className)
					this.transitioned = null;
					u.a.transition(this, "none");
					u.as(this, "display", "none");
					if(typeof(this.specsHidden) == "function") {
						this.specsHidden();
					}
				}
				if(u.gcs(this, "opacity") != 0) {
					u.a.transition(this, "all 0.2s ease-in");
					u.a.setOpacity(this, 0);
				}
				else {
					this.transitioned();
				}

			}


		}



		// banner resat, update state
		banner.cleared = function() {

			this.selected_comp = false;

			this.innerHTML = this._initcontent;

		}



		// banner is ready - start loop here
		banner.ready = function(play) {

			// document.body.transitioned = function() {
			// 	u.a.transition(this, "none");
			// 	this.transitioned = null;
			// }

//			u.a.transition(document.body, "all 0.3s ease-in");
//			u.as(document.body, "backgroundColor", u.gcs(this, "background-color"));

			this._autoplay = play;

			this._isreset = false;
			this._iscleared = false;



			// setup banner
			u.o.banner.init(this);


			// banner content
			this.h2 = u.qs("h2", this);
			this.h2.banner = this;
			this.h2.org_text = this.h2.innerHTML;

			this.comp1 = u.qs(".comp.comp1", this);
			this.comp2 = u.qs(".comp.comp2", this);
			this.comp3 = u.qs(".comp.comp3", this);


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

			// start playback after 1.5 seconds
//			this.t_delay = u.t.setTimer(this, this.sq1, 1500);

			this.preload(0, 124, "sq1", 1500);

//			this.sq2();
		}


		// sequence 1
		// move h2 and play intro
		banner.sq1 = function() {
//			u.bug("sq1");

			u.a.transition(this.h2, "all 0.3s ease-in");
			u.a.translate(this.h2, -this.offsetWidth, 0);

			this.setup(0, 124, "sq2");

		}

		// sequence 2
		// activate comps, select first computer and preload selector sequence
		banner.sq2 = function() {
//			u.bug("sq2");

			this.activateComp(this.comp1);
			this.activateComp(this.comp2);
			this.activateComp(this.comp3);

			this.preload(125, 205, "sq3");

//			this.setup(124, 124, "sq3");
//			this.t_delay = u.t.setTimer(this, this.sq3, 300);
		}

		// sequence 3
		// play second part of intro
		banner.sq3 = function() {
//			u.bug("sq3");

			this.selectComp(1);


			this.showPrev = u.ae(this, "div", {"class":"show_prev"});
			this.showPrev.banner = this;
			u.a.setOpacity(this.showPrev, 0);
			u.as(this.showPrev, "display", "block");

			u.a.transition(this.showPrev, "all 0.5s ease-in");
			u.a.setOpacity(this.showPrev, 1);


			this.showNext = u.ae(this, "div", {"class":"show_next"});
			this.showNext.banner = this;
			u.a.setOpacity(this.showNext, 0);
			u.as(this.showNext, "display", "block");

			u.a.transition(this.showNext, "all 0.5s ease-in");
			u.a.setOpacity(this.showNext, 1);

			u.e.click(this.showPrev);
			this.showPrev.clicked = function() {
				this.banner.selectComp(this.banner.selected_index-1);
			}

			u.e.click(this.showNext);
			this.showNext.clicked = function() {
				this.banner.selectComp(this.banner.selected_index+1);
			}
		}



		banner.c1exit_c2enter = function() {
			this.setup(143, 149, "compChanged");
		}
		banner.c2exit_c1enter = function() {
			this.setup(149, 143, "compChanged");
		}

		banner.c1exit_c3enter = function() {
			this.setup(205, 196, "compChanged");
		}
		banner.c3exit_c1enter = function() {
			this.setup(196, 205, "compChanged");
		}

		banner.c2exit_c3enter = function() {
			this.setup(168, 178, "compChanged");
		}
		banner.c3exit_c2enter = function() {
			this.setup(178, 168, "compChanged");
		}


		banner.c1turn1in = function() {
			this.setup(125, 132, "compTurned");
		}
		banner.c1turn1out = function() {
			this.setup(132, 125, "compTurned");
		}
		banner.c1turn2in = function() {
			this.setup(133, 142, "compTurned");
		}
		banner.c1turn2out = function() {
			this.setup(142, 133, "compTurned");
		}


		banner.c2turn1in = function() {
			this.setup(149, 158, "compTurned");
		}
		banner.c2turn1out = function() {
			this.setup(158, 149, "compTurned");
		}
		banner.c2turn2in = function() {
			this.setup(159, 167, "compTurned");
		}
		banner.c2turn2out = function() {
			this.setup(167, 159, "compTurned");
		}

		banner.c3turn1in = function() {
			this.setup(178, 186, "compTurned");
		}
		banner.c3turn1out = function() {
			this.setup(186, 178, "compTurned");
		}
		banner.c3turn2in = function() {
			this.setup(188, 195, "compTurned");
		}
		banner.c3turn2out = function() {
			this.setup(195, 188, "compTurned");
		}


		banner.ready(true);

	}
}