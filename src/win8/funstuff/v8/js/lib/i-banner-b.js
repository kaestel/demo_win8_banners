Util.Objects["hwundwinb"] = new function() {
	this.init = function(banner) {

		banner._initialized = true;
		banner._version = "tablet,full";
		banner.t_delay = false;
		banner._isreset = true;
		banner._iscleared = true;

		banner._interaction = false;
		banner.t_interaction = false;
		banner.t_out = false;
		banner._shown = false;

		banner._initcontent = banner.innerHTML;


		// animation frames
		banner._images = new Array();
		for(i = 0; i <= 58; i++) {
			banner._images.push("/funstuff/v8/img/b/LiveTile_V005_intro_0" + ((i > 9 ? i > 99 ? "0" : "00" : "000") + i) + ".jpg");
		}
//		u.bug("last intro:" + (banner._images.length-1));
		for(i = 0; i <= 18; i++) {
			banner._images.push("/funstuff/v8/img/b/Tile_Mail_0" + ((i > 9 ? i > 99 ? "0" : "00" : "000") + i) + ".jpg");
		}
//		u.bug("last mail:" + (banner._images.length-1));
		for(i = 0; i <= 18; i++) {
			banner._images.push("/funstuff/v8/img/b/Tile_PeopleHub_0" + ((i > 9 ? i > 99 ? "0" : "00" : "000") + i) + ".jpg");
		}
//		u.bug("last people:" + (banner._images.length-1));
		for(i = 0; i <= 18; i++) {
			banner._images.push("/funstuff/v8/img/b/LiveTile_Weather_0" + ((i > 9 ? i > 99 ? "0" : "00" : "000") + i) + ".jpg");
		}
//		u.bug("last weather:" + (banner._images.length-1));
		for(i = 0; i <= 18; i++) {
			banner._images.push("/funstuff/v8/img/b/Tile_Foto_0" + ((i > 9 ? i > 99 ? "0" : "00" : "000") + i) + ".jpg");
		}
//		u.bug("last foto:" + (banner._images.length-1));
		for(i = 0; i <= 18; i++) {
			banner._images.push("/funstuff/v8/img/b/Tile_Nyheter_0" + ((i > 9 ? i > 99 ? "0" : "00" : "000") + i) + ".jpg");
		}
//		u.bug("last nyheter:" + (banner._images.length-1));

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
				u.a.setBgPos(this, 0, "50%");
			}

			u.a.transition(this.hint1, "all 1s ease-in-out");
			u.a.setBgPos(this.hint1, 5, "50%");

		}

		banner.updateHeading = function(tile) {
			u.a.transition(this.h2, "none");

			if(tile) {
				this.h2.new_text = tile._h3.innerHTML;
			}
			else {
				this.h2.new_text = this.h2.org_text;
			}

			this.h2.transitioned = function() {
				u.a.transition(this, "none");
				this.transitioned = null;
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

		banner.audioController = function(src, priority) {
//			u.bug("this._interaction:" + this._interaction);
			if(this._interaction) {
//				u.bug("this.audioPlayer.playing:" + this.audioPlayer.playing)
				if(!this.audioPlayer.playing || priority) {
//					u.bug("play:" + src)
					if(typeof(this.audioPlayer.ended) != "function") {
						this.audioPlayer.ended = function() {
							this.ended = null;
//							u.bug("stop sound ani");
							this.banner.mute.soundStopped();
						}
					}

					this.audioPlayer.loadAndPlay(src);

					this.mute.soundPlaying();
				}
			}
		}

		banner.ejectAudio = function() {
			if(this.audioPlayer && this.audioPlayer.parentNode) {
				this.audioPlayer.stop();
				this.audioPlayer.parentNode.removeChild(this.audioPlayer);
			} 
		}

		banner.activateTile = function(tile) {

			tile.banner = this;
			tile._h3 = u.qs("h3", tile);
			tile._id = tile.className.match(/\d/);

			u.a.transition(tile, "none");
			u.a.setOpacity(tile, 0);
			u.as(tile, "display", "block");

			tile.hide = function() {
				this.transitioned = null;
				u.a.transition(this, "none");

				u.rc(this, "show");
				u.a.setOpacity(this, 0);
			}

			tile.fade = function() {
				u.a.transition(this, "none");

				this.transitioned = function() {
					u.a.transition(this, "none");
					this.transitioned = null
					u.rc(this, "show");
				}
				if(u.gcs(this, "opacity") != 0) {
					u.a.transition(this, "all 0.3s ease-in");
					u.a.setOpacity(this, 0);
				}
				else {
					this.transitioned();
				}

				this.t_blink = u.t.setTimer(this, this.blink, 4000);
			}

			tile.blink = function() {
				this.transitioned = null;

				u.a.transition(this, "none");
				u.a.setOpacity(this, 0);
				u.ac(this, "show");

				u.a.transition(this, "all 0.3s ease-in");
				u.a.setOpacity(this, 1);

				this.t_blink = u.t.setTimer(this, this.fade, 500);
			}

			u.e.click(tile);
			tile.clicked = function(event) {
				u.e.kill(event);
				this.banner._interaction = true;

				this.banner.hint1.transitioned = null;
				u.a.transition(this.banner.hint1, "all 0.3s ease-in");
				u.a.translate(this.banner.hint1, this.banner.offsetWidth, 0);

				// u.t.resetTimer(this.banner.t_hint);

				if(this.banner._shown) {

					u.t.resetTimer(this.banner.t_delay);
					this.banner.tileRepeat = null;
					this.banner.tileWaiting = null;
					this.banner.audioPlayer.stop();
					this.banner.tileDone = function() {
						this.tileDone = null;

						this.startTiles();
						this.updateHeading();
					}
					this.banner["sqTile" + this.banner._shown + "out"]();


					this.banner._shown = false;
				}
				else {

					this.banner._shown = this._id;

					this.banner.pauseTiles();
					this.banner.updateHeading(this);

					this.banner.tileRepeat = function() {
						this["sqTile" + this._shown + "repeat"]();
					}

					this.banner.tileWaiting = function() {
						this.t_delay = u.t.setTimer(this, this.tileRepeat, 2000);
					}

					this.banner.audioPlayer.ended = function() {
						this.ended = null;
						u.t.resetTimer(this.banner.t_delay);
						this.banner.tileRepeat = null;
						this.banner.tileWaiting = null;
						this.banner.mute.soundStopped();
//						u.bug("stop sound ani");

						this.banner.tileDone = function() {
							this.tileDone = null;
							this.updateHeading();
							this.startTiles();
							this._shown = false;
						}
						this.banner["sqTile" + this.banner._shown + "out"]();
					}

					this.banner.audioController("/funstuff/v8/audio/tiles_" + this.banner._shown + ".mp3", 1);
					this.banner["sqTile" + this.banner._shown + "in"]();
				}

			}
		}

		banner.pauseTiles = function() {
//			u.bug("pauseTiles");

			this.tile_mail.transitioned = null;
			this.tile_people.transitioned = null;
			this.tile_weather.transitioned = null;
			this.tile_photos.transitioned = null;
			this.tile_news.transitioned = null;

			u.t.resetTimer(this.tile_mail.t_blink);
			u.t.resetTimer(this.tile_people.t_blink);
			u.t.resetTimer(this.tile_weather.t_blink);
			u.t.resetTimer(this.tile_photos.t_blink);
			u.t.resetTimer(this.tile_news.t_blink);

			if(typeof(this.tile_mail.hide) == "function") {
				this.tile_mail.hide();
			}
			if(typeof(this.tile_people.hide) == "function") {
				this.tile_people.hide();
			}
			if(typeof(this.tile_weather.hide) == "function") {
				this.tile_weather.hide();
			}
			if(typeof(this.tile_photos.hide) == "function") {
				this.tile_photos.hide();
			}
			if(typeof(this.tile_news.hide) == "function") {
				this.tile_news.hide();
			}
		}
		banner.startTiles = function() {
//			u.bug("startTiles");

			// how to loop, with delay?
			this.tile_mail.t_blink = u.t.setTimer(this.tile_mail, this.tile_mail.blink, 200);
			this.tile_people.t_blink = u.t.setTimer(this.tile_people, this.tile_people.blink, 700);
			this.tile_weather.t_blink = u.t.setTimer(this.tile_weather, this.tile_weather.blink, 1200);
			this.tile_photos.t_blink = u.t.setTimer(this.tile_photos, this.tile_photos.blink, 1700);
			this.tile_news.t_blink = u.t.setTimer(this.tile_news, this.tile_news.blink, 2200);
		}



		// banner resat, update state
		banner.cleared = function() {

			this.innerHTML = this._initcontent;

		}

		// banner is ready - start loop here
		banner.ready = function(play) {
//			u.bug("ready b")

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

			this.tile_mail = u.qs(".tile.mail", this);
			this.tile_mail.banner = this;
			this.tile_people = u.qs(".tile.people", this);
			this.tile_people.banner = this;
			this.tile_weather = u.qs(".tile.weather", this);
			this.tile_weather.banner = this;
			this.tile_photos = u.qs(".tile.photos", this);
			this.tile_photos.banner = this;
			this.tile_news = u.qs(".tile.news", this);
			this.tile_news.banner = this;

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


			u.a.transition(this.hint1, "none");
			u.a.translate(this.hint1, this.offsetWidth, 0);
			u.as(this.hint1, "display", "block");
			u.a.setOpacity(this.hint1, 1);


			// 
			if(!this._interaction && u.e.event_pref == "mouse") {
				this.onmouseover = function() {
					if(!this._interaction && !this._hover_time) {
						this._hover_time = new Date().getTime();
						u.t.resetTimer(this.t_interaction);
						this.t_interaction = u.t.setTimer(this, this.interacted, 1000);
					}
					else if(this._interaction && this.audioPlayer && !this.audioPlayer.playing) {
						this.audioController("/funstuff/v8/audio/tiles_intro.mp3")
					}
//					u.bug("over");
					u.t.resetTimer(this.t_out);
				}
				this.onmouseout = function() {
					this.t_out = u.t.setTimer(this, this.actualOut, 100);

//					u.bug("out");
				}
				this.actualOut = function() {
//					u.bug("hover time:" + (new Date().getTime() - this._hover_time));
					if(this._interaction) {
						
						this.mute.soundStopped();
						this.audioPlayer.stop();
						if(this._shown) {

							u.t.resetTimer(this.t_delay);
							this.tileRepeat = null;
							this.tileWaiting = null;

							this.tileDone = function() {
								this.tileDone = null;
								this.updateHeading();
								this.startTiles();
								this._shown = false;
							}
							this["sqTile" + this._shown + "out"]();
						}
					}
					else {
						u.t.resetTimer(this.t_interaction);
						this._hover_time = false;
					}
				}
				this.interacted = function() {
					if(this._hover_time && (new Date().getTime() - this._hover_time) > 1000) {
						this._interaction = true;

//						u.bug("interaction")
						this.audioController("/funstuff/v8/audio/tiles_intro.mp3");

						u.t.resetTimer(this.t_interaction);
						u.t.resetTimer(this.t_out);
//						this.onmouseover = null;
//						this.onmouseout = null;
					}
				}
			}

			// this.idle = function() {
			// 	
			// }
			// this.t_idle = u.t.setTimer(this, this.idle, 4000);

			this.audioPlayer = u.audioPlayer(this);
			this.audioPlayer.banner = this;


			this.easter_1 = u.ae(this, "div", {"class":"easter easter_1"});
			this.easter_1.banner = this;
			this.easter_2 = u.ae(this, "div", {"class":"easter easter_2"});
			this.easter_2.banner = this;

			this.touchscreen = u.ae(this, "div", {"class":"easter touchscreen"});
			this.touchscreen.banner = this;

			u.e.click(this.touchscreen);
			this.touchscreen.moved = function(event) {
				u.e.resetEvents(this);
			}
			this.touchscreen.clicked = function(event) {
				var tiles = u.qsa(".tile", this.banner);
				var random_tile = Math.floor(Math.random()*5);
				tiles[random_tile].clicked(event);
			}

			u.e.click(this.easter_1);
			this.easter_1.moved = function(event) {
				u.e.resetEvents(this);
			}
			this.easter_1.clicked = function(event) {
				if(this.banner._shown) {
					this.banner.tile_mail.clicked(event);
				}
				else {
					this.banner.audioController("/funstuff/v8/audio/tiles_easter_"+ (Math.random() > 0.5 ? "1" : "2") +".mp3", 1);
				}
//				u.bug("clicked bubbled")
//				this.clicked = null;
			}
			u.e.click(this.easter_2);
			this.easter_2.moved = function(event) {
				u.e.resetEvents(this);
			}
			this.easter_2.clicked = function(event) {
				if(this.banner._shown) {
					this.banner.tile_mail.clicked(event);
				}
				else {
					this.banner.audioController("/funstuff/v8/audio/tiles_easter_3.mp3", 1);
				}
//				u.bug("clicked bubbled")
//				this.clicked = null;
			}

			this.mute = u.ae(this, "div", {"class":"mute"});
			this.mute.banner = this;
			
			this.mute.fadeDown = function() {
				u.a.transition(this, "none");

				u.a.transition(this, "all 1s ease-in-out");
				u.a.setOpacity(this, 0.5);

				if(this.playback) {
					this.t_sound = u.t.setTimer(this, this.fadeUp, 1000);
				}
			}
			
			this.mute.fadeUp = function() {
				u.a.transition(this, "none");

				u.a.transition(this, "all 1s ease-in-out");
				u.a.setOpacity(this, 0.8);

				if(this.playback) {
					this.t_sound = u.t.setTimer(this, this.fadeDown, 1000);
				}
			}

			
			this.mute.soundPlaying = function() {

//				u.bug("start sound ani:" + this.playback)

				if(!this.playback && !this.muted) {
					this.playback = true;
					this.fadeDown();
				}
			}

			this.mute.soundStopped = function() {
//				u.bug("stop sound ani:" + this.playback);

				this.playback = false;
				u.t.resetTimer(this.t_sound);

				u.a.transition(this, "all 0.2s ease-in-out");
				u.a.setOpacity(this, 1);
			}



			u.e.click(this.mute);
			this.mute.clicked = function() {
				u.a.transition(this, "none");
				if(!this.muted) {
					this.banner.audioPlayer.audio.volume = 0;
					u.ac(this, "muted");
					this.muted = true;
					this.soundStopped();
				}
				else {
					this.banner.audioPlayer.audio.volume = 1;
					this.muted = false;
					u.rc(this, "muted");
					if(this.banner.audioPlayer.playing) {
						this.soundPlaying();
					}
				}
//				alert("clicked mute");
			}

			
			// start playback after 1.5 seconds
//			this.t_delay = u.t.setTimer(this, this.sq1, 1500);
//			this.sq1();
			this.preload(0, 58, "sq1", 1500);

		}

		// start intro animation
		banner.sq1 = function() {
//			u.bug("sq1");

			u.a.transition(this.animation, "none");
			u.a.setOpacity(this.animation, 1);
			this.setup(0, 58, "sq2");
//			this.setup(58, 58, "sq2");

//			u.e.removeEvent(this, "mouseover", this.started);
		}


		// show tiles
		banner.sq2 = function() {
//			u.bug("sq2");

			u.a.transition(this.hint1, "all 0.4s ease-in");
			u.a.translate(this.hint1, 0, 0);
			this.hoverHint();

			this.activateTile(this.tile_mail);

			this.t_delay = u.t.setTimer(this, this.sq3, 300);

		}

		banner.sq3 = function() {
//			u.bug("sq3");

			this.activateTile(this.tile_people);

			this.t_delay = u.t.setTimer(this, this.sq4, 300);
		}

		banner.sq4 = function() {
//			u.bug("sq4");

			this.activateTile(this.tile_weather);

			this.t_delay = u.t.setTimer(this, this.sq5, 300);
		}

		banner.sq5 = function() {
//			u.bug("sq5");

			this.activateTile(this.tile_photos);

			this.t_delay = u.t.setTimer(this, this.sq6, 300);
		}

		banner.sq6 = function() {
//			u.bug("sq6");

			this.activateTile(this.tile_news);

			this.startTiles();
			u.ac(this, "noloader");
			this.preload(58, 153);
		}


		banner.sqTile1in = function() {
			this.setup(59, 77, "tileWaiting");
		}
		banner.sqTile1repeat = function() {
			if(this._current_frame == 77) {
				this.setup(77, 72, "tileWaiting");
			}
			else {
				this.setup(72, 77, "tileWaiting");
			}
		}
		banner.sqTile1out = function() {
			this.setup(67, 59, "tileDone");
		}

		banner.sqTile2in = function() {
			this.setup(78, 96, "tileWaiting");
		}
		banner.sqTile2repeat = function() {
			if(this._current_frame == 96) {
				this.setup(96, 91, "tileWaiting");
			}
			else {
				this.setup(91, 96, "tileWaiting");
			}
		}
		banner.sqTile2out = function() {
			this.setup(86, 78, "tileDone");
		}

		banner.sqTile3in = function() {
			this.setup(97, 115, "tileWaiting");
		}
		banner.sqTile3repeat = function() {
			if(this._current_frame == 115) {
				this.setup(115, 110, "tileWaiting");
			}
			else {
				this.setup(110, 115, "tileWaiting");
			}
		}
		banner.sqTile3out = function() {
			this.setup(105, 97, "tileDone");
		}

		banner.sqTile4in = function() {
			this.setup(116, 134, "tileWaiting");
		}
		banner.sqTile4repeat = function() {
			if(this._current_frame == 134) {
				this.setup(134, 129, "tileWaiting");
			}
			else {
				this.setup(129, 134, "tileWaiting");
			}
		}
		banner.sqTile4out = function() {
			this.setup(124, 116, "tileDone");
		}

		banner.sqTile5in = function() {
			this.setup(135, 153, "tileWaiting");
		}
		banner.sqTile5repeat = function() {
			if(this._current_frame == 153) {
				this.setup(153, 148, "tileWaiting");
			}
			else {
				this.setup(148, 153, "tileWaiting");
			}
		}
		banner.sqTile5out = function() {
			this.setup(143, 135, "tileDone");
		}


	}
}