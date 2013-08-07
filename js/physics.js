var world;

var SCALE = 30;

var D2R = Math.PI / 180;

var R2D = 180 / Math.PI;

var PI2 = Math.PI * 2;
var interval;

var b2Vec2 = Box2D.Common.Math.b2Vec2,
	b2BodyDef = Box2D.Dynamics.b2BodyDef,
	b2AABB = Box2D.Collision.b2AABB,
	b2Body = Box2D.Dynamics.b2Body,
	b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
	b2Fixture = Box2D.Dynamics.b2Fixture,
	b2World = Box2D.Dynamics.b2World,
	b2MassData = Box2D.Collision.Shapes.b2MassData,
	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
	b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
	b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef,
	b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape;

function initPhysics() {

	world = new b2World(
	new b2Vec2(9, 9) 
	, true 
	);

	createObjects();

	var w = window.innerWidth;
	var h = window.innerHeight;

	createBox(-20, h , w+20, 10, true);
	createBox(-20, -250 , w+20, 10, true);
	createBox(0,-250,5,h+1020, true);
	createBox(w,-250,5,h+1020, true);

	requestAnimFrame(update);
}

function createObjects() {
	for(var i=0;i<loadedImages.length;i++) {
		var img = loadedImages[i];
		var width = img.width / 2 ;
		var height = img.height / 2;
		if(img.impulse){
			height = img.height*.45;
			width = img.width*.45;
		}

        var x = img.x;
        var y = img.y;
        var body = createBox(x,y,width,height);
		body.m_userData = {img:img, width:width, height:height};
		if(img.impulse){
			body.GetBody().ApplyImpulse(new b2Vec2(0,Math.sin(90*(Math.PI/180))*100),body.GetBody().GetWorldCenter());
		}
	}
}

function createBox(x,y,width,height, static) {
	var bodyDef = new b2BodyDef;
	bodyDef.type = static ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;
	bodyDef.position.x = x / SCALE;
	bodyDef.position.y = y / SCALE;

	var fixDef = new b2FixtureDef;
 	fixDef.density = Math.random()*1+1;
 	fixDef.friction = Math.random()*.2+.2;
 	fixDef.restitution = Math.random()*.3+0;

	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox(width / SCALE, height / SCALE);
	return world.CreateBody(bodyDef).CreateFixture(fixDef);
}

var madeTopCover = false;

var physicsLoopCount = 0;

function drawObjects() {
	if(physicsLoopCount<59){
		physicsLoopCount++;
		physicsContext.clearRect(0,0,theWidth,theHeight);
	}
	else{
		var amount = Math.floor(Math.random()*10);
		for(var q=0;q<amount;q++){
			var w = Math.random()*(window.innerWidth*.7)+(window.innerWidth*.02);
			var h = Math.random()*(window.innerHeight*.2)+(window.innerHeight*.1);
			var tempX = Math.random()*(window.innerWidth-w);
			var tempY = Math.random()*(window.innerHeight-h);
			physicsContext.clearRect(tempX,tempY,w,h);
		}
	}
	if(!isMobile && Math.random()<.01){
		bgImage_update(false);
	}
	var i = 0;
	var insideCount = 0;
	var totalCount = 0;
	for (var b = world.m_bodyList; b; b = b.m_next) {
         for (var f = b.m_fixtureList; f; f = f.m_next) {
				if (f.m_userData) {
					f.m_userData.img.x = Math.floor((f.m_body.m_xf.position.x * SCALE));
					f.m_userData.img.y = Math.floor((f.m_body.m_xf.position.y * SCALE));

					if(f.m_userData.img.y>0) insideCount++;
					totalCount++;

					f.m_userData.img.r = ((Math.round(((f.m_body.m_sweep.a + PI2) % PI2) * R2D * 100) / 100)/360)*(Math.PI*2);

					f.m_userData.img.paint();
				}
        }
    }
    if(insideCount===totalCount && !madeTopCover){
		createBox(-20,0,theWidth+20,5, true);
		madeTopCover=true;
    }
};

function update() {

	updateMouseDrag();

	world.Step(
	1 / 60
	, 10 
	, 10 
	);

	drawObjects();

	world.ClearForces();

	requestAnimFrame(update);
}