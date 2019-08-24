"use strict";
var level2 = function(game){

	this.ss;
	this.box;
	this.buttonSoundClick
	this.global_sfx_win;

	//configurable from dom
	this.gametime = window.gameTime;

};

level2.prototype = {
  	create: function(){
  		console.log("theGame create():::::::::::::");
  		console.log("Var from DOM gameTime:" + this.gametime);

  		//audio
		this.GateGame_GatePlacement = this.game.add.audio('GateGame_GatePlacement');
		this.GateGame_LevelUp = this.game.add.audio('GateGame_LevelUp');
		this.GateGame_SpotterPlacement = this.game.add.audio('GateGame_SpotterPlacement');
		this.GateGameTheme = this.game.add.audio('GateGameTheme');
		this.GateGate_TryAgain = this.game.add.audio('GateGate_TryAgain');

		if(this.game.global.soundtrackAudio){
			this.GateGameSoundtrack = this.game.add.audio('GateGameSoundtrack');
			this.GateGameSoundtrack.loop = true;
		}
		if(this.game.global.soundtrackAudio){
			this.soundtrackAudio();
		}
		
		
		//temp comp
		//this.ss = this.game.add.sprite(0, 0, 'comp2');
		//this.ss.alpha = 0;
	

		//game vars
		this.game.global.numberOfTriesLevel2 = 0;
		this.TimeMinutes = 10000;
  		this.TimeSeconds = 0;
		this.timer = this.game.time.create();
	    this.timerEvent = this.timer.add(Phaser.Timer.MINUTE * this.TimeMinutes + Phaser.Timer.SECOND * this.TimeSeconds, this.endTimer, this);
	    
		

		this.gateDragging = false;
		this.spotterDragging = false;

		this.gateCount = 0;
		this.spotterCount = 0;
		this.gatesNeeded = 6;
		this.spottersNeeded = 1;

		this.l2gate_a_active = true;
		this.l2gate_b_active = true;
		this.l2gate_c_active = true;
		this.l2gate_d_active = true;
		this.l2gate_e_active = true;
		this.l2gate_f_active = true;

		this.l2spotter_a_active = true;
		this.l2spotter_b_active = true;
		this.l2spotter_c_active = true;

  		this.createUi();
  		this.forkliftMove();
	},

    createUi: function(){
    	
    	//creates the hit areas for gates and spotters
		this.createLevel2HitAreas();

		//places the isles, gates, and spotters
    	this.createLevel2();

    	//temp button
    	this.start = this.game.add.sprite(800, 430, 'calldomBtn');
		this.start.anchor.setTo(0.5, 0.5);
		this.start.inputEnabled = true;
		this.start.input.pixelPerfectOver = true;
		this.start.input.useHandCursor = true;
		this.start.events.onInputUp.add(this.pressStart, this);
		this.start.events.onInputOver.add(this.overStart, this);
		this.start.events.onInputOut.add(this.outStart, this);
		this.start.visible = false;

		//white cover on right
		this.rightcover = this.game.add.sprite(59, 0, 'rightcover');

		//Interaction Widget
		this.interactionWidgetBack = this.game.add.sprite(755, 296, 'interactionWidgetBack');
		this.interactionWidgetBack.visible = false;
		this.createGateIcons();

		//retreive button
		this.retreive = this.game.add.sprite(855, 480, 'retreiveBtn');
		this.retreive.visible = false;
		this.retreive.anchor.setTo(0.5, 0.5);
		this.retreive.inputEnabled = true;
		this.retreive.input.pixelPerfectOver = true;
		this.retreive.input.useHandCursor = true;
		this.retreive.events.onInputDown.add(this.pressRetreive, this);
		this.retreive.events.onInputOver.add(function () {
			this.retreive.scale.setTo(1.1, 1.1);
    	}, this);
		this.retreive.events.onInputOut.add(function () {
			this.retreive.scale.setTo(1, 1);
    	}, this);

		//next button
    	this.nextBtn = this.game.add.sprite(885, 445, 'nextBtn');
    	this.nextBtn.visible = false;
		this.nextBtn.anchor.setTo(0.5, 0.5);
		this.nextBtn.inputEnabled = true;
		this.nextBtn.input.pixelPerfectOver = true;
		this.nextBtn.input.useHandCursor = true;
		this.nextBtn.events.onInputDown.add(this.pressNext, this);
		this.nextBtn.events.onInputOver.add(function () {
			this.nextBtn.scale.setTo(1.1, 1.1);
    	}, this);
		this.nextBtn.events.onInputOut.add(function () {
			this.nextBtn.scale.setTo(1, 1);
    	}, this);

		//end of level cover and text
		this.graphicsCover = this.game.add.group();
		this.graphicsCover.visible = false;
    	this.graphicsBack = this.game.add.graphics();
	    this.graphicsBack.beginFill(0x000000, .7);
	    this.graphicsBack.drawRect(0, 0, this.world.width, this.world.height);
	    this.graphicsBack.endFill();
	    
	    //feedback
	    this.notyetheaderText = this.game.add.bitmapText(this.world.width/2, this.world.height/2 - 60, 'opensansextrabold', "NOT YET!", 64);
	    this.notyetheaderText.visible = false;
	    this.notyetheaderText.tint = 0xffffff;
	    this.notyetheaderText.align = 'center';
	    this.notyetheaderText.anchor.setTo(.5,.5);
	    this.notyetheaderText.maxWidth = 690;

	    this.notyetText = this.game.add.bitmapText(this.world.width/2, this.world.height/2, 'opensanslight', "You're missing something...", 45);
	    this.notyetText.visible = false;
	    this.notyetText.tint = 0xffffff;
	    this.notyetText.align = 'center';
	    this.notyetText.anchor.setTo(.5,.5);
	    this.notyetText.maxWidth = 690;

	    this.greatwork1headerText = this.game.add.bitmapText(this.world.width/2, this.world.height/2 - 120, 'opensansextrabold', "AWESOME!", 64);
	    this.greatwork1headerText.visible = false;
	    this.greatwork1headerText.tint = 0xffffff;
	    this.greatwork1headerText.align = 'center';
	    this.greatwork1headerText.anchor.setTo(.5,.5);
	    this.greatwork1headerText.maxWidth = 690;

	    this.greatwork1Text = this.game.add.bitmapText(this.world.width/2, this.world.height/2 + 10, 'opensanslight', "In some situations, such as retrieving\nproduct near end-caps, more than\nfour gates may be required to\nensure everyone stays safe.", 45);
	    this.greatwork1Text.visible = false;
	    this.greatwork1Text.tint = 0xffffff;
	    this.greatwork1Text.align = 'center';
	    this.greatwork1Text.anchor.setTo(.5,.5);
	    this.greatwork1Text.maxWidth = 690;

	    this.graphicsCover.add(this.graphicsBack);
	    this.graphicsCover.add(this.notyetheaderText);
	    this.graphicsCover.add(this.notyetText);
	    this.graphicsCover.add(this.greatwork1headerText);
	    this.graphicsCover.add(this.greatwork1Text);
	    this.graphicsCover.add(this.nextBtn);
   
    },


    ///// INTRO ANIMATION /////
    forkliftMove: function(){
    	this.moveforkliftdownisleTween = this.game.add.tween(this.forkliftfront1Group).to( { x: 224, y: 141 }, 3000, Phaser.Easing.Linear.In, true);
    	this.movespotterdownisleTween = this.game.add.tween(this.spottertemp).to( { x: 149, y: 190 }, 3000, Phaser.Easing.Linear.In, true);
    	
    	this.moveforkliftdownisleTween.onComplete.add(function(){
    		
	    	this.movespotterdownisleTween2 = this.game.add.tween(this.spottertemp).to( {alpha: 0, x: -30, y: 105 }, 700, Phaser.Easing.Linear.In, true);
    	
	    	this.game.time.events.add(Phaser.Timer.SECOND * .3, function(){
	    		this.forkliftfront1Group.visible = false;
	    		this.forkliftfront2Group.visible = true;
	    		this.forklift2safetyTween = this.game.add.tween(this.forklift2safety).to( {alpha: 0,}, 300, Phaser.Easing.Linear.In, true);

	    		//show inbetween forklift

	    		this.game.time.events.add(Phaser.Timer.SECOND * .3, function(){
	    			this.forkliftfront2Group.visible = false;
		    		this.forklift.visible = true;

		    		this.forkliftInplace();

		 		}, this);


	 		}, this);


	    	
    	}, this);
    },

    forkliftInplace: function(){
    	this.activateLevel();
    },

    activateLevel: function(){
    	this.game.add.tween(this.interactionWidgetBack).from( { x: 955 }, 200, Phaser.Easing.Linear.In, true);
    	this.game.add.tween(this.gateIcon).from( { x: 1000 }, 200, Phaser.Easing.Linear.In, true);
    	this.game.add.tween(this.spotterIcon).from( { x: 1090 }, 200, Phaser.Easing.Linear.In, true);
    	this.gateIcon.visible = true;
    	this.spotterIcon.visible = true;
    	this.interactionWidgetBack.visible = true;

  		this.timer.start();
    },


    ///// BETWEEN-END OF LEVELS /////
    pressRetreive: function(e){  	

    	this.retreive.scale.setTo(1, 1);
    	this.retreive.inputEnabled = false;

    	this.game.global.numberOfTriesLevel2 = this.game.global.numberOfTriesLevel2 + 1;

    	if(this.gateCount < this.gatesNeeded  ||  this.spotterCount < this.spottersNeeded){
    		console.log('show not yet');
    		this.tryagainAudio();
    		this.notyetheaderText.visible = true;
    		this.notyetText.visible = true;
    		this.graphicsCover.visible = true;
	    		
	    	this.game.time.events.add(Phaser.Timer.SECOND * 2, function(){
	    		this.retreive.inputEnabled = true;
	    		this.retreive.input.useHandCursor = true;
	    		
	    		this.graphicsCover.visible = false;
	    		this.notyetheaderText.visible = false;
	    		this.greatwork1headerText.visible = false;
	    		this.notyetText.visible = false;
	    		this.greatwork1Text.visible = false;

	 		}, this);
			
    	} else {
    		this.levelComplete();
    	}
    	
    },

    levelComplete: function(){
    	console.log('END LEVEL 2');
    	console.log('this.game.global.numberOfTriesLevel2:' + this.game.global.numberOfTriesLevel2);

    	if(this.game.global.soundtrackAudio){
				this.GateGameSoundtrack.stop();
				this.game.global.GateGameSoundtrack_sound.stop();
		}
    	this.leveloverAudio();

    	this.timer.stop();
    	this.game.global.numberTimeLevel2 = this.timeTaken;
    	console.log('this.timeTaken:' + this.timeTaken);

    	this.retreive.visible = false;
    	this.interactionWidgetBack.visible = false;
    	this.gateIcon.visible = false;
    	this.spotterIcon.visible = false;
    	this.forklift.animations.play('lift');

    	//this.game.time.events.add(Phaser.Timer.SECOND * 4, function(){
    		this.graphicsCover.visible = true;
    		this.notyetheaderText.visible = false;
    		this.notyetText.visible = false;
    		this.greatwork1headerText.visible = true;
    		this.greatwork1Text.visible = true;
    		this.nextBtn.visible = true;
 		//}, this);

    },

    moveForkliftForward: function(){
    		this.game.add.tween(this.forklift).to( { x: 322, y: 129 }, 1000, Phaser.Easing.Linear.In, true);
    },

    pressNext: function(e){
    	this.nextBtn.scale.setTo(1, 1);
    	this.game.state.start("Level3");
    },


    /////////////////////
    ////  UI
    /////////////////////

    createGateIcons: function(){
    	
    	this.gateIcon = this.game.add.sprite(800, this.interactionWidgetBack.y + 12, 'gateIcon');
    	this.gateIcon.visible = false;
    	this.gateIcon.anchor.setTo(.5,.5);
    	this.gateIconOver = this.game.add.sprite(0, 0, 'gateIconOver');
    	this.gateIconOver.anchor.setTo(.5,.5);
    	this.gateIconOver.visible = false;
    	this.gateIcon.inputEnabled = true;
    	this.gateIcon.input.useHandCursor = true;
		this.gateIcon.events.onInputDown.add(function(){
			this.gateIconOver.visible = false;
			this.gateIcon.inputEnabled = false;
			this.gateDragging = true;

			this.activateGateHitAreas();
			this.deactivateSpotterHitAreas();

		}, this);
		this.gateIcon.events.onInputOver.add(function(){
			this.gateIconOver.visible = true;

		}, this);
		this.gateIcon.events.onInputOut.add(function(){
			if(this.gateDragging == false){
				this.gateIconOver.visible = false;
			}
		}, this);

		this.gateIcon.addChild(this.gateIconOver);
	

		this.spotterIcon = this.game.add.sprite(890, this.interactionWidgetBack.y + 15, 'spotterIcon');
		this.spotterIcon.visible = false;
		this.spotterIcon.anchor.setTo(.5,.5);
		this.spotterIconOver = this.game.add.sprite(0, 0, 'spotterIconOver');
		this.spotterIconOver.anchor.setTo(.5,.5);
		this.spotterIconOver.visible = false;
    	this.spotterIcon.inputEnabled = true;
    	this.spotterIcon.input.useHandCursor = true;
		this.spotterIcon.events.onInputDown.add(function(){
			this.spotterIconOver.visible = false;
			this.spotterIcon.inputEnabled = false;
			this.spotterDragging = true;

			this.activateSpotterHitAreas();
			this.deactivateGateHitAreas();

		}, this);
		this.spotterIcon.events.onInputOver.add(function(){
			this.spotterIconOver.visible = true;

		}, this);
		this.spotterIcon.events.onInputOut.add(function(){
			if(this.spotterDragging == false){
				this.spotterIconOver.visible = false;
			}
		}, this);

		this.spotterIcon.addChild(this.spotterIconOver);
	    
    },

    createLevel2HitAreas: function(){
    	//gate a hit area
		//this.l1gate_a.tint = 0xdbdada;
		this.l2gate_a = this.game.add.sprite(17, 151, 'l2gate_a');
		this.l2gate_a.inputEnabled = true;
		this.l2gate_a.input.pixelPerfectOver = true;
		this.l2gate_a.events.onInputOver.add(function overGate1(){
			if(this.gateDragging == true){
				this.l2gate_aOver.visible = true;
			}
		}, this);
		this.l2gate_a.events.onInputOut.add(function overGate1(){
			if(this.gateDragging == true){
				this.l2gate_aOver.visible = false;
			}
		}, this);

		//gate b hit area
		this.l2gate_b = this.game.add.sprite(341, -54, 'l2gate_b');
		this.l2gate_b.inputEnabled = true;
		this.l2gate_b.input.pixelPerfectOver = true;
		this.l2gate_b.events.onInputOver.add(function overGate1(){
			if(this.gateDragging == true){
				this.l2gate_bOver.visible = true;
			}
		}, this);
		this.l2gate_b.events.onInputOut.add(function overGate1(){
			if(this.gateDragging == true){
				this.l2gate_bOver.visible = false;
			}
		}, this);

		//gate c hit area
		this.l2gate_c = this.game.add.sprite(558, 48, 'l2gate_b');
		this.l2gate_c.inputEnabled = true;
		this.l2gate_c.input.pixelPerfectOver = true;
		this.l2gate_c.events.onInputOver.add(function overGate1(){
			if(this.gateDragging == true){
				this.l2gate_cOver.visible = true;
			}
		}, this);
		this.l2gate_c.events.onInputOut.add(function overGate1(){
			if(this.gateDragging == true){
				this.l2gate_cOver.visible = false;
			}
		}, this);

		//gate d hit area
		this.l2gate_d = this.game.add.sprite(475, 362, 'l2gate_d');
		this.l2gate_d.inputEnabled = true;
		this.l2gate_d.input.pixelPerfectOver = true;
		this.l2gate_d.events.onInputOver.add(function overGate1(){
			if(this.gateDragging == true){
				this.l2gate_dOver.visible = true;
			}
		}, this);
		this.l2gate_d.events.onInputOut.add(function overGate1(){
			if(this.gateDragging == true){
				this.l2gate_dOver.visible = false;
			}
		}, this);

		//gate e hit area
		this.l2gate_e = this.game.add.sprite(280, 432, 'l2gate_b');
		this.l2gate_e.inputEnabled = true;
		this.l2gate_e.input.pixelPerfectOver = true;
		this.l2gate_e.events.onInputOver.add(function overGate1(){
			if(this.gateDragging == true){
				this.l2gate_eOver.visible = true;
			}
		}, this);
		this.l2gate_e.events.onInputOut.add(function overGate1(){
			if(this.gateDragging == true){
				this.l2gate_eOver.visible = false;
			}
		}, this);

		//gate f hit area
		this.l2gate_f = this.game.add.sprite(59, 329, 'l2gate_b');
		this.l2gate_f.inputEnabled = true;
		this.l2gate_f.input.pixelPerfectOver = true;
		this.l2gate_f.events.onInputOver.add(function overGate1(){
			if(this.gateDragging == true){
				this.l2gate_fOver.visible = true;
			}
		}, this);
		this.l2gate_f.events.onInputOut.add(function overGate1(){
			if(this.gateDragging == true){
				this.l2gate_fOver.visible = false;
			}
		}, this);

		//spotter a hit area
		this.l2spotter_a = this.game.add.sprite(577, 27, 'l2spotter_a');
		this.l2spotter_a.inputEnabled = true;
		this.l2spotter_a.input.pixelPerfectOver = true;
		this.l2spotter_a.events.onInputOver.add(function overGate1(){
			if(this.spotterDragging == true){
				this.l2spotter_aOver.visible = true;
			}
		}, this);
		this.l2spotter_a.events.onInputOut.add(function overGate1(){
			if(this.spotterDragging == true){
				this.l2spotter_aOver.visible = false;
			}
		}, this);

		//spotter b hit area
		this.l2spotter_b = this.game.add.sprite(293, 442, 'l2spotter_a');
		this.l2spotter_b.inputEnabled = true;
		this.l2spotter_b.input.pixelPerfectOver = true;
		this.l2spotter_b.events.onInputOver.add(function overGate1(){
			if(this.spotterDragging == true){
				this.l2spotter_bOver.visible = true;
			}
		}, this);
		this.l2spotter_b.events.onInputOut.add(function overGate1(){
			if(this.spotterDragging == true){
				this.l2spotter_bOver.visible = false;
			}
		}, this);

		//spotter c hit area
		this.l2spotter_c = this.game.add.sprite(475, 362, 'l2gate_d');
		this.l2spotter_c.inputEnabled = true;
		this.l2spotter_c.input.pixelPerfectOver = true;
		this.l2spotter_c.events.onInputOver.add(function overGate1(){
			if(this.spotterDragging == true){
				this.l2spotter_cOver.visible = true;
			}
		}, this);
		this.l2spotter_c.events.onInputOut.add(function overGate1(){
			if(this.spotterDragging == true){
				this.l2spotter_cOver.visible = false;
			}
		}, this);
		
    },

    createLevel2: function(){
			
			//set up layering groups
			this.l2g1 = this.game.add.group();
			this.l2g2 = this.game.add.group();
			this.l2g3 = this.game.add.group();
			this.l2g4 = this.game.add.group();
			this.l2g5 = this.game.add.group();
			this.l2g6 = this.game.add.group();
			this.l2g7 = this.game.add.group();
			this.l2g8 = this.game.add.group();
			this.l2g9 = this.game.add.group();

			this.forkliftfront1Group = this.game.add.group();
			this.forkliftfront1Group.x = 908;
			this.forkliftfront1Group.y = 473;

			this.forklift1safety = this.game.add.sprite(-79, 41, 'forklift2safety');
			this.forkliftfront1Group.add(this.forklift1safety);

			this.forkliftfront1 = this.game.add.sprite(0, 0, 'forklift2', 'forklift2/0000');//908,473
			this.forkliftfront1Group.add(this.forkliftfront1);

			
			this.forkliftfront2Group = this.game.add.group();
			this.l2g2.add(this.forkliftfront2Group);
			this.forkliftfront2Group.x = 292;
			this.forkliftfront2Group.y = 124;

			this.forklift2safety = this.game.add.sprite(-40, 38, 'forklift2bsafety');
			this.forkliftfront2Group.add(this.forklift2safety);

			this.forkliftfront2 = this.game.add.sprite(0, 0, 'forklift1', 'forklift1/0000');
			this.forkliftfront2Group.visible = false;
			this.forkliftfront2Group.add(this.forkliftfront2);

			this.spottertemp = this.game.add.sprite(this.forkliftfront1Group.x - 75, this.forkliftfront1Group.y + 49, 'spotterPlacedBack');

			this.forklift = this.game.add.sprite(307, 121, 'forklift2', 'forklift2/0000');
			this.forklift.visible = false;
			this.forklift_ani = this.forklift.animations.add('lift', Phaser.Animation.generateFrameNames('forklift2/lift_', 0, 25, '', 4), 30, false, false);
			this.forklift_ani.onComplete.add(this.moveForkliftForward, this);

			//////temp////////////

			this.box = this.game.add.sprite(30, 30, 'extra4');
			this.box.visible = false;
			
			//this.box.tint = 0xffffff;
			//this.box.scale.x *= -1;
			//this.box.visible = false;
			//this.box.anchor.x = 1;
			//this.box.anchor.y = 1;

			
		    this.game.physics.arcade.enable(this.box);
		    this.box.inputEnabled = true;
		    this.box.input.enableDrag(false, true, false);
	    	this.box.input.useHandCursor = true;
		    
		   

		    
		    this.box.events.onDragStart.add(function(currentSprite){
		    	this.startDrag(currentSprite);    		
	    	}, this);

		    this.box.events.onDragStop.add(function(currentSprite){
		    	console.log(currentSprite.x + "::::" + currentSprite.y);
	      		this.stopDrag(currentSprite);
	    	}, this);

	    	//this.box.scale.x *= -1;
			//this.box.anchor.setTo(.5,.5);
		
			
		    ///////////////////////

		    

		    
			//add racks
			//g2
			var r1 = this.game.add.sprite(170, -411, 'rack');
			this.l2g2.add(r1);

			this.l2gate_aOver = this.game.add.sprite(70, 144, 'l2gate_aOver');
			this.l2gate_aOver.visible = false;
			this.l2g2.add(this.l2gate_aOver);

			this.l2gate_aPlaced = this.game.add.sprite(84, 158, 'gatePlaced2');
			this.l2gate_aPlaced.visible = false;
			this.l2g2.add(this.l2gate_aPlaced);


			var r2 = this.game.add.sprite(-258, 188, 'rack');
			this.l2g2.add(r2);
			
			
			//g3
			this.l2gate_bOver = this.game.add.sprite(267, -19, 'l2gate_bOver');
			this.l2gate_bOver.visible = false;
			this.l2g3.add(this.l2gate_bOver);

			this.l2gate_bPlaced = this.game.add.sprite(527, -2, 'gatePlaced');
			this.l2gate_bPlaced.scale.x *= -1;
			this.l2gate_bPlaced.visible = false;
			this.l2g3.add(this.l2gate_bPlaced);

			this.l2gate_fOver = this.game.add.sprite(98, 297, 'l2gate_fOver');
			this.l2gate_fOver.visible = false;
			this.l2g3.add(this.l2gate_fOver);

			this.l2gate_fPlaced = this.game.add.sprite(301, 315, 'gatePlaced');
			this.l2gate_fPlaced.scale.x *= -1;
			this.l2gate_fPlaced.visible = false;
			this.l2g3.add(this.l2gate_fPlaced);


			
			//g4
			var r3 = this.game.add.sprite(387, -306, 'rack');
			this.l2g4.add(r3);

			var r4 = this.game.add.sprite(-42, 293, 'rack');
			this.l2g4.add(r4);

			var box = this.game.add.sprite(390, 135, 'box2');
			box.alpha = .5;
    		this.game.add.tween(box).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
			

			//g5
			this.l2spotter_aOver = this.game.add.sprite(690, 75, 'l1spotter_aOver');
			this.l2spotter_aOver.scale.x *= -1;
			this.l2spotter_aOver.visible = false;
			this.l2g5.add(this.l2spotter_aOver);

			this.l2spotter_aPlaced = this.game.add.sprite(673, 93, 'spotterPlaced');
			this.l2spotter_aPlaced.scale.x *= -1;
			this.l2spotter_aPlaced.visible = false;
			this.l2g5.add(this.l2spotter_aPlaced);


			this.l2gate_cOver = this.game.add.sprite(484, 85, 'l2gate_bOver');
			this.l2gate_cOver.visible = false;
			this.l2g5.add(this.l2gate_cOver);

			this.l2gate_cPlaced = this.game.add.sprite(745, 102, 'gatePlaced');
			this.l2gate_cPlaced.scale.x *= -1;
			this.l2gate_cPlaced.visible = false;
			this.l2g5.add(this.l2gate_cPlaced);

			this.l2gate_eOver = this.game.add.sprite(317, 403, 'l2gate_fOver');
			this.l2gate_eOver.visible = false;
			this.l2g5.add(this.l2gate_eOver);

			this.l2gate_ePlaced = this.game.add.sprite(520, 420, 'gatePlaced');
			this.l2gate_ePlaced.scale.x *= -1;
			this.l2gate_ePlaced.visible = false;
			this.l2g5.add(this.l2gate_ePlaced);

			this.l2spotter_bOver = this.game.add.sprite(407, 458, 'l2spotter_bOver');
			this.l2spotter_bOver.scale.x *= -1;
			this.l2spotter_bOver.visible = false;
			this.l2g5.add(this.l2spotter_bOver);

			this.l2spotter_bPlaced = this.game.add.sprite(390, 475, 'spotterPlacedBack');
			this.l2spotter_bPlaced.scale.x *= -1;
			this.l2spotter_bPlaced.visible = false;
			this.l2g5.add(this.l2spotter_bPlaced);
			
			//g6
			var r5 = this.game.add.sprite(606, -203, 'rack');
			this.l2g6.add(r5);

			this.l2gate_dOver = this.game.add.sprite(504, 352, 'l2gate_aOver');
			this.l2gate_dOver.visible = false;
			this.l2g6.add(this.l2gate_dOver);

			this.l2gate_dPlaced = this.game.add.sprite(518, 366, 'gatePlaced2');
			this.l2gate_dPlaced.visible = false;
			this.l2g6.add(this.l2gate_dPlaced);

			this.l2spotter_cOver = this.game.add.sprite(580, 407, 'l2spotter_bOver');
			this.l2spotter_cOver.visible = false;
			this.l2g6.add(this.l2spotter_cOver);

			this.l2spotter_cPlaced = this.game.add.sprite(597, 424, 'spotterPlacedBack');
			this.l2spotter_cPlaced.visible = false;
			this.l2g6.add(this.l2spotter_cPlaced);

			var r6 = this.game.add.sprite(177, 397, 'rack');
			this.l2g6.add(r6);
			
			
			//g7
			//center isle
			this.extra8 = this.game.add.sprite(943, -20, 'extra6');
			this.extra8tween = this.game.add.tween(this.extra8).to( { x: 565, y: 546 }, 20500, "Linear", true, 20000);
			this.l2g6.add(this.extra8);
			this.extra8tween.repeat(10, 9000);

			//center isle
			this.extra5 = this.game.add.sprite(983, 51, 'extra5');
			this.extra5tween = this.game.add.tween(this.extra5).to( { x: 883, y: 175 }, 5000, "Linear", true, 6000);
			this.extra5tween.onComplete.add(function(){
					this.extra4btween = this.game.add.tween(this.extra4).to( { x: 617, y: 546 }, 17500, "Linear", true, 3000);
					this.extra5btween = this.game.add.tween(this.extra5).to( { x: 627, y: 566 }, 17500, "Linear", true, 6000);
			}, this);
			this.extra4 = this.game.add.sprite(993, 51, 'extra4');
			this.extra4tween = this.game.add.tween(this.extra4).to( { x: 867, y: 197 }, 7500, "Linear", true, 1000);

			//top isle
			this.extra6 = this.game.add.sprite(-27, 174, 'extra4');
			this.extra6tween = this.game.add.tween(this.extra6).to( { x: 120, y: -36 }, 7500, "Linear", true, 7000);
			this.extra6tween.repeat(10, 1000);

			this.extra9 = this.game.add.sprite(170, -36, 'extra5');
			this.extra9tween = this.game.add.tween(this.extra9).to( { x: -20, y: 250  }, 9500, "Linear", true, 19000);
			this.extra9tween.repeat(10, 5000);
				
			//bottom isle
			this.extra7 = this.game.add.sprite(1000, 426, 'extra5');
			this.extra7tween = this.game.add.tween(this.extra7).to( { x: 878, y: 538 }, 10500, "Linear", true, 6000).loop(true);
			this.extra7tween.repeat(10, 1000);

			

			

			//g8
			var r7 = this.game.add.sprite(832, -98, 'rack');
			

			var r8 = this.game.add.sprite(403, 502, 'rack');
			this.l2g8.add(r8);
			//921 550
			this.extra3 = this.game.add.sprite(921, 550, 'extra3');

			

				
    },


    /////////// TEMP BUTTON
    pressStart: function (e) {
    	//this.buttonSoundClick.play();
		

		this.start.scale.setTo(1, 1);
		

		window.endgame(101);
		
    },
	overStart: function (e) {
		this.start.scale.setTo(1.1, 1.1);
    },
    outStart: function (e) {
		this.start.scale.setTo(1, 1);
    },

    /////////// GAME DRAG DROP
    startDrag: function(currentSprite){

    	//currentSprite.scale.setTo(1.1, 1.1);
    	currentSprite._beingDragged = true;

    	this.itemBeingDragged = true;
    	this.spriteBeingDragged = currentSprite;
    	//this.spriteBeingDragged.tint = 0xdbdada;
    
    },

    stopDrag: function(currentSprite){

    	
    	currentSprite._beingDragged = false;
    	
    	this.spriteBeingDragged.tint = 0xffffff;
    	this.spriteBeingDragged = null;
    	this.itemBeingDragged = false;

    },

    activateGateHitAreas: function(){
    	console.log("activateGateHitAreas");
    	if(this.l2gate_a_active == true){
    		this.l2gate_a.inputEnabled = true;
			this.l2gate_a.input.pixelPerfectOver = true;
    	}
    	
    	if(this.l2gate_b_active == true){
			this.l2gate_b.inputEnabled = true;
			this.l2gate_b.input.pixelPerfectOver = true;
		}

		if(this.l2gate_c_active == true){
			this.l2gate_c.inputEnabled = true;
			this.l2gate_c.input.pixelPerfectOver = true;
		}

		if(this.l2gate_d_active == true){
			this.l2gate_d.inputEnabled = true;
			this.l2gate_d.input.pixelPerfectOver = true;
		}

		if(this.l2gate_e_active == true){
			this.l2gate_e.inputEnabled = true;
			this.l2gate_e.input.pixelPerfectOver = true;
		}

		if(this.l2gate_f_active == true){
			this.l2gate_f.inputEnabled = true;
			this.l2gate_f.input.pixelPerfectOver = true;
		}

    },

    deactivateGateHitAreas: function(){
    	this.l2gate_a.inputEnabled = false;
    	this.l2gate_b.inputEnabled = false;
    	this.l2gate_c.inputEnabled = false;
    	this.l2gate_d.inputEnabled = false;
    	this.l2gate_e.inputEnabled = false;
    	this.l2gate_f.inputEnabled = false;
		
    },

    activateSpotterHitAreas: function(){
    	console.log("activateSpotterHitAreas");
    	if(this.l2spotter_a_active == true){
    		this.l2spotter_a.inputEnabled = true;
			this.l2spotter_a.input.pixelPerfectOver = true;
    	}    	
    	if(this.l2spotter_b_active == true){
    		this.l2spotter_b.inputEnabled = true;
			this.l2spotter_b.input.pixelPerfectOver = true;
    	}

    	if(this.l2spotter_c_active == true){
    		this.l2spotter_c.inputEnabled = true;
			this.l2spotter_c.input.pixelPerfectOver = true;
    	}
    	
 
    },

    deactivateSpotterHitAreas: function(){
    	this.l2spotter_a.inputEnabled = false;
    	this.l2spotter_b.inputEnabled = false;
    	this.l2spotter_c.inputEnabled = false;
    },

	/////////////////////////////
	/////////// GAME LOOPS
	/////////////////////////////

	update: function(){
		
		if (this.timer.running) {
        	//count down
	    	//this.timeTxt.text = this.formatTime(Math.round((this.timerEvent.delay - this.timer.ms) / 1000));
            //count up
            //this.timeTxt.text = this.formatTime(Math.round((this.timer.ms) / 1000));
            this.timeTaken = Math.round((this.timer.ms) / 1000);
		}


		//gate dragging
		if(this.gateDragging == true){
			if(this.game.input.activePointer.isDown == true){
				this.game.canvas.style.cursor = 'pointer';
				this.gateIcon.x = game.input.x;
				this.gateIcon.y = game.input.y;
			} else {
				if(this.l2gate_aOver.visible == true){
					this.gateCount = this.gateCount + 1;
					this.gateplacedAudio();
					this.l2gate_a_active = false;
					this.l2gate_aPlaced.visible = true;
					this.l2gate_a.inputEnabled = false;
					this.l2gate_aOver.visible = false;
				} 
				
				if(this.l2gate_bOver.visible == true){
					this.gateCount = this.gateCount + 1;
					this.gateplacedAudio();
					this.l2gate_b_active = false;
					this.l2gate_bPlaced.visible = true;
					this.l2gate_b.inputEnabled = false;
					this.l2gate_bOver.visible = false;
				} 

				if(this.l2gate_cOver.visible == true){
					this.gateCount = this.gateCount + 1;
					this.gateplacedAudio();
					this.l2gate_c_active = false;
					this.l2gate_cPlaced.visible = true;
					this.l2gate_c.inputEnabled = false;
					this.l2gate_cOver.visible = false;
				} 
				
				if(this.l2gate_dOver.visible == true){
					this.extra3tween = this.game.add.tween(this.extra3).to( { x: 755, y: 466 }, 6000, "Linear", true, 5000);
					this.gateCount = this.gateCount + 1;
					this.gateplacedAudio();
					this.l2gate_d_active = false;
					this.l2gate_dPlaced.visible = true;
					this.l2gate_d.inputEnabled = false;
					this.l2gate_dOver.visible = false;
				}
				
				if(this.l2gate_eOver.visible == true){
					this.gateCount = this.gateCount + 1;
					this.gateplacedAudio();
					this.l2gate_e_active = false;
					this.l2gate_ePlaced.visible = true;
					this.l2gate_e.inputEnabled = false;
					this.l2gate_eOver.visible = false;
				} 
				if(this.l2gate_fOver.visible == true){
					this.gateCount = this.gateCount + 1;
					this.gateplacedAudio();
					this.l2gate_f_active = false;
					this.l2gate_fPlaced.visible = true;
					this.l2gate_f.inputEnabled = false;
					this.l2gate_fOver.visible = false;
				} 

				if(this.gateCount>0 && this.retreive.visible == false){
					this.retreive.alpha = 0;
					this.retreive.visible = true;
					this.game.add.tween(this.retreive).to( { alpha:1 }, 300, "Linear", true);
				}

				//reset gate
				if(this.gateCount < 6){
					this.gateDragging = false;
					this.gateIconOver.visible = false;
					this.gateIcon.x = 800;
					this.gateIcon.y = this.interactionWidgetBack.y + 12;
					this.game.canvas.style.cursor = '';
					this.gateIcon.inputEnabled = true;
					this.gateIcon.input.useHandCursor = true;
				} else {
					this.gateIcon.x = 800;
					this.gateIcon.y = this.interactionWidgetBack.y + 12;
					this.gateDragging = false;
					this.game.canvas.style.cursor = '';
					this.gateIconOver.visible = false;
					this.gateIcon.visible = false;
				}
				
			}
			

		} else if(this.spotterDragging == true){
			if(this.game.input.activePointer.isDown == true){
				this.game.canvas.style.cursor = 'pointer';
				this.spotterIcon.x = game.input.x;
				this.spotterIcon.y = game.input.y;
			} else {
				if(this.l2spotter_aOver.visible == true){
					this.spotterCount = this.spotterCount + 1;
					this.spotterplacedAudio();
					this.l2spotter_a_active = false;
					this.l2spotter_aPlaced.visible = true;
					this.l2spotter_a.inputEnabled = false;
					this.l2spotter_aOver.visible = false;
				} 
			
				if(this.l2spotter_bOver.visible == true){
					this.spotterCount = this.spotterCount + 1;
					this.spotterplacedAudio();
					this.l2spotter_b_active = false;
					this.l2spotter_bPlaced.visible = true;
					this.l2spotter_b.inputEnabled = false;
					this.l2spotter_bOver.visible = false;
				} 

				if(this.l2spotter_cOver.visible == true){
					this.spotterCount = this.spotterCount + 1;
					this.spotterplacedAudio();
					this.l2spotter_c_active = false;
					this.l2spotter_cPlaced.visible = true;
					this.l2spotter_c.inputEnabled = false;
					this.l2spotter_cOver.visible = false;
				} 
				
				if(this.spotterCount>0 && this.retreive.visible == false){
					this.retreive.alpha = 0;
					this.retreive.visible = true;
					this.game.add.tween(this.retreive).to( { alpha:1 }, 300, "Linear", true);
				}

				//reset spotter
				if(this.spotterCount < 3){
					this.spotterDragging = false;
					this.spotterIconOver.visible = false;
					this.spotterIcon.x = 890;
					this.spotterIcon.y = this.interactionWidgetBack.y + 15;
					this.game.canvas.style.cursor = '';
					this.spotterIcon.inputEnabled = true;
					this.spotterIcon.input.useHandCursor = true;
				} else {
					this.spotterIcon.x = 890;
					this.spotterIcon.y = this.interactionWidgetBack.y + 15;
					this.spotterDragging = false;
					this.game.canvas.style.cursor = '';
					this.spotterIconOver.visible = false;
					this.spotterIcon.visible = false;
				}
			}
			

		}

		
		
	},

	render: function(){
		
	},

	/////////////////////
    ////  AUIDO
    /////////////////////

	gateplacedAudio: function(){
		
		if (!this.game.cache.checkSoundKey('GateGame_GatePlacement')) {
			
			this.game.global.GateGame_GatePlacement_sound.play();
		} else {
			//console.log('beep!');
			this.GateGame_GatePlacement.play();
		}
	},

	spotterplacedAudio: function(){
		
		if (!this.game.cache.checkSoundKey('GateGame_SpotterPlacement')) {
			
			this.game.global.GateGame_SpotterPlacement_sound.play();
		} else {
			//console.log('beep!');
			this.GateGame_SpotterPlacement.play();
		}
	},

	leveloverAudio: function(){
		
		if (!this.game.cache.checkSoundKey('GateGame_LevelUp')) {
			
			this.game.global.GateGame_LevelUp_sound.play();
		} else {
			//console.log('beep!');
			this.GateGame_LevelUp.play();
		}
	},

	tryagainAudio: function(){
		
		if (!this.game.cache.checkSoundKey('GateGate_TryAgain')) {
			
			this.game.global.GateGate_TryAgain_sound.play();
		} else {
			//console.log('beep!');
			this.GateGate_TryAgain.play();
		}
	},

	soundtrackAudio: function(){
		
		if (!this.game.cache.checkSoundKey('GateGameSoundtrack')) {
			
			this.game.globalGateGameSoundtrack_sound.play();
		} else {
			//console.log('beep!');
			this.GateGameSoundtrack.play();
		}
	},



	endTimer: function() {
        // Stop the timer when the delayed event triggers

        console.log("END TIMER");

        this.timer.stop();
		this.timeTxt.text = "0:00";  //:00     
		this.endlevel();
    },

    formatTime: function(s) {
        // Convert seconds (s) to a nicely formatted and padded time string
        //if(s<11){
        	//timeText.tint = 0xFF0000;
        //}

        //var minutes = "0" + Math.floor(s / 60);
        //var seconds = "0" + (s - minutes * 60);
        var minutes;
        var seconds;
    	
        this.endMinutes = Math.floor(s / 60);
		this.endSeconds = (s - this.endMinutes * 60);

        //return minutes.substr(-2) + ":" + seconds.substr(-2);
		//return ":" + seconds.substr(-2);

		if(this.TimeMinutes > 0){
			minutes = Math.floor(s / 60);
			//minutes = "0" + Math.floor(s / 60);
       		seconds = "0" + (s - minutes * 60);

			//return minutes.substr(-2) + ":" + seconds.substr(-2);
			return minutes + ":" + seconds.substr(-2);	
		} else {
			seconds = "0" + (s);

			return ":" +  seconds.substr(-2); 
		}
		
    }

}

