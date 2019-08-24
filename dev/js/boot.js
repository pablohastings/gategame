var boot = function(game){
	
};
  
boot.prototype = {

	preload: function(){
          
	},
  
  create: function(){

  	Phaser.Device.whenReady(function () {
        console.log("Phaser.Device.whenReady");
     });

    
   	this.game.stage.backgroundColor = 0xCCCCCC;
 	  
     if(this.game.device.desktop) {
       console.log("desktop");
       this.game.global.uDevice = "desktop";
     } else {
       console.log("mobile");
       this.game.global.uDevice = "mobile";
       this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    }

    
		//this.scale.pageAlignHorizontally = true;
    //this.scale.pageAlignVertically = true;
		
		this.game.state.start("Preload");
		
	}
}