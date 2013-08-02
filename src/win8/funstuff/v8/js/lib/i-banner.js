Util.Objects["banner"] = new function() {
	this.init = function(banner) {

		banner.animation = u.ae(banner, "ul", {"class":"animation"});
		banner.animation.banner = banner;
		banner.nodes = new Array();

		// index all frames
		var i, node;
		for(i = 0; i < banner._images.length; i++) {

			node = u.ae(banner.animation, "li");
			node.banner = banner;
			node.i = i;
			banner.nodes[i] = node;
			node._initialized = false;

			// load images and set ready-state when all elements have been loaded
			// node.loaded = function(event) {
			// 	u.as(this, "backgroundImage", "url("+event.target.src+")");
			// 	u.ac(this, "ready");
			// 
			// 	this.banner._ready();
			// }
			// u.i.load(node, banner._images[i]);
		}

		banner.t_playback = false;
		banner.t_loader = false;
		banner.t_loadeddelay = false;

		banner._loadingprocess = function() {
//			u.bug("loading")
			if(!this._isloading) {
				var preloader = u.ae(this, "div", {"class":"preloader", "html":"3D elements rendering"});
//				u.bug("made loader")
				u.a.transition(preloader, "all 0.2s ease-in");
				u.a.setOpacity(preloader, 1);

				this._isloading = true;
			}

		}
		banner._loading = function() {
			u.t.resetTimer(this.t_loader);

			this.t_loader = u.t.setTimer(this, this._loadingprocess, 300);
		}

		banner._loaded = function() {
			u.t.resetTimer(this.t_loader);
			
//			if(this._isloading) {
//				u.bug("done loading");

				var preloader = u.qs(".preloader", this);
				if(preloader) {

//					u.bug("remove loader")

					preloader.transitioned = function() {
						this.transitioned = null;
						if(this.parentNode) {
							this.parentNode.removeChild(this);
						}
					}
					if(u.gcs(preloader, "opacity") != 0) {
						u.a.transition(preloader, "all 0.2s ease-in");
						u.a.setOpacity(preloader, 0);
					}
					else {
						preloader.transitioned();
					}

				}

				this._isloading = false;
				
//			}
			
		}


		banner.preload = function(start_frame, end_frame, callback, callback_min_delay) {

			this._preload_start_time = new Date().getTime();


			// next step
			if(callback) {
				this.preloader_callback = callback;
			}
			else {
				this.preloader_callback = false;
			}

			// delay on callback - so preloader also can be timer
			if(callback_min_delay) {
				this.t_loader = u.t.setTimer(this, this._loading, callback_min_delay);
				this.preloader_callback_min_delay = callback_min_delay;
			}
			else {
				this._loading();
				this.preloader_callback_min_delay = 0;
			}

			// correct values if end_frame is smaller than start_frame
			if(end_frame <= start_frame) {
				var _frame = start_frame;
				start_frame = end_frame;
				end_frame = _frame
			}


			// stack images in correct order, to make playback as light as possible
			for(i = start_frame; i <= end_frame; i++) {

				this.preload_queue.push(i);
			}

			this.queueLoader();
		}

		banner.queueLoader = function() {

//			u.bug("queueLoader:" + this.preload_processes);

			// still items in queue
			if(this.preload_queue.length) {

				while(this.preload_processes < 5 && this.preload_queue.length) {
					
					this.preload_processes++;

					var next = this.preload_queue.shift();
					if(!this.nodes[next]) {
//						u.bug("trying to load unknown frame:" + next);
					}
//					u.bug("load next:" + next);

					if(!this.nodes[next]._initialized) {

						this.nodes[next]._initialized = true;
						this.nodes[next].loaded = function(event) {
							u.as(this, "backgroundImage", "url("+event.target.src+")", 1);
							u.ac(this, "ready");

							this.banner.preload_processes--;
							if(!this.banner._isreset) {
								this.banner.queueLoader();
							}
						}
						u.i.load(this.nodes[next], banner._images[next]);

					}
					else {
						this.preload_processes--;
						if(!this._isreset) {
							this.queueLoader();
						}
					}
					
				}

			}

			// preloader queue empty
			else if(this.preload_processes == 0) {

				this._loaded();

//				this._loading = false;
				var end_time = new Date().getTime();
				
				if((end_time - this._preload_start_time) > this.preloader_callback_min_delay && !this._isreset) {
//					u.bug("callback to:" + this.preloader_callback);
					if(typeof(this[this.preloader_callback]) == "function") {
						this[this.preloader_callback]();
					}
				}
				else if(!this._isreset){
//					u.bug("delay callback:" + (this.preloader_callback_min_delay - (end_time - this._preload_start_time)))
					this.t_loadeddelay = u.t.setTimer(this, this.queueLoader, this.preloader_callback_min_delay - (end_time - this._preload_start_time));
				}
				
			}

		}

		banner.preload_queue = new Array();
		banner.preload_processes = 0;
		

		banner._cleared = function() {


			// set everything for new start
			u.a.transition(this.animation, "none");
			this.resetAnimation();
			u.a.setOpacity(this.animation, 1);


			if(typeof(this.cleared) == "function") {
				this.cleared();
			}

			
			this._iscleared = true;

			// set new state if available and not already set
			if(this.state && !u.hc(this, this.state)) {
				u.rc(this, "full|tablet|mobile", 1);
				u.ac(this, this.state);
			}
			else if(this._autoplay) {

				this.ready(this._autoplay);
				
			}
		}

		banner._reset = function(state) {


//			u.bug("reset");

			this._autoplay = false;

			if(state) {
				this.state = state;
			}

			// start reset process
			if(!this._isreset) {
				this._isreset = true;
//				u.bug("resetting")


				document.body.transitioned = function() {
					u.a.transition(this, "none");
					this.transitioned = null;
				}

				u.a.transition(document.body, "all 0.3s ease-in");
				u.as(document.body, "backgroundColor", u.qs(".hw_banner_controller")._bg_color);


				// stop any playback
				this.stopAnimation();
				u.t.resetTimer(this.t_delay);
				u.t.resetTimer(this.t_loadeddelay);

				this._loaded();


				// remove content
				// if(this.prerollclick && this.prerollclick.parentNode) {
				// 	this.removeChild(this.prerollclick);
				// }

//				var nodes = u.qsa("*", this);
				var i, node;
				for(i = 0; node = this.childNodes[i]; i++) {
					if(node && node.nodeType != 3 && node.nodeType != 8) {
						u.a.transition(node, "all 0.3s ease-in");
						u.a.setOpacity(node, 0);
					}
				}

				// u.a.transition(this.animation, "all 0.3s ease-in");
				// u.a.setOpacity(this.animation, 0);
				// 
				// u.a.transition(this.h2, "all 0.3s ease-in");
				// u.a.setOpacity(this.h2, 0);
				// 
				// u.a.transition(this.h3, "all 0.3s ease-in");
				// u.a.setOpacity(this.h3, 0);
				// 
				// u.a.transition(this.logo, "all 0.3s ease-in");
				// u.a.setOpacity(this.logo, 0);
				// 
				// u.a.transition(this.learnmore, "all 0.3s ease-in");
				// u.a.setOpacity(this.learnmore, 0);


				// finalize reset process
				u.t.setTimer(this, this._cleared, 300);

			}
			// reset process has ended, state can be updated safely
			else if(this._iscleared){
				if(state && !u.hc(this, state)) {
					u.rc(this, "full|tablet|mobile", 1);
					u.ac(this, state);
				}
			}
		}


		banner.resetAnimation = function(keep_node) {
//			u.bug("banner.resetAnimation");
			var node;
			this.stopAnimation();
			// hide all frames (but keep optional Node keep_node)
			for(i = 0; node = this.nodes[i]; i++) {
				if(!keep_node || node != keep_node) {
					u.as(node, "display", "none", 1);
				}
			}
			// update dom
			this.offsetHeight;
		}

		// stop playback
		banner.stopAnimation = function() {
			u.t.resetTimer(this.t_playback);
		}

		// prepare animation for playback
		banner.setup = function(start, end, callback) {
//			u.bug("setup")



			// clean up scene before starting animation
//			this.removeLinks();

			this.animation._start = Math.floor(start);
			this.animation._end = Math.floor(end);

			// next step
			if(callback) {
				this.animation._callback = callback;
			}
			else {
				this.animation._callback = false;
			}


			// after preloading, continue setuo
			this._setup = function() {

				// reset animation, but keep new startframe
				this.resetAnimation(this.nodes[this.animation._start]);


				// animation direction
				if(start <= end) {
					this.animation._direction = 1;
				}
				else {
					this.animation._direction = -1;
				}

				// stack images in correct order, to make playback as light as possible
				for(i = this.animation._start, j = 2000; (this.animation._direction < 0 ? i >= this.animation._end : i <= this.animation._end); i += this.animation._direction, j--) {

	// 				if(!this.nodes[i]._initialized) {
	// 					this.preload_queue.push(i);
	// 
	// //					this.nodeSetup(this.nodes[i]);
	// 				}


	//				u.bug("i:" + i);

					// only display current frame (to improve performance)
					u.as(this.nodes[i], "zIndex", j);
					if(j < 1999) {
	//				if(i > this.animation._start) {
						u.as(this.nodes[i], "display", "none", 1);
					}
					else {
						u.as(this.nodes[i], "display", "block", 1);
					}
				}

				// update dom
				this.offsetHeight;

				// if(this.preload_queue.length) {
				// 	this.queueLoader();
				// }

				this._current_frame = this.animation._start;

				this.play(true);
			}

			this.preload(this.animation._start, this.animation._end, "_setup");

//			u.bug("trans2:" + this.animation._start + "::" + this.animation._end);


		}


		// play animation
		banner.play = function(start) {
//			u.bug("play:" + this._framerate)

			// don't do anything on first loop
			if(!start) {
				// go to next frame
				this.nextFrame(this._current_frame);
				// set current frame
				this._current_frame = this._current_frame + this.animation._direction;
			}

//			u.bug("current_frame:" + this._current_frame);

			// end loop and callback
			if(this.animation._end == this._current_frame) {

				if(typeof(this[this.animation._callback]) == "function") {
					this[this.animation._callback]();
				}
			}
			// continue loop
			else {
				this.t_playback = u.t.setTimer(this, this.play, this._framerate);
			}
		}



		// hides last frame and reveals next frame below
		banner.nextFrame = function(frame) {
//			u.bug("nextframe")

			// prepare stack - afterNext is not next frame, but frame after next frame (to be sure stack is always prepared two frame ahead)
			// this is done, because firefox causes blinking animation, if animation is started with delay
			var afterNext = (this._current_frame + (this.animation._direction*2))
			// make next frame visible
			if(this.nodes[afterNext] && (this.animation._direction > 0 ? afterNext <= this.animation._end : afterNext >= this.animation._end)) {

//				u.bug("show next:" + )
				u.as(this.nodes[afterNext], "display", "block");
			}

			// hide current frame
			if(this.nodes[frame]) {
//				u.bug("hide current:" + frame)
				u.as(this.nodes[frame], "display", "none");
			}
			// else {
			// 	u.bug("FRAME:" + frame + " ("+u.nodeId(this)+"):" + this.animation._start + "::" + this.animation._end + ":" + this.animation._callback)
			// }
		}


		// ready to start playback
//		banner._ready = function() {
//			u.bug("_ready:" + u.qsa(".animation li", this).length + "==" +  u.qsa(".animation li.ready", this).length)
			// everything is loaded
//			if(u.qsa(".animation li", this).length == u.qsa(".animation li.ready", this).length) {
//				this._loaded = true;

//				u.bug("ready:" + u.nodeId(this))
				// start playback cycle
//				this.ready();
//			}
//		}


//		banner._ready();

	}
}