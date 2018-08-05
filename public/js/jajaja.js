function constrainVelocity(sprite, maxVelocity) {    
	if (!sprite || !sprite.body) {return;}    
	var body = sprite.body    
	var angle, 
	currVelocitySqr, vx, vy;    
	vx = body.data.velocity[0];    
	vy = body.data.velocity[1];    
	currVelocitySqr = vx * vx + vy * vy;    
	if (currVelocitySqr > maxVelocity * maxVelocity) {        
		angle = Math.atan2(vy, vx);        
		vx = Math.cos(angle) * maxVelocity;
		vy = Math.sin(angle) * maxVelocity;
		body.data.velocity[0] = vx;
		body.data.velocity[1] = vy;
}};