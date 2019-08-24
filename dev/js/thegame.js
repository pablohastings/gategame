"use strict";
var theGame = function(game){

	this.ss;
	this.box;
	this.buttonSoundClick
	this.global_sfx_win;

	//configurable from dom
	this.gametime = window.gameTime;

};

theGame.prototype = {
  	create: function(){
  		console.log("theGame create():::::::::::::");

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
		
		
		//temp comp
		//this.ss = this.game.add.sprite(0, 0, 'comp1');
		//this.ss.alpha = 0;
	

		//game vars
		this.game.global.numberOfTriesLevel1 = 0;
		this.TimeMinutes = 10000;
  		this.TimeSeconds = 0;
		this.timer = this.game.time.create();
	    this.timerEvent = this.timer.add(Phaser.Timer.MINUTE * this.TimeMinutes + Phaser.Timer.SECOND * this.TimeSeconds, this.endTimer, this);
	    

		this.gateDragging = false;
		this.spotterDragging = false;

		this.gateCount = 0;
		this.spotterCount = 0;
		this.gatesNeeded = 4;
		this.spottersNeeded = 1;

		this.l1gate_a_active = true;
		this.l1gate_b_active = true;
		this.l1gate_c_active = true;
		this.l1gate_d_active = true;

		this.l1spotter_a_active = true;
		this.l1spotter_b_active = true;

  		this.createUi();
  		this.createIntro();

	},

	createIntro: function(){

		this.themeAudio();

		this.intrographicsCover = this.game.add.group();

    	this.intrographicsBack = this.game.add.graphics();
	    this.intrographicsBack.beginFill(0x000000, .7);
	    this.intrographicsBack.drawRect(0, 0, this.world.width, this.world.height);
	    this.intrographicsBack.endFill();
	    this.intrographicsCover.add(this.intrographicsBack);
	    
	    this.instructionText = this.game.add.sprite(0, 0, 'instructionText');
	    this.instructionText.visible = false;
	 

	    this.introtext = this.game.add.sprite(0, 0, 'introtext');
	    this.intrographicsCover.add(this.introtext);
	    this.introtext.visible = false;

	    this.game.time.events.add(200 + 1000, function(){
	    	this.introtext.visible = true;
	 	}, this);

	    this.intrologo = this.game.add.sprite(490, 242, 'intrologo');
	    this.intrographicsCover.add(this.intrologo);
	    this.intrologo.alpha = 0;
	    this.intrologo.anchor.setTo(.5,.5);
	    this.intrologo.scale.setTo(3,3);

	    //start button
    	this.startBtn = this.game.add.sprite(855, 480, 'startBtn');
    	this.startBtn.visible = false;
    	this.intrographicsCover.add(this.startBtn);
		this.startBtn.anchor.setTo(0.5, 0.5);
		this.startBtn.inputEnabled = true;
		this.startBtn.input.pixelPerfectOver = true;
		this.startBtn.input.useHandCursor = true;
		this.startBtn.events.onInputDown.add(function(){
			this.startBtn.scale.setTo(1, 1);
			//this.intrographicsCover.destroy();
			this.startBtn.visible = false;
			this.intrologo.visible = false;
			this.introtext.visible = false;

			//this.instructiionsgraphicsBack.visible = true;
			this.instructionText.visible = true;
			
			

			this.GateGameTheme.stop();
			this.game.global.GateGameTheme_sound.stop();

			if(this.game.global.soundtrackAudio){
				this.soundtrackAudio();
			}

		
	    	
	    	this.game.time.events.add(4500, function(){//200
				//start forklift down isle
				this.intrographicsCover.destroy();
				this.instructionText.destroy();
				//this.instructiionsgraphicsBack.destroy();

				this.instructionsBottomText.visible = true;
	    		this.instructiionsgraphicsBackBottom.visible = this.instructionsBottomText.visible = true;
	    this.instructiionsgraphicsBackBottom.visible = true;;

		    	this.forkliftMove();
	 		}, this);
		}, this);
		this.startBtn.events.onInputOver.add(function () {
			this.startBtn.scale.setTo(1.1, 1.1);
    	}, this);
		this.startBtn.events.onInputOut.add(function () {
			this.startBtn.scale.setTo(1, 1);
    	}, this);

	    this.game.add.tween(this.intrologo).to( { alpha: 1}, 300, "Linear", true, 1000);
	    this.game.add.tween(this.intrologo.scale).to( { x: 1, y: 1 }, 600, Phaser.Easing.Bounce.Out, true, 1000);
	    this.game.time.events.add(1600, function(){
				 this.startBtn.visible = true;
	 		}, this);
	   

	     


	},

    createUi: function(){
    	
    	//creates the hit areas for gates and spotters
		this.createLevel1HitAreas();

		//places the isles, gates, and spotters
    	this.createLevel1();

    	//temp button
    	/*
    	this.start = this.game.add.sprite(800, 430, 'calldomBtn');
		this.start.anchor.setTo(0.5, 0.5);
		this.start.inputEnabled = true;
		this.start.input.pixelPerfectOver = true;
		this.start.input.useHandCursor = true;
		this.start.events.onInputUp.add(this.pressStart, this);
		this.start.events.onInputOver.add(this.overStart, this);
		this.start.events.onInputOut.add(this.outStart, this);
		this.start.visible = false;
		*/

		//white cover on right side
		this.rightcover = this.game.add.sprite(59, 0, 'rightcover');

		//instructions
		/*
		this.instructiionsgraphicsBack = this.game.add.graphics();
	    this.instructiionsgraphicsBack.beginFill(0x000000, .7);
	    this.instructiionsgraphicsBack.drawRect(0, 0, this.world.width, this.world.height);
	    this.instructiionsgraphicsBack.endFill();
	    this.instructiionsgraphicsBack.visible = false;
		*/

		this.instructiionsgraphicsBackBottom = this.game.add.graphics();
	    this.instructiionsgraphicsBackBottom.beginFill(0x000000, .7);
	    this.instructiionsgraphicsBackBottom.drawRect(0, 510, this.world.width, 30);
	    this.instructiionsgraphicsBackBottom.endFill();
	    this.instructiionsgraphicsBackBottom.visible = false;

	    this.instructionsBottomText = this.game.add.bitmapText(this.world.width/2, 524, 'opensanslight', "Maintain the Zone of Safety by dragging GATES and SPOTTERS to the correct locations and click RETRIEVE when you're done. ", 21);
	    this.instructionsBottomText.visible = false;
	    this.instructionsBottomText.tint = 0xffffff;
	    this.instructionsBottomText.align = 'center';
	    this.instructionsBottomText.anchor.setTo(.5,.5);

	    

		//Interaction Widget
		this.interactionWidgetBack = this.game.add.sprite(755, 131, 'interactionWidgetBack');
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

	    this.greatwork1headerText = this.game.add.bitmapText(this.world.width/2, this.world.height/2 - 175, 'opensansextrabold', "GREAT WORK!", 64);
	    this.greatwork1headerText.visible = false;
	    this.greatwork1headerText.tint = 0xffffff;
	    this.greatwork1headerText.align = 'center';
	    this.greatwork1headerText.anchor.setTo(.5,.5);
	    this.greatwork1headerText.maxWidth = 690;

	    this.greatwork1Text = this.game.add.bitmapText(this.world.width/2, this.world.height/2, 'opensanslight', "Always ensure the opposing aisle is free of\ncustomers and associates before working\nwith products in the overheads.\nSpotters need to make sure nothing\ngets pushed out or shifted in\nthose overheads!", 45);
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
    	this.moveforkliftdownisleTween = this.game.add.tween(this.forkliftfront1Group).to( { x: 323, y: 262+35 }, 3000, Phaser.Easing.Linear.In, true);
    	this.movespotterdownisleTween = this.game.add.tween(this.spottertemp).to( { x: 323 + 55, y: 262 + 105 + 35 }, 3000, Phaser.Easing.Linear.In, true);
    	this.moveforkliftdownisleTween.onComplete.add(function(){
    		this.forklift1safetyTween = this.game.add.tween(this.forklift1safety).to( { alpha: 0 }, 200, Phaser.Easing.Linear.In, true);
    		this.moveforkliftdownisleTween2 = this.game.add.tween(this.forkliftfront1Group).to( { x: 313, y: 246+35 }, 500, Phaser.Easing.Linear.In, true);
	    	this.movespotterdownisleTween2 = this.game.add.tween(this.spottertemp).to( { x: 505, y: 560+35 }, 1400, Phaser.Easing.Linear.In, true);
    	

	    	this.moveforkliftdownisleTween2.onComplete.add(function(){
	    		this.forkliftfront1Group.visible = false;
	    		this.forklift.visible = true;

	    		this.forkliftInplace();
	    	}, this);
    	}, this);
    },

    forkliftInplace: function(){
    	this.activateLevel();
    },

    activateLevel: function(){
    	this.movewidget();
    	//this.retreive.visible = true;

  		this.timer.start();

    },

    movewidget: function(){
    	this.game.add.tween(this.interactionWidgetBack).from( { x: 955 }, 200, Phaser.Easing.Linear.In, true);
    	this.game.add.tween(this.gateIcon).from( { x: 1000 }, 200, Phaser.Easing.Linear.In, true);
    	this.game.add.tween(this.spotterIcon).from( { x: 1090 }, 200, Phaser.Easing.Linear.In, true);
    	this.gateIcon.visible = true;
    	this.spotterIcon.visible = true;
    	this.interactionWidgetBack.visible = true;

    },


    ///// BETWEEN-END OF LEVELS /////
    pressRetreive: function(e){
    	
    	this.retreive.scale.setTo(1, 1);
    	this.retreive.inputEnabled = false;

    	this.game.global.numberOfTriesLevel1 = this.game.global.numberOfTriesLevel1 + 1;

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
    	console.log('END LEVEL 1');
    	console.log('this.game.global.numberOfTriesLevel1:' + this.game.global.numberOfTriesLevel1);

    	if(this.game.global.soundtrackAudio){
				this.GateGameSoundtrack.stop();
				this.game.global.GateGameSoundtrack_sound.stop();
		}

    	this.leveloverAudio();

    	this.timer.stop();
    	this.game.global.numberTimeLevel1 = this.timeTaken;
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
    		///324::::177
    		this.game.add.tween(this.forklift).to( { x: 324, y: 177 }, 1000, Phaser.Easing.Linear.In, true);
    },

    pressNext: function(e){
    	this.nextBtn.scale.setTo(1, 1);
    	this.game.state.start("Level2");

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

    createLevel1HitAreas: function(){

    	//gate a hit area
		
		this.l1gate_a = this.game.add.sprite(113, 78+35, 'l1gate_a');
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



		//gate b hit area
		this.l1gate_b = this.game.add.sprite(340, -20+35, 'l1gate_a');
		this.l1gate_b.inputEnabled = true;
		this.l1gate_b.input.pixelPerfectOver = true;
		this.l1gate_b.events.onInputOver.add(function overGate1(){
			if(this.gateDragging == true){
				this.l1gate_bOver.visible = true;
			}
		}, this);
		this.l1gate_b.events.onInputOut.add(function overGate1(){
			if(this.gateDragging == true){
				this.l1gate_bOver.visible = false;
			}
		}, this);

		//this.l1gate_b.tint = 0xdbdada;

		//gate c hit area
		this.l1gate_c = this.game.add.sprite(330, 375+35, 'l1gate_a');
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

		//gate d hit area
		this.l1gate_d = this.game.add.sprite(545, 260+35, 'l1gate_a');
		this.l1gate_d.inputEnabled = true;
		this.l1gate_d.input.pixelPerfectOver = true;
		this.l1gate_d.events.onInputOver.add(function overGate1(){
			if(this.gateDragging == true){
				this.l1gate_dOver.visible = true;
			}
		}, this);
		this.l1gate_d.events.onInputOut.add(function overGate1(){
			if(this.gateDragging == true){
				this.l1gate_dOver.visible = false;
			}
		}, this);

		//spotter a hit area
		this.l1spotter_a = this.game.add.sprite(306, -14+35, 'l1spotter_a');
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
		this.l1spotter_b = this.game.add.sprite(552, 270+35, 'l1spotter_b');
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

		this.l1gate_a.alpha=.3;
		this.l1gate_b.alpha=1;
		this.l1gate_c.alpha=.3;
		this.l1gate_d.alpha=.3;
		this.l1spotter_a.alpha=1;
		this.l1spotter_b.alpha=.3;

    },

    createLevel1: function(){

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


			this.forkliftfront1Group = this.game.add.group();
			this.forkliftfront1Group.x = 16;
			this.forkliftfront1Group.y = -123;

			this.forklift1safety = this.game.add.sprite(-41, -4, 'forklift1safety');
			this.forkliftfront1Group.add(this.forklift1safety);
			
			this.forkliftfront1 = this.game.add.sprite(0, 0, 'forkliftfront1');//16, -123
			this.spottertemp = this.game.add.sprite(this.forkliftfront1Group.x + 55, this.forkliftfront1Group.y + 105, 'spotterPlaced');//45,90
			this.forkliftfront1Group.add(this.forkliftfront1);

			


			this.forklift = this.game.add.sprite(313, 183+35, 'forklift1', 'forklift1/0000');
			this.forklift.visible = false;
			this.forklift_ani = this.forklift.animations.add('lift', Phaser.Animation.generateFrameNames('forklift1/lift_', 1, 56, '', 4), 30, false, false);
			this.forklift_ani.onComplete.add(this.moveForkliftForward, this);
			//this.forklift.animations.play('lift');


			//////temp////////////

			this.box = this.game.add.sprite(220, 220+35, 'extra3');
			//this.box.tint = 0xffffff;
			this.box.visible = false;
			//this.box.anchor.x = 1;
			//this.box.anchor.y = 1;
		    this.game.physics.arcade.enable(this.box);
		    this.box.inputEnabled = true;
		    this.box.input.enableDrag(false, true, false);
	    	this.box.input.useHandCursor = true;
		    //this.box.visible = false;

		    
		    this.box.events.onDragStart.add(function(currentSprite){
		    	this.startDrag(currentSprite);    		
	    	}, this);

		    this.box.events.onDragStop.add(function(currentSprite){
		    	console.log(currentSprite.x + "::::" + currentSprite.y);
	      		this.stopDrag(currentSprite);
	    	}, this);

	    	//this.box.scale.x *= -1;
			//this.box.anchor.setTo(.5,.5);
			//this.l1g1.add(this.box);		
		    ///////////////////////


		    this.extra3 = this.game.add.sprite(964, 387, 'extra2');
			var extra3tween = this.game.add.tween(this.extra3).to( { x: 678, y: -41 }, 17000, "Linear", true, 15000);
			extra3tween.repeat(10, 48000);

			this.extra6 = this.game.add.sprite(964, 387, 'extra4');
			var extra6tween = this.game.add.tween(this.extra6).to( { x: 678, y: -41 }, 17000, "Linear", true, 35000);
			extra6tween.repeat(10, 48000);

			this.extra4 = this.game.add.sprite(222, 546, 'extra3');
			var extra4tween = this.game.add.tween(this.extra4).to( { x: -15, y: 200 }, 17000, "Linear", true, 12000);
			extra4tween.repeat(10, 18000);

			this.extra7 = this.game.add.sprite(222, 546, 'extra4');
			var extra7tween = this.game.add.tween(this.extra7).to( { x: -25, y: 190 }, 17000, "Linear", true, 24000);
			extra7tween.repeat(10, 18000);

			this.extra5 = this.game.add.sprite(615, -59, 'extra1');
			var extra5tween = this.game.add.tween(this.extra5).to( { x: 966, y: 467 }, 27000, "Linear", true, 29000);
			extra5tween.repeat(10, 8000);

	
		    
			//add racks
			//g1
			var r1 = this.game.add.sprite(-15, 433+35, 'rack');
			r1.scale.x *= -1;
			r1.anchor.setTo(.5,.5);
			this.l1g1.add(r1);
			

			this.extra1 = this.game.add.sprite(-107, 83+35, 'extra1');
			this.l1g2.add(this.extra1);
			this.extra1tween = this.game.add.tween(this.extra1).to( { x: 341, y: 717+35 }, 16000, "Linear", true, 4000);
			this.extra1tween.repeat(10, 8000);

			//g3
			var r2 = this.game.add.sprite(11, 45+35, 'rack');
			r2.scale.x *= -1;
			r2.anchor.setTo(.5,.5);
			this.l1g3.add(r2);

			var r2b = this.game.add.sprite(333, 500+35, 'rack');
			r2b.scale.x *= -1;
			r2b.anchor.setTo(.5,.5);
			this.l1g3.add(r2b);


			//g4
			this.l1gate_aOver = this.game.add.sprite(87, 90+35, 'l1gate_aOver');
			this.l1gate_aOver.visible = false;
			this.l1g4.add(this.l1gate_aOver);

			this.l1gate_aPlaced = this.game.add.sprite(103, 108+35, 'gatePlaced');
			this.l1gate_aPlaced.visible = false;
			this.l1g4.add(this.l1gate_aPlaced);

			this.l1gate_cOver = this.game.add.sprite(292, 297+35, 'l1gate_cOver');
			this.l1gate_cOver.visible = false;
			this.l1g4.add(this.l1gate_cOver);

			this.l1gate_cPlaced = this.game.add.sprite(308, 391+35, 'gatePlaced');
			this.l1gate_cPlaced.visible = false;
			this.l1g4.add(this.l1gate_cPlaced);

			//g5
			var r3 = this.game.add.sprite(190, -115+35, 'rack');
			r3.scale.x *= -1;
			r3.anchor.setTo(.5,.5);
			this.l1g5.add(r3);

			var r3b = this.game.add.sprite(513, 342+35, 'rack');
			r3b.scale.x *= -1;
			r3b.anchor.setTo(.5,.5);
			this.l1g5.add(r3b);

			var box = this.game.add.sprite(384, 150+35, 'box');
			box.alpha = .5;
    		this.game.add.tween(box).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
			//this.l1g5.add(box);


			//g6
			this.l1spotter_aOver = this.game.add.sprite(384, 12, 'l1spotter_aOver');
			this.l1spotter_aOver.visible = false;
			this.l1g6.add(this.l1spotter_aOver);

			this.l1spotter_aPlaced = this.game.add.sprite(403, 30, 'spotterPlaced');
			this.l1spotter_aPlaced.visible = false;
			this.l1g6.add(this.l1spotter_aPlaced);

			this.l1gate_bOver = this.game.add.sprite(304, 21, 'l1gate_aOver');
			this.l1gate_bOver.visible = false;
			this.l1g6.add(this.l1gate_bOver);

			this.l1gate_bPlaced = this.game.add.sprite(321, 38, 'gatePlaced');
			this.l1gate_bPlaced.visible = false;
			this.l1g6.add(this.l1gate_bPlaced);

			this.l1gate_dOver = this.game.add.sprite(512, 198+35, 'l1gate_cOver');
			this.l1gate_dOver.visible = false;
			this.l1g6.add(this.l1gate_dOver);

			this.l1gate_dPlaced = this.game.add.sprite(528, 290+35, 'gatePlaced');
			this.l1gate_dPlaced.visible = false;
			this.l1g6.add(this.l1gate_dPlaced);

			this.l1spotter_bOver = this.game.add.sprite(631, 328+35, 'l1spotter_aOver');//629 334
			this.l1spotter_bOver.visible = false;
			this.l1g6.add(this.l1spotter_bOver);

			this.l1spotter_bPlaced = this.game.add.sprite(648, 345+35, 'spotterPlaced');
			this.l1spotter_bPlaced.visible = false;
			this.l1g6.add(this.l1spotter_bPlaced);

			this.extra2 = this.game.add.sprite(793, 560+35, 'extra2');
			this.l1g6.add(this.extra2);
			//this.extra2tween = this.game.add.tween(this.extra2).to( { x: 680, y: 380 }, 10000, "Linear", true, 4000);


			//g7
			var r4 = this.game.add.sprite(407, -220+35, 'rack');
			r4.scale.x *= -1;
			r4.anchor.setTo(.5,.5);
			this.l1g7.add(r4);

			var r4b = this.game.add.sprite(729, 235+35, 'rack');
			r4b.scale.x *= -1;
			r4b.anchor.setTo(.5,.5);
			this.l1g7.add(r4b);

			//g9
			var r5 = this.game.add.sprite(407, -220+35, 'rack');
			r5.scale.x *= -1;
			r5.anchor.setTo(.5,.5);
			this.l1g9.add(r5);

			var r5b = this.game.add.sprite(895, 45+35, 'rack');
			r5b.scale.x *= -1;
			r5b.anchor.setTo(.5,.5);
			this.l1g9.add(r5b);

				
    },


    /////////// TEMP BUTTON
    pressStart: function (e) {
    	//this.buttonSoundClick.play();
		

		this.start.scale.setTo(1, 1);
		

		//window.endgame(101);
		
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
    	
    	if(this.l1gate_b_active == true){
			this.l1gate_b.inputEnabled = true;
			this.l1gate_b.input.pixelPerfectOver = true;
		}

		if(this.l1gate_c_active == true){
			this.l1gate_c.inputEnabled = true;
			this.l1gate_c.input.pixelPerfectOver = true;
		}

		if(this.l1gate_d_active == true){
			this.l1gate_d.inputEnabled = true;
			this.l1gate_d.input.pixelPerfectOver = true;
		}

    },

    deactivateGateHitAreas: function(){
    	this.l1gate_a.inputEnabled = false;
    	this.l1gate_b.inputEnabled = false;
    	this.l1gate_c.inputEnabled = false;
    	this.l1gate_d.inputEnabled = false;
		
    },

    activateSpotterHitAreas: function(){
    	if(this.l1spotter_a_active == true){
    		this.l1spotter_a.inputEnabled = true;
			this.l1spotter_a.input.pixelPerfectOver = true;
    	}

    	if(this.l1spotter_b_active == true){
    		this.l1spotter_b.inputEnabled = true;
			this.l1spotter_b.input.pixelPerfectOver = true;
    	}
 
    },

    deactivateSpotterHitAreas: function(){
    	this.l1spotter_a.inputEnabled = false;
    	this.l1spotter_b.inputEnabled = false;
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
            //console.log(Math.round((this.timer.ms) / 1000));
            this.timeTaken = Math.round((this.timer.ms) / 1000);
            //console.log('this.timeTaken:' + this.timeTaken);
		}
		

		//console.log(this.l1gate_a.input);

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
				} if(this.l1gate_bOver.visible == true){
					this.gateCount = this.gateCount + 1;
					this.gateplacedAudio();		
					this.l1gate_b_active = false;
					this.l1gate_bPlaced.visible = true;
					this.l1gate_b.inputEnabled = false;
					this.l1gate_bOver.visible = false;
				} if(this.l1gate_cOver.visible == true){
					this.gateCount = this.gateCount + 1;
					this.gateplacedAudio();
					this.l1gate_c_active = false;
					this.l1gate_cPlaced.visible = true;
					this.l1gate_c.inputEnabled = false;
					this.l1gate_cOver.visible = false;
				} if(this.l1gate_dOver.visible == true){
					this.gateCount = this.gateCount + 1;
					this.gateplacedAudio();
					this.l1gate_d_active = false;
					this.l1gate_dPlaced.visible = true;
					this.l1gate_d.inputEnabled = false;
					this.l1gate_dOver.visible = false;
				} else {

				}

				if(this.gateCount>0 && this.retreive.visible == false){
					this.retreive.alpha = 0;
					this.retreive.visible = true;
					this.game.add.tween(this.retreive).to( { alpha:1 }, 300, "Linear", true);
				}

				//reset gate
				if(this.gateCount < 4){
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
				if(this.l1spotter_aOver.visible == true){
					this.spotterCount = this.spotterCount + 1;
					this.spotterplacedAudio();
					this.l1spotter_a_active = false;
					this.l1spotter_aPlaced.visible = true;
					this.l1spotter_a.inputEnabled = false;
					this.l1spotter_aOver.visible = false;
				} if(this.l1spotter_bOver.visible == true){
					this.spotterCount = this.spotterCount + 1;
					this.spotterplacedAudio();
					this.l1spotter_b_active = false;
					this.l1spotter_bPlaced.visible = true;
					this.extra2tween = this.game.add.tween(this.extra2).to( { x: 680, y: 380+35 }, 7000, "Linear", true, 3000);
					this.l1spotter_b.inputEnabled = false;
					this.l1spotter_bOver.visible = false;
				} else {

				}

				if(this.spotterCount>0 && this.retreive.visible == false){
					this.retreive.alpha = 0;
					this.retreive.visible = true;
					this.game.add.tween(this.retreive).to( { alpha:1 }, 300, "Linear", true);
				}

				//reset spotter
				if(this.spotterCount < 2){
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

	themeAudio: function(){
		
		if (!this.game.cache.checkSoundKey('GateGameTheme')) {
			
			this.game.global.GateGameTheme_sound.play();
		} else {
			
			this.GateGameTheme.play();
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

