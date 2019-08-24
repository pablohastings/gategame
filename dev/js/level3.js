"use strict";
var level3 = function(game){

	this.ss;
	this.box;
	this.buttonSoundClick
	this.global_sfx_win;

	//configurable from dom
	this.redirecttime = window.redirectTime;

};

level3.prototype = {
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
		//this.ss = this.game.add.sprite(0, 0, 'comp3');
		//this.ss.visible = false;
	

		//game vars
		this.game.global.numberOfTriesLevel3 = 0;
		this.TimeMinutes = 10000;
  		this.TimeSeconds = 0;
		this.timer = this.game.time.create();
	    this.timerEvent = this.timer.add(Phaser.Timer.MINUTE * this.TimeMinutes + Phaser.Timer.SECOND * this.TimeSeconds, this.endTimer, this);
	    

		this.gateDragging = false;
		this.spotterDragging = false;

		this.gateCount = 0;
		this.spotterCount = 0;
		this.gatesNeeded = 2;
		this.spottersNeeded = 1;

		this.l1gate_a_active = true;
		this.l1gate_c_active = true;

		this.l1spotter_a_active = true;
		this.l1spotter_b_active = true;

  		this.createUi();
  		this.forkliftMove();

	},

	
    createUi: function(){
    	
    	//creates the hit areas for gates and spotters
		this.createLevel3HitAreas();

		//places the isles, gates, and spotters
    	this.createLevel3();

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

		//white cover on right side
		this.rightcover = this.game.add.sprite(60, 0, 'rightcover');

		//Interaction Widget
		this.interactionWidgetBack = this.game.add.sprite(755, 164, 'interactionWidgetBack');
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
    	this.nextBtn = this.game.add.sprite(855, 480, 'endBtn');
    	this.nextBtn.visible = false;
		this.nextBtn.anchor.setTo(0.5, 0.5);
		this.nextBtn.inputEnabled = true;
		this.nextBtn.input.pixelPerfectOver = true;
		this.nextBtn.input.useHandCursor = true;
		this.nextBtn.events.onInputDown.add(this.pressNext, this);
		this.nextBtn.events.onInputOver.add(function () {
			this.nextBtn.scale.setTo(1.1, 1.1);
			this.endarrows.animations.play('stop');
    	}, this);
		this.nextBtn.events.onInputOut.add(function () {
			this.nextBtn.scale.setTo(1, 1);
			this.endarrows.animations.play('play');
    	}, this);

		this.endarrows = this.game.add.sprite(0, -1, 'endbutton', 'endbutton/start_0000');
		this.endarrows.anchor.setTo(0.5, 0.5);
		this.endarrows_ani = this.endarrows.animations.add('play', Phaser.Animation.generateFrameNames('endbutton/start_', 0, 32, '', 4), 24, true, false);
		this.endarrows_ani = this.endarrows.animations.add('stop', Phaser.Animation.generateFrameNames('endbutton/end_', 0, 0, '', 4), 0, false, false);
		this.nextBtn.addChild(this.endarrows);
		this.endarrows.animations.play('play');


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

	    this.greatwork1headerText = this.game.add.bitmapText(this.world.width/2, this.world.height/2 - 100, 'opensansextrabold', "THAT'S RIGHT!", 64);
	    this.greatwork1headerText.visible = false;
	    this.greatwork1headerText.tint = 0xffffff;
	    this.greatwork1headerText.align = 'center';
	    this.greatwork1headerText.anchor.setTo(.5,.5);
	    this.greatwork1headerText.maxWidth = 690;

	    this.greatwork1Text = this.game.add.bitmapText(this.world.width/2, this.world.height/2, 'opensanslight', "Gates are only needed in the working\naisle with electric ladders and\nyou don't need a spotter.",  45);
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
    	this.moveforkliftdownisleTween = this.game.add.tween(this.forkliftfront1Group).to( { x: 388, y: 152 }, 4500, Phaser.Easing.Linear.In, true);//388::::152  x: 418, y: 137
    	this.moveforkliftdownisleTween.onComplete.add(function(){
    		
    		
    		this.forklift1safetyTween = this.game.add.tween(this.forklift1safety).to( { alpha: 0 }, 500, Phaser.Easing.Linear.In, true);

    		this.moveforkliftdownisleTween2 = this.game.add.tween(this.forkliftfront1Group).to( { x: 418, y: 137 }, 500, Phaser.Easing.Linear.In, true, 500);
    		this.moveforkliftdownisleTween2.onComplete.add(function(){
    				this.forkliftInplace();
    		}, this);

    	}, this);


    	
    	//left isle
		this.extra2 = this.game.add.sprite(-20, 133, 'extra4');
		this.extra2tween = this.game.add.tween(this.extra2).to( { x: 265, y: 545 }, 12000, "Linear", true, 12000);
		this.extra2tween.repeat(10, 8000);

		this.extra3 = this.game.add.sprite(325, 540, 'extra3');
		this.extra3tween = this.game.add.tween(this.extra3).to( { x: 182, y: 347 }, 5800, "Linear", true, 12000);
		this.extra3tween.onComplete.add(function(){
    		this.game.add.tween(this.extra3).to( { x: -15, y: 70 }, 5800, "Linear", true, 800);
    	}, this);

    	this.extra4 = this.game.add.sprite(898, 540, 'extra2');
		this.extra4tween = this.game.add.tween(this.extra4).to( { x: 486, y: -34 }, 18000, "Linear", true, 15000);
		this.extra4tween.repeat(10, 9000);

		//bottom isle
		this.extra1 = this.game.add.sprite(1000, 384, 'extra5');
		this.extra1tween = this.game.add.tween(this.extra1).to( { x: 600, y: 547 }, 10000, "Linear", true, 100);
		this.extra1tween.repeat(10, 29000);

		this.extra5 = this.game.add.sprite(970, 357, 'extra6');
		this.extra5tween = this.game.add.tween(this.extra5).to( { x: 475, y: 565 }, 13500, "Linear", true, 30000);
		this.extra5tween.repeat(10, 29000);

		//right isle	
		this.extra6 = this.game.add.sprite(964, 242, 'extra3');
		this.extra6tween = this.game.add.tween(this.extra6).to( { x: 777, y: -35 }, 9800, "Linear", true, 4000);
		this.extra6tween.repeat(10, 8000);

		this.l1g1.add(this.extra1);
		this.l1g1.add(this.extra2);
		this.l1g1.add(this.extra3);
		this.l1g1.add(this.extra4);
		this.l1g1.add(this.extra5);
		this.l1g1.add(this.extra6);
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

    	this.game.global.numberOfTriesLevel3 = this.game.global.numberOfTriesLevel3 + 1;

    	if(this.gateCount < this.gatesNeeded ){
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

	    	 	//this.game.state.start("EndGame");
	 		}, this);
			
    	} else {
    		this.levelComplete();
    	}
    	
    },

    levelComplete: function(){
    	console.log('END LEVEL 3');
    	console.log('this.game.global.numberOfTriesLevel3:' + this.game.global.numberOfTriesLevel3);

    	if(this.game.global.soundtrackAudio){
				this.GateGameSoundtrack.stop();
				this.game.global.GateGameSoundtrack_sound.stop();
		}

    	this.leveloverAudio();

    	this.timer.stop();
    	this.game.global.numberTimeLevel3 = this.timeTaken;
    	console.log('this.timeTaken:' + this.timeTaken);

    	this.retreive.visible = false;
    	this.interactionWidgetBack.visible = false;
    	this.gateIcon.visible = false;
    	this.spotterIcon.visible = false;
    	this.forklift.animations.play('lift');

    	
		this.graphicsCover.visible = true;
		this.notyetheaderText.visible = false;
		this.notyetText.visible = false;
		this.greatwork1headerText.visible = true;
		this.greatwork1Text.visible = true;
		this.nextBtn.visible = true;
 		
 		
 			
    },

    pressNext: function(e){
    	this.nextBtn.scale.setTo(1, 1);
    	window.endgame(this.game.global.numberTimeLevel1, this.game.global.numberOfTriesLevel1, this.game.global.numberTimeLevel2, this.game.global.numberOfTriesLevel2, this.game.global.numberTimeLevel3, this.game.global.numberOfTriesLevel3);
 		

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
			//this.deactivateSpotterHitAreas();

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


    createLevel3HitAreas: function(){

    	//gate a hit area
		
		this.l1gate_a = this.game.add.sprite(199, 62, 'l1gate_a');
		this.l1gate_a.inputEnabled = true;
		this.l1gate_a.input.pixelPerfectOver = true;
		this.l1gate_a.events.onInputOver.add(function overGate1(){
			if(this.gateDragging == true){
				this.l1gate_aOver.visible = true;
			}
		}, this);
		this.l1gate_a.events.onInputOut.add(function overGate1(){
			if(this.gateDragging == true){
				this.l1gate_aOver.visible = false;
			}
		}, this);
		

		//gate c hit area
		this.l1gate_c = this.game.add.sprite(406, 350, 'l1gate_a');
		this.l1gate_c.inputEnabled = true;
		this.l1gate_c.input.pixelPerfectOver = true;
		this.l1gate_c.events.onInputOver.add(function overGate1(){
			if(this.gateDragging == true){
				this.l1gate_cOver.visible = true;
			}
		}, this);
		this.l1gate_c.events.onInputOut.add(function overGate1(){
			if(this.gateDragging == true){
				this.l1gate_cOver.visible = false;
			}
		}, this);
		

		/*
		//spotter a hit area
		this.l1spotter_a = this.game.add.sprite(184, 39, 'l1gate_a');
		this.l1spotter_a.inputEnabled = true;
		this.l1spotter_a.input.pixelPerfectOver = true;
		this.l1spotter_a.events.onInputOver.add(function overGate1(){
			if(this.spotterDragging == true){
				this.l1spotter_aOver.visible = true;
			}
		}, this);
		this.l1spotter_a.events.onInputOut.add(function overGate1(){
			if(this.spotterDragging == true){
				this.l1spotter_aOver.visible = false;
			}
		}, this);

		//spotter b hit area
		this.l1spotter_b = this.game.add.sprite(416, 361, 'l1spotter_b');
		this.l1spotter_b.inputEnabled = true;
		this.l1spotter_b.input.pixelPerfectOver = true;
		this.l1spotter_b.events.onInputOver.add(function overGate1(){
			if(this.spotterDragging == true){
				this.l1spotter_bOver.visible = true;
			}
		}, this);
		this.l1spotter_b.events.onInputOut.add(function overGate1(){
			if(this.spotterDragging == true){
				this.l1spotter_bOver.visible = false;
			}
		}, this);
		*/

		this.l1gate_a.alpha=.1;
		this.l1gate_c.alpha=.1;
		

    },

    createLevel3: function(){

			//set up layering groups
			this.l1g9 = this.game.add.group();
			this.l1g8 = this.game.add.group();
			this.l1g7 = this.game.add.group();
			this.l1g6 = this.game.add.group();
			this.l1g5 = this.game.add.group();
			this.l1g4 = this.game.add.group();
			this.l1g3 = this.game.add.group();
			this.l1g2 = this.game.add.group();
			this.l1g1 = this.game.add.group();	

			//////temp////////////
			/*
			
			this.box = this.game.add.sprite(200, 200, 'forklift3', 'forklift3/0000');
			//this.box.visible = false;
			//this.box.scale.x *= -1;
			//this.box.tint = 0xffffff;
					
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

			//this.box.anchor.setTo(.5,.5);
			//this.l1g1.add(this.box);		
		    */
		    
			// end temp
		    ///////////////////////

		    
			//add racks
			//g2
			var r1 = this.game.add.sprite(259, 109, 'rack');
			r1.scale.x *= -1;
			this.l1g2.add(r1);
			
			//this.extra1 = this.game.add.sprite(-107, 83+35, 'extra1');
			//this.l1g3.add(this.extra1);
			//var extra1tween = this.game.add.tween(this.extra1).to( { x: 341, y: 717+35 }, 13000, "Linear", true, 4000);


			//g4
			var r2 = this.game.add.sprite(202, -395, 'rack');
			r2.scale.x *= -1;
			this.l1g4.add(r2);

			var r2b = this.game.add.sprite(487, 3, 'rack');
			r2b.scale.x *= -1;
			this.l1g4.add(r2b);


			//g5
			
			/*
			this.l1spotter_aOver = this.game.add.sprite(234, 41, 'l1spotter_aOver');
			this.l1spotter_aOver.visible = false;
			this.l1g6.add(this.l1spotter_aOver);

			this.l1spotter_aPlaced = this.game.add.sprite(252, 59, 'spotterPlaced');
			this.l1spotter_aPlaced.visible = false;
			this.l1g6.add(this.l1spotter_aPlaced);
			*/			
			

			this.l1gate_aOver = this.game.add.sprite(170, 63, 'l1gate_aOver');
			this.l1gate_aOver.visible = false;
			this.l1g5.add(this.l1gate_aOver);

			this.l1gate_aPlaced = this.game.add.sprite(186, 80, 'gatePlaced');
			this.l1gate_aPlaced.visible = false;
			this.l1g5.add(this.l1gate_aPlaced);

			this.l1gate_cOver = this.game.add.sprite(375, 279, 'l1gate_cOver');
			this.l1gate_cOver.visible = false;
			this.l1g5.add(this.l1gate_cOver);

			this.l1gate_cPlaced = this.game.add.sprite(391, 373, 'gatePlaced');
			this.l1gate_cPlaced.visible = false;
			this.l1g5.add(this.l1gate_cPlaced);

			/*
			this.l1spotter_bOver = this.game.add.sprite(502, 416, 'l2spotter_bOver');
			this.l1spotter_bOver.visible = false;
			this.l1g6.add(this.l1spotter_bOver);

			this.l1spotter_bPlaced = this.game.add.sprite(520, 434, 'spotterPlacedBack');
			this.l1spotter_bPlaced.visible = false;
			this.l1g6.add(this.l1spotter_bPlaced);
			*/


			//g6
			//this.forklift = this.game.add.sprite(10, -300, 'forklift3b');
			//this.forklift_ani = this.forklift.animations.add('lift', Phaser.Animation.generateFrameNames('forklift3/lift_', 0, 80, '', 4), 30, false, false);
			
			this.forkliftfront1Group = this.game.add.group();
			this.forkliftfront1Group.x = 40;
			this.forkliftfront1Group.y = -300;

			this.forklift1safety = this.game.add.sprite(-33, 60, 'forklift1safety');
			this.forkliftfront1Group.add(this.forklift1safety);

			this.forklift = this.game.add.sprite(0, 0, 'forklift3', 'forklift3/0000');
			this.forklift_ani = this.forklift.animations.add('lift', Phaser.Animation.generateFrameNames('forklift3/lift_', 0, 80, '', 4), 30, false, false);
			this.forkliftfront1Group.add(this.forklift);
			

			var r3 = this.game.add.sprite(381, -555, 'rack');
			r3.scale.x *= -1;
			this.l1g6.add(r3);

			var r3b = this.game.add.sprite(705, -100, 'rack');
			r3b.scale.x *= -1;
			this.l1g6.add(r3b);

			var box = this.game.add.sprite(465, 130, 'box3');
			box.alpha = .5;
    		this.game.add.tween(box).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
			

			//g7
			

			
			//g8
			var r4 = this.game.add.sprite(923, -208, 'rack');
			r4.scale.x *= -1;
			this.l1g8.add(r4);


			//g9
			

				
    },


    /////////// TEMP BUTTON
    pressStart: function (e) {
    

		this.start.scale.setTo(1, 1);
		
		
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
    	if(this.l1gate_a_active == true){
    		this.l1gate_a.inputEnabled = true;
			this.l1gate_a.input.pixelPerfectOver = true;
    	}
    	
    	

		if(this.l1gate_c_active == true){
			this.l1gate_c.inputEnabled = true;
			this.l1gate_c.input.pixelPerfectOver = true;
		}

    },

    deactivateGateHitAreas: function(){
    	this.l1gate_a.inputEnabled = false;
    	this.l1gate_c.inputEnabled = false;
		
    },

    activateSpotterHitAreas: function(){
    	
 
    },

    deactivateSpotterHitAreas: function(){
    	
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
				if(this.l1gate_aOver.visible == true){
					this.gateCount = this.gateCount + 1;
					this.gateplacedAudio();
					this.l1gate_a_active = false;
					this.l1gate_aPlaced.visible = true;
					this.l1gate_a.inputEnabled = false;
					this.l1gate_aOver.visible = false;
				} 
				if(this.l1gate_cOver.visible == true){
					this.gateCount = this.gateCount + 1;
					this.gateplacedAudio();
					this.l1gate_c_active = false;
					this.l1gate_cPlaced.visible = true;
					this.l1gate_c.inputEnabled = false;
					this.l1gate_cOver.visible = false;
				} 

				if(this.gateCount>0 && this.retreive.visible == false){
					this.retreive.alpha = 0;
					this.retreive.visible = true;
					this.game.add.tween(this.retreive).to( { alpha:1 }, 300, "Linear", true);
				}

				//reset gate
				if(this.gateCount < 2){
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
			
			this.GateGame_GatePlacement.play();
		}
	},

	spotterplacedAudio: function(){
		
		if (!this.game.cache.checkSoundKey('GateGame_SpotterPlacement')) {
			
			this.game.global.GateGame_SpotterPlacement_sound.play();
		} else {
			
			this.GateGame_SpotterPlacement.play();
		}
	},

	leveloverAudio: function(){
		
		if (!this.game.cache.checkSoundKey('GateGame_LevelUp')) {
			
			this.game.global.GateGame_LevelUp_sound.play();
		} else {
			
			this.GateGame_LevelUp.play();
		}
	},

	tryagainAudio: function(){
		
		if (!this.game.cache.checkSoundKey('GateGate_TryAgain')) {
			
			this.game.global.GateGate_TryAgain_sound.play();
		} else {
			
			this.GateGate_TryAgain.play();
		}
	},

	soundtrackAudio: function(){
		
		if (!this.game.cache.checkSoundKey('GateGameSoundtrack')) {
			
			this.game.globalGateGameSoundtrack_sound.play();
		} else {
		
			this.GateGameSoundtrack.play();
		}
	},


	

	endTimer: function() {
        // Stop the timer when the delayed event triggers

        console.log("END TIMER");

        this.timer.stop();
		//this.timeTxt.text = "0:00";  //:00     
		
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

