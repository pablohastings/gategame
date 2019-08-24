var preload = function(game){

	this.preloadscreen;
	this.preloadbar;
}

preload.prototype = {
	preload: function(){ 
        

        this.game.load.audio('GateGame_GatePlacement', 'assets/sounds/GateGame_GatePlacement.mp3');
        this.game.global.GateGame_GatePlacement_sound = new Howl({
          src: ['assets/sounds/GateGame_GatePlacement.mp3'],
          preload: true
        });

        this.game.load.audio('GateGame_LevelUp', 'assets/sounds/GateGame_LevelUp.mp3');
        this.game.global.GateGame_LevelUp_sound = new Howl({
          src: ['assets/sounds/GateGame_LevelUp.mp3'],
          preload: true
        });

        this.game.load.audio('GateGame_SpotterPlacement', 'assets/sounds/GateGame_SpotterPlacement.mp3');
        this.game.global.GateGame_SpotterPlacement_sound = new Howl({
          src: ['assets/sounds/GateGame_SpotterPlacement.mp3'],
          preload: true
        });

        this.game.load.audio('GateGameTheme', 'assets/sounds/GateGameTheme.mp3');
        this.game.global.GateGameTheme_sound = new Howl({
          src: ['assets/sounds/GateGameTheme.mp3'],
          preload: true
        });

        this.game.load.audio('GateGate_TryAgain', 'assets/sounds/GateGate_TryAgain.mp3');
        this.game.global.GateGate_TryAgain_sound = new Howl({
          src: ['assets/sounds/GateGate_TryAgain.mp3'],
          preload: true
        });

        if(this.game.global.soundtrackAudio == true){
            this.game.load.audio('GateGameSoundtrack', 'assets/sounds/soundtrack.mp3');
            this.game.global.GateGameSoundtrack_sound = new Howl({
              src: ['assets/sounds/soundtrack.mp3'],
              loop: true,
              preload: true
            });
        }
        
      
        this.game.load.bitmapFont('opensansbold', 'assets/fonts/opensansbold_0.png', 'assets/fonts/opensansbold.xml');
        this.game.load.bitmapFont('opensansextrabold', 'assets/fonts/opensansextrabold_0.png', 'assets/fonts/opensansextrabold.xml');
        this.game.load.bitmapFont('opensanslight', 'assets/fonts/opensanslight_0.png', 'assets/fonts/opensanslight.xml');

        this.game.load.image('forkliftfront1', 'assets/forkliftfront1.png');
        this.game.load.atlasJSONHash('forklift1', 'assets/forklift1.png', 'assets/forklift1.json');
        this.game.load.atlasJSONHash('forklift2', 'assets/forklift2.png', 'assets/forklift2.json');
        this.game.load.atlasJSONHash('forklift3', 'assets/forklift3.png', 'assets/forklift3.json');

        this.game.load.image('forklift1safety', 'assets/forklift1safety.png');
        this.game.load.image('forklift2safety', 'assets/forklift2safety.png');
        this.game.load.image('forklift2bsafety', 'assets/forklift2bsafety.png');


        this.game.load.atlasJSONHash('endbutton', 'assets/endbutton.png', 'assets/endbutton.json');
        this.game.load.image('endBtn', 'assets/endBtn.png');
        
        this.game.load.image('retreiveBtn', 'assets/retreiveBtn.png');
        this.game.load.image('nextBtn', 'assets/nextBtn.png');
        this.game.load.image('startBtn', 'assets/startBtn.png');

        
        this.game.load.image('intrologo', 'assets/intrologo.png');
        this.game.load.image('introtext', 'assets/introtext.png');
        this.game.load.image('instructionText', 'assets/instructionText.png');

        //start
       
        this.game.load.image('box', 'assets/box.png');
        this.game.load.image('box2', 'assets/box2.png');
        this.game.load.image('box3', 'assets/box3.png');
        this.game.load.image('calldomBtn', 'assets/calldomBtn.png');

        this.game.load.image('extra1', 'assets/extra1.png');
        this.game.load.image('extra2', 'assets/extra2.png');
        this.game.load.image('extra3', 'assets/extra3.png');
        this.game.load.image('extra4', 'assets/extra4.png');
        this.game.load.image('extra5', 'assets/extra5.png');
        this.game.load.image('extra6', 'assets/extra6.png');

        this.game.load.image('rack', 'assets/rack.png');
        this.game.load.image('rightcover', 'assets/rightcover.png');
        
        this.game.load.image('gateIcon', 'assets/gateIcon.png');
        this.game.load.image('spotterIcon', 'assets/spotterIcon.png');
        this.game.load.image('gateIconOver', 'assets/gateIconOver.png');
        this.game.load.image('spotterIconOver', 'assets/spotterIconOver.png');
        this.game.load.image('interactionWidgetBack', 'assets/interactionWidgetBack.png');
        

        this.game.load.image('l1gate_a', 'assets/l1gate_a.png');
        this.game.load.image('l1gate_aOver', 'assets/l1gate_aOver.png');
        this.game.load.image('l1gate_cOver', 'assets/l1gate_cOver.png');
        this.game.load.image('gatePlaced', 'assets/gatePlaced.png');

        this.game.load.image('l2gate_a', 'assets/l2gate_a.png');
        this.game.load.image('l2gate_b', 'assets/l2gate_b.png');
        this.game.load.image('l2gate_d', 'assets/l2gate_d.png');
        this.game.load.image('l2gate_aOver', 'assets/l2gate_aOver.png');
        this.game.load.image('l2gate_bOver', 'assets/l2gate_bOver.png');
        this.game.load.image('l2gate_fOver', 'assets/l2gate_fOver.png');
        this.game.load.image('gatePlaced2', 'assets/gatePlaced2.png');

        this.game.load.image('l1spotter_a', 'assets/l1spotter_a.png');
        this.game.load.image('l1spotter_aOver', 'assets/l1spotter_aOver.png');
        this.game.load.image('spotterPlaced', 'assets/spotterPlaced.png');
        this.game.load.image('spotterPlacedBack', 'assets/spotterPlacedBack.png');
        this.game.load.image('l1spotter_b', 'assets/l1spotter_b.png');

        this.game.load.image('l2spotter_a', 'assets/l2spotter_a.png');
        this.game.load.image('l2spotter_bOver', 'assets/l2spotter_bOver.png');


	},

   	create: function(){
		this.game.state.start("TheGame");//Level2TheGame
	}
}