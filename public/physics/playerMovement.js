this.movetoPointer=function (displayObject, speed, pointer, maxTime) {

	if(displayObject==null){
		//console.log(displayObject);
	}else{
		//console.log("NO NULO");
		pointer = pointer;
		if (maxTime === undefined) { maxTime = 0; }
		var angle = this.angleToPointer(displayObject, pointer);
		if (maxTime > 0){
			//  We know how many pixels we need to move, but how fast?
			speed = this.distanceToPointer(displayObject, pointer) / (maxTime / 1000);
		}
		displayObject.velocity[0] = Math.cos(angle) * speed;
		displayObject.velocity[1] = Math.sin(angle) * speed;
		return angle;
	}

}

this.distanceToPointer =function (displayObject, pointer, world) {  ///esto no sirve

	if(displayObject==null){
		//console.log(displayObject);
    }else{
		//console.log("NO NULO");
        if (world === undefined) { world = false; }

        var dx = (world) ? displayObject.world.x - pointer.worldX : displayObject.playerBody.position[0] - pointer.worldX; //cannot read property 0 of undefined
        var dy = (world) ? displayObject.world.y - pointer.worldY : displayObject.playerBody.position[1] - pointer.worldY;

        return Math.sqrt(dx * dx + dy * dy);
	}
}

this.angleToPointer=function (displayObject, pointer, world) {

    if(displayObject==null){
		//console.log(displayObject);

    }else{

    
    	if (world === undefined) { world = false; }

        if (world){
            return Math.atan2(pointer.worldY - displayObject.world.y, pointer.worldX - displayObject.world.x);
        }
        else{
            return Math.atan2(pointer.worldY - displayObject.playerBody.position[1], 
			pointer.worldX - displayObject.playerBody.position[0]);
        }
	}
	
}

//we export these three functions 
this.exports = {
	movetoPointer: this.movetoPointer,
	distanceToPointer: this.distanceToPointer,
	angleToPointer: this.angleToPointer
}