var yt=Object.defineProperty;var wt=(c,t,e)=>t in c?yt(c,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):c[t]=e;var st=(c,t,e)=>(wt(c,typeof t!="symbol"?t+"":t,e),e);import{request as bt}from"https://cdn.skypack.dev/@octokit/request";import{G as nt,V as r,M as xt,p as E,S as ot,a as at,b as rt,Q as L,C as q,c as A,d as Pt,W as vt,P as Tt,O as At,e as kt,A as Rt,f as Mt,g as Ot,h as N}from"./vendor.6df85783.js";const St=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerpolicy&&(n.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?n.credentials="include":s.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(s){if(s.ep)return;s.ep=!0;const n=e(s);fetch(s.href,n)}};St();const It={owner:"ColbyBaker",userURL:"https://api.github.com/repos/ColbyBaker/",personalSiteDescription:"",getRepo:async function(c){return await bt(`GET /repos/${this.owner}/${c}`,{})}},Ct=["payroll-frontend","Atlas","jamming","ravenous","Personal_Site","BossMachine"];class zt extends React.Component{constructor(t){super(t);this.state={}}render(){const t=this.props.repo;return React.createElement("div",{className:"repo-card"},React.createElement("a",{href:t.html_url},t.name),React.createElement("p",null,t.description))}}class Ft extends React.Component{constructor(t){super(t);this.state={repos:[]}}componentDidMount(){Ct.forEach(t=>{It.getRepo(t).then(e=>{t=="Personal_Site"&&(e.data.description="The code for the site you're on right now!"),this.setState({repos:[...this.state.repos,e.data]})})})}render(){let t;return this.state.repos.length>0&&(t=this.state.repos.map(e=>React.createElement(zt,{repo:e,key:e.id}))),React.createElement("div",{className:"github-cards"},t)}}const Et=document.querySelector("#react-github-cards");ReactDOM.render(React.createElement(Ft,null),Et);const ht=new nt;class f{constructor(t,e=!1){this._position=new r(t[0],t[1],t[2]),this._scale=new r(1,1,1),this.inAnimation=e}static distance(t,e){var i=e.x-t.x,s=e.y-t.y,n=e.z-t.z;return Math.hypot(i,s,n)}static loadRocketModel(){const t="/assets/rocket.glb";return new Promise((e,i)=>{ht.load(t,s=>{let n=s.scene;e(n)},void 0,s=>{console.error("An error happened while loading a glb",s),i(s)})}).then(e=>(this.rocketModel=e,e))}static getRocketModel(t,e){let i=this.rocketModel.clone();return i.scale.set(e.x,e.y,e.z),i.position.set(t.x,t.y,t.z),i}asyncLoadModel(t,e,i){const s="/assets/"+t;return new Promise((n,o)=>{ht.load(s,a=>{let h=a.scene;h.scale.set(i.x,i.y,i.z),h.position.set(e.x,e.y,e.z),n(h)},void 0,a=>{console.error("An error happened while loading a glb",a),o(a)})})}}st(f,"rocketModel");class U extends f{constructor(t,e=!0,i=!1,s=new r){super(t,i);this._scale=new r(.8,1,.8),this._scale.multiplyScalar(1),this.fileName="rocket.glb",this._model,this._sceneMin=-700,this._sceneMax=700,this._velocity=new r(s[0],s[1],s[2]),this._velocity.x===0&&this._velocity.y,this._velocity.z===0&&this._velocity.randomDirection(),this._velocity=this.setMagnitude(this._velocity,1),this._acceleration=new r,this.flocking=e,this._lastPosition=new r,this._nextPosition=this._position.clone(),this.inOrbit=!1,this._orbitRadius,this._theta,this._deltaTheta,this._orbitYHeight,this._perception=20,this._maxForce=.01,this._maxSpeed=.8,this._alignmentScalar=1.7,this._cohesionScalar=.5,this._separationScalar=.2,document.getElementById("alignment").value=this._alignmentScalar,document.getElementById("cohesion").value=this._cohesionScalar,document.getElementById("separation").value=this._separationScalar,document.getElementById("perception").value=this._perception,document.getElementById("maxForce").value=this._maxForce,document.getElementById("maxSpeed").value=this._maxSpeed}_getLocalRockets(t){return t.filter((i,s)=>{const n=f.distance(this.position,t[s].position);return n===0?!1:n<=this._perception})}_alignment(t){let e=new r;for(let i of t)e.add(i.velocity);return e.divideScalar(t.length),e=this.setMagnitude(e,1),e.sub(this.velocity),e=this.limit(e,this._maxForce),e}_cohesion(t){let e=new r;for(let s of t)e.add(s.position);e.divideScalar(t.length);let i=e.sub(this.position);return i=e.sub(this.velocity),i=this.setMagnitude(i,this._maxSpeed),i=this.limit(i,this._maxForce),i}_separation(t){let e=new r;for(let s of t){const n=f.distance(this.position,s.position);let o=new r(this.position);o.sub(s.position),o.divideScalar(n*n),e.add(o)}let i=e.sub(this.velocity);return i=this.setMagnitude(i,this._maxSpeed),i=this.limit(i,this._maxForce),i}_aviodWalls(){this.position.x>this._sceneMax?this._position.x=this._sceneMin:this.position.x<this._sceneMin&&(this._position.x=this._sceneMax),this.position.y>this._sceneMax?this._position.y=this._sceneMin:this.position.y<this._sceneMin&&(this._position.y=this._sceneMax),this.position.z>this._sceneMax?this._position.z=this._sceneMin:this.position.z<this._sceneMin&&(this._position.z=this._sceneMax)}_pointForwards(){const t=new xt;t.lookAt(new r(0,0,0),this.velocity,new r(0,1,0)),this._model.quaternion.setFromRotationMatrix(t)}_flock(t){const e=this._getLocalRockets(t);e.length!==0&&(this._updateScalars(),this._acceleration.add(this._alignment(e).multiplyScalar(this._alignmentScalar)),this._acceleration.add(this._cohesion(e).multiplyScalar(this._cohesionScalar)),this._acceleration.add(this._separation(e).multiplyScalar(this._separationScalar)))}_orbit(){this._nextPosition.x=this._orbitRadius*Math.cos(this._theta),this._nextPosition.z=this._orbitRadius*Math.sin(this._theta),this._theta+=this._deltaTheta}setOrbit(t,e,i,s){this.inOrbit=!0,this._orbitYHeight=s,this._orbitRadius=t,this._deltaTheta=2*Math.PI/i*.01,this._theta=e+this._deltaTheta*8}update(t){this._acceleration.multiplyScalar(0),!this.inAnimation&&!this.inOrbit?(this._flock(t),this._position.add(this.limit(this._velocity,this._maxSpeed)),this._velocity.add(this._acceleration),this._aviodWalls()):this.inAnimation?(this._position.set(this._nextPosition.x,this._nextPosition.y,this._nextPosition.z),this._velocity=new r(this._position.x-this._lastPosition.x,this._position.y-this._lastPosition.y,this._position.z-this._lastPosition.z)):this.inOrbit&&(this._orbit(),this._position.set(this._nextPosition.x,this._orbitYHeight,this._nextPosition.z),this._velocity=new r(this._position.x-this._lastPosition.x,this._position.y-this._lastPosition.y,this._position.z-this._lastPosition.z)),this._pointForwards(),this._lastPosition.set(this.position.x,this.position.y,this.position.z),this._model.position.set(this._position.x,this._position.y,this._position.z)}_updateScalars(){let t=document.getElementById("alignment").value;t=Math.round(t*100)/100,t!=this._alignmentScalar&&console.log(`Alignment: ${t}`),this._alignmentScalar=t;let e=document.getElementById("cohesion").value;e=Math.round(e*100)/100,e!=this._cohesionScalar&&console.log(`Cohesion: ${e}`),this._cohesionScalar=e;let i=document.getElementById("separation").value;i=Math.round(i*100)/100,i!=this._separationScalar&&console.log(`separation: ${i}`),this._separationScalar=i;let s=document.getElementById("perception").value;s=Math.round(s*100)/100,s!=this._perception&&console.log(`perception: ${s}`),this._perception=s;let n=document.getElementById("maxForce").value;n=Math.round(n*100)/100,n!=this._maxForce&&console.log(`maxForce: ${n}`),this._maxForce=n;let o=document.getElementById("maxSpeed").value;o=Math.round(o*100)/100,o!=this._maxSpeed&&console.log(`maxSpeed: ${o}`),this._maxSpeed=o}set nextPosition(t){this._nextPosition.set(t.x,t.y,t.z)}get position(){const t=new r;return t.copy(this._position),t}set position(t){this._position=t}get theta(){return this._theta}get orbitRadius(){return this._orbitRadius}get orbitYHeight(){return this._orbitYHeight}get velocity(){return this._velocity}get model(){return this._model}setMagnitude(t,e){let i=new E.Vector(t.x,t.y,t.z);return i.setMag(e),new r(i.x,i.y,i.z)}limit(t,e){let i=new E.Vector(t.x,t.y,t.z);return i.limit(e),new r(i.x,i.y,i.z)}getRocketModel(){const t=f.getRocketModel(this.position,this._scale);return this._model=t,t}asyncLoadModel(){return super.asyncLoadModel(this.fileName,this._position,this._scale).then(t=>(this._model=t,t))}}class m extends f{constructor(t,e,i,s){super([0,0,0]);this._radius=t*.5,this._theta=s,this._deltaTheta=2*Math.PI/i*.01,this._scale.multiplyScalar(30),this.fileName=e,this._isLoading=!0,this._model}rotate(){this._model.rotation.y+=.002}orbit(){this._theta+=this._deltaTheta,this._position.x=this._radius*Math.cos(this._theta),this._position.z=this._radius*Math.sin(this._theta)}update(){this.rotate(),this.orbit(),this._model.position.set(this._position.x,this._position.y,this._position.z)}get model(){return this._model}get position(){const t=new r;return t.copy(this._position),t}get deltaTheta(){return this._deltaTheta}get theta(){const t=this._position;return Math.atan2(t.z,t.x)}get radius(){return this._radius}set theta(t){this._theta=t}asyncLoadModel(){return super.asyncLoadModel(this.fileName,[0,0,0],this._scale).then(t=>(this.fileName==="saturn.glb"&&(t.rotation.x+=.15),t.rotation.y=90,this._model=t,t)).then(this._isLoading=!1)}}class Lt extends m{constructor(t,e,i){super(t,"",e,i)}update(){this.orbit(),this._position.set(this._position.x,this._position.y,this._position.z)}orbit(){super.orbit()}asyncLoadModel(){}}class qt extends m{constructor(t,e,i,s,n,o,a){super(t,e,i,s);this._moonTheta=a,this._moonRadius=n,this._moonDeltaTheta=2*Math.PI/o}orbit(){let t=new E.Vector(0,0,0);this._theta+=this._deltaTheta,t.x=this._radius*Math.cos(this._theta),t.z=this._radius*Math.sin(this._theta),this._moonTheta+=this._moonDeltaTheta,t.x+=this._moonRadius*Math.cos(this._moonTheta),t.z+=this._moonRadius*Math.sin(this._moonTheta),this._position.x=t.x,this._position.z=t.z}rotate(){this._model.rotation.y+=.003}}class jt{constructor(t){this._camera=t,this._currentPosition=new r,this._currentLookat=new r,this._target,this._offsetBeforeTransition=new r,this._defaultOffset=new r(0,-2,17),this._offset=new r,this._offset.copy(this._defaultOffset),this._saturnOffsetModifier=new r(30,4,8),this._defaultLookAt=new r(0,-4,0),this._lookAt=new r,this._lookAt.copy(this._defaultLookAt),this._saturnLookAtModifier=new r(0,-8,0),this._onMobile=!1,this._mobileOffsetBias=1.4,this._mobileLookAtBias=2}update(){window.innerHeight<600||window.innerWidth<600?this._onMobile=!0:this._onMobile=!1;const t=this._calculateIdealOffset(),e=this._calculateIdealLookAT();this._currentPosition.copy(t),this._currentLookat.copy(e),this._camera.position.copy(this._currentPosition),this._camera.lookAt(this._currentLookat)}_calculateIdealOffset(){let t=new r(this._offset.x,this._offset.y,this._offset.z);return this._target.fileName==="saturn.glb"&&t.add(this._saturnOffsetModifier),this._onMobile&&t.multiplyScalar(this._mobileOffsetBias),t.add(this._target.position),t}_calculateIdealLookAT(){let t=new r(this._lookAt.x,this._lookAt.y,this._lookAt.z);return this._target.fileName==="saturn.glb"&&t.add(this._saturnLookAtModifier),this._onMobile&&t.multiplyScalar(this._mobileLookAtBias),t.x+=this._target.position.x,t.y+=this._target.position.y,t.z+=this._target.position.z,t}setTarget(t){this._target=t}setOffsetToDefault(){this._offset.copy(this._defaultOffset)}set offset(t){this._offset.copy(t)}get defaultOffset(){const t=new r;return t.copy(this._defaultOffset),t}get targetPosition(){return new r(this._target.position.x,this._target.position.y,this._target.position.z)}set offsetBeforeTransition(t){this._offsetBeforeTransition.copy(t)}get offsetBeforeTransition(){return this._offsetBeforeTransition.clone()}get target(){return this._target}get offset(){return new r(this._offset.x,this._offset.y,this._offset.z)}get radius(){return f.distance(this._currentPosition,new r(0,0,0))}get theta(){const t=this._currentPosition;return Math.atan2(t.z,t.x)}get thetaRelativeToPlanet(){return Math.atan2(this._offset.z,this._offset.x)}get position(){return new r(this._currentPosition.x,this._currentPosition.y,this._currentPosition.z)}}class W extends f{constructor(t,e=!0){super(t,e)}set position(t){this._position.copy(t)}get position(){let t=new r;return t.copy(this._position),t}}class Bt{constructor(t,e){this._scene=t,this._thirdPersonCamera=e,this.inAnimation=!1,this.inNavbarAnimation=!1,this._animatedObjectsArray=[],this._currentAnimations=[],this._animationQueue=[],this._usedSequenceIDs=[]}update(){this.inAnimation&&this._handleAllCurrentAnimations()}_handleAllCurrentAnimations(){this._currentAnimations.forEach((t,e)=>{this._animationExpired(t)&&this._removeAnimation(e)}),this._handleAnimationQueue(),this._currentAnimations.forEach((t,e)=>{if(t.playhead<0){t.playhead+=t.stepRate;return}switch(t.animationType){case"path":this._handleRocketPathAnimation(e);break;case"cameraTargetPath":this._handleCameraTargetPathAnimation(e);break;case"cameraTargetAndFollow":this._handleCameraTargetAndFolowAnimation(e);break;case"cameraTargetChange":this._handleCameraTargetChange(e);break;case"rocketToOrbit":this._handleRocketToOrbit(e);break;case"navbarTrigger":this._handleNavbarTrigger(e);break;case"other":this._handleOtherAnimation(e);break}})}_handleAnimationQueue(){this._usedSequenceIDs.forEach(t=>{let e=1/0;this._currentAnimations.forEach(i=>{i.sequenceID===t&&i.waitForAnimationToFinish&&(e=i.sequenceGroup)}),this._animationQueue.forEach(i=>{i.sequenceID===t&&i.sequenceGroup<e&&(e=i.sequenceGroup)}),this._animationQueue.forEach((i,s)=>{i.sequenceID===t&&i.sequenceGroup<=e&&(this._currentAnimations.push(i),this._animationQueue.splice(s,1))})})}_handleOtherAnimation(t){const e=this._currentAnimations[t];e.playhead+=e.stepRate}_handleRocketPathAnimation(t){const e=this._currentAnimations[t],i=this._animatedObjectsArray[e.animatedObjects.movingObjectIndex];e.firstFrame&&(i.inAnimation=!0,e.firstFrame=!1);const n=this._animatedObjectsArray[e.animatedObjects.pathIndex].getPoint(e.playhead);i.nextPosition=n,e.playhead+=e.stepRate}_handleCameraTargetPathAnimation(t){const e=this._currentAnimations[t],i=e.animatedObjects.targetIndex,s=this._animatedObjectsArray[i];e.firstFrame&&(s.inAnimation=!0,e.firstFrame=!1);const o=this._animatedObjectsArray[e.animatedObjects.pathIndex].getPoint(e.playhead);s.position=o,e.playhead+=e.stepRate}_handleCameraTargetAndFolowAnimation(t){const e=this._currentAnimations[t];e.firstFrame&&(this._thirdPersonCamera.setTarget(this._animatedObjectsArray[0]),e.firstFrame=!1),e.playhead+=e.stepRate}_handleCameraTargetChange(t){const e=this._currentAnimations[t],i=this._animatedObjectsArray[e.params.newTargetIndex];if(e.firstFrame){const s=this.getVector(i.position,this._thirdPersonCamera.position);this._thirdPersonCamera.offsetBeforeTransition=s,this._thirdPersonCamera.offset=s,this._thirdPersonCamera.setTarget(i),e.playhead+=e.stepRate,e.firstFrame=!1}else{const s=new r;s.lerpVectors(this._thirdPersonCamera.offsetBeforeTransition,this._thirdPersonCamera.defaultOffset,e.playhead),this._thirdPersonCamera.offset=s,e.playhead+=e.stepRate}}_handleRocketToOrbit(t){const e=this._currentAnimations[t],i=this._animatedObjectsArray[e.animatedObjects.rocketIndex],s=e.params;e.firstFrame&&(i.setOrbit(s.radius,s.theta,s.stepRate,s.yValue),e.firstFrame=!1),e.playhead+=e.stepRate}_handleNavbarTrigger(t){const e=this._currentAnimations[t];e.firstFrame&&(this.inNavbarAnimation=e.params.inNavbarAnimation,e.firstFrame=!1)}_animationExpired(t){return t.playhead>=t.totalTime}_addAnimation(t,e,i,s=!0,n={},o={},a=.001,h="other",l=0){this.inAnimation=!0;const d=0-l;this._usedSequenceIDs.includes(t)||this._usedSequenceIDs.push(t);let u={sequenceID:t,sequenceGroup:e,waitForAnimationToFinish:s,animatedObjects:n,params:o,params:o,playhead:d,stepRate:a,totalTime:i,animationType:h,firstFrame:!0};this._animationQueue.push(u)}_addRocketPathAnimation(t,e,i,s,n=1,o=.001,a="path"){const h=this._animatedObjectsArray.push(s)-1,l=this._animatedObjectsArray.push(i)-1,d=!0,u={movingObjectIndex:h,pathIndex:l};this._addAnimation(t,e,n,d,u,{},o,a)}_addCameraTargetPathAnimation(t,e,i,s,n=1,o=.001,a="cameraTargetPath"){const h=this._animatedObjectsArray.push(s)-1,l=this._animatedObjectsArray.push(i)-1,d=!0;s.inAnimation=!0;const u={targetIndex:h,pathIndex:l};this._addAnimation(t,e,n,d,u,{},o,a)}_addCameraTargetChange(t,e,i,s=0,n=0,o=0,a="cameraTargetChange"){const l={newTargetIndex:this._animatedObjectsArray.push(i)-1};this._addAnimation(t,e,s,!1,{},l,n,a,o)}_addRocketToOrbit(t,e,i,s,n,o,a,h=0){const d={rocketIndex:this._animatedObjectsArray.push(i)-1},u={theta:s,stepRate:n,radius:o,yValue:a};this._addAnimation(t,e,.5,!1,d,u,.1,"rocketToOrbit",h)}_addNavbarTrigger(t,e,i){const s={inNavbarAnimation:i};this._addAnimation(t,e,.1,!1,{},s,.1,"navbarTrigger")}_removeAnimation(t){const e=this._currentAnimations[t],i=e.sequenceID;if(this._currentAnimations.splice(t,1),e.animatedObjects)for(const n in e.animatedObjects){const o=e.animatedObjects[n],a=this._animatedObjectsArray[o];a.inAnimation=!1,this._animatedObjectsArray.splice(o,1,null)}if(e.params)for(const n in e.params){const o=e.params[n];this._animatedObjectsArray.splice(o,1,null)}let s=!1;this._currentAnimations.forEach(n=>{n.sequenceID===i&&(s=!0)}),this._animationQueue.forEach(n=>{n.sequenceID===i&&(s=!0)}),s||(this._usedSequenceIDs=this._usedSequenceIDs.filter(n=>n!=i))}_getUniqueSequenceID(){let t=!0,e=0;for(;t;)e++,t=this._usedSequenceIDs.includes(e);return this._usedSequenceIDs.push(e),e}getTestPoint(t){const e=new ot(.5,24,24),i=new at({color:16711680}),s=new rt(e,i);s.position.set(t.x,t.y,t.z),this._scene.add(s)}getRadialPosition(t,e,i=-2){const s=e*Math.cos(t),n=e*Math.sin(t);return new r(s,i,n)}modifyPositionUsingTheta(t,e,i=0){t.x,t.z;const s=e,n=Math.cos(s)-Math.sin(s),o=Math.sin(s)+Math.cos(s);return new r(n,i,o)}getVector(t,e){return new r(e.x-t.x,e.y-t.y,e.z-t.z)}getQuaternionFromVectors(t,e,i=new r){const s=new r;s.copy(t),s.sub(i),s.normalize();const n=new r;n.copy(e),n.sub(i),n.normalize();let o=new L;return o.setFromUnitVectors(s,n),o}getScalarFromVectors(t,e,i){const s=new r;s.copy(t);const n=new r;n.copy(e),i&&(s.sub(i),n.sub(i));const o=this.getQuaternionFromVectors(s,n);return s.applyQuaternion(o),n.divide(s)}getPositionUsingQuaternion(t,e,i,s){const n=new r;return n.copy(t),n.sub(e),n.applyQuaternion(i),n.multiplyScalar(s),n.add(e),n}launchNewRocketToPlanet(t,e){this.inNavbarAnimation=!0;const i=this._getUniqueSequenceID(),s=this._thirdPersonCamera.targetPosition,n=new W([s.x,s.y,s.z]);let[o,a,h]=this._launchRocketFromPlanet(i,t,n),l=h+=1;h=this._flyRocketToPlanet(i,l,t,n,e,o,a),this._addNavbarTrigger(i,h+1,!1)}launchNewRocketToOrbit(t){this.inNavbarAnimation=!0;const e=this._getUniqueSequenceID,i=this._thirdPersonCamera.targetPosition,s=1.1,n=250,o=20,a=100,h=new W([i.x,i.y,i.z]);let[l,d,u]=this._launchRocketFromPlanet(e,t,h);u=this._moveRocketToOrbit(e,u,d,l,t,h,s,a,n,o),this._addNavbarTrigger(e,u+1,!1)}moveRocketToPlanet(t,e){this.inNavbarAnimation=!0;const i=this._getUniqueSequenceID,s=this._thirdPersonCamera.targetPosition,n=new W([s.x,s.y,s.z]);t.inOrbit=!1;const o=t.position,a=this.getRadialPosition(t.theta-.6,t.orbitRadius,t.orbitYHeight-60);this._addCameraTargetChange(i,1,n,1,.01);let h=this._flyRocketToPlanet(i,1,t,n,e,a,o);this._addNavbarTrigger(i,h+1,!1)}_launchRocketFromPlanet(t,e,i){const s=this._thirdPersonCamera.position,n=this._thirdPersonCamera.target.position;let o=new L,a=new L,h=new L,l=new L,d,u,_,y;this._thirdPersonCamera._target.fileName!="saturn.glb"?(o.set(-.042749690783808636,.7740255589161532,.0910618304607239,.6251117029104221),a.set(-.47758778857662715,.6817708103503712,.08020833062945544,.5483293627504555),h.set(.09619301751625357,.44899411012929447,.05282283648579934,.8867699478421195),l.set(.05077657566513715,.033260032158517625,.003912944959825603,.9981483850040926),d=.074319895,u=1.56,_=1.235886,y=.8089725):(o.set(-.2013205941974495,.9605548788221911,.16474032273116399,.09831057516515629),a.set(-.25185770712098016,-.6013581402603341,.3503378997660027,.6724577596354593),h.set(.1853652156001544,-.29400754924492767,-.19891765478059095,.9163138460424404),l.set(.017761023103334977,-.035978943782180785,-.018434912221427513,.9990246321658088),d=.45,u=1.55,_=1.4,y=1);const w=this.getPositionUsingQuaternion(s,n,o,d),F=this.getPositionUsingQuaternion(s,n,a,u),T=this.getPositionUsingQuaternion(s,n,h,_),j=this.getPositionUsingQuaternion(s,n,l,y);let g=new q(w,F,T,j),B=1;return this._addRocketPathAnimation(t,B,g,e,1,.006,"path"),this._addCameraTargetChange(t,B,i,1,.01),this._addCameraTargetPathAnimation(t,B,g,i,1,.006),[T,j,B]}_launchRocketFromSaturn(t,e,i){return[point3,point4,sequenceGroup]}_flyRocketToPlanet(t,e,i,s,n,o,a){let h=this.getVector(o,a);h.add(a),h.y+=2;const l=new r(0,70,0),d=new r,u=new r;d.copy(n.position),u.copy(n.position),d.x-=10;let _=new q(a,h,l,d),y=new q(a,h,l,u),w=e;return this._addRocketPathAnimation(t,w,_,i,1,.005,"path"),this._addCameraTargetPathAnimation(t,w,y,s,1,.005),this._addCameraTargetChange(t,w,n,.1,.01,2),w}_moveRocketToOrbit(t,e,i,s,n,o,a,h,l,d){const u=this.getRadialPosition(a,l,d);let _=this.getVector(s,i);_.multiplyScalar(4),_.y+=10,_.add(i);const y=this.getRadialPosition(a-.7,l+30,d+10);let w=new q(i,_,y,u),F=new r;F.copy(_),F.y+=15;let T=new r;T.copy(y),T.y+=15;let j=new q(i,F,T,u),g=e+1;return this._addRocketPathAnimation(t,g,w,n,1,.003,"path"),this._addCameraTargetPathAnimation(t,g,j,o,1,.003),g++,this._addCameraTargetChange(t,g,n,.5,.01),this._addRocketToOrbit(t,g,n,a,h,l,d),g}}let ct=!0,$=!1,b,p,P,k,R,lt,Y,K,X,Z,D,J,G=()=>{},dt=()=>{},Q=()=>{},tt=()=>{};document.getElementById("addRocket").addEventListener("click",()=>{const c=document.getElementById("inputNumberRockets").value;tt(c)});let Nt=new m(0,"sun.glb",1e3,0),Dt=new m(65,"mercury.glb",241,.73),Gt=new m(100,"venus.glb",615,4.4),V=new m(155,"earth.glb",1e3,5.4),ut=new qt(155,"moon.glb",1e3,5.4,8,1700,-1),H=new m(210,"mars.glb",1880,-1.9),Qt=new m(275,"jupiter.glb",11900,3.85),et=new m(345,"saturn.glb",29400,-3.82),Vt=new m(405,"uranus.glb",83700,.79),Ht=new m(455,"neptune.glb",163700,4.76),Ut=new m(510,"pluto.glb",247900,-4.57),Wt=new Lt(520,4e3,1),x,mt=document.getElementById("launch-home");mt.addEventListener("click",()=>{x==="#resume"?Q(V):G(V),x="#home"});let _t=document.getElementById("launch-projects");_t.addEventListener("click",()=>{x==="#resume"?Q(H):G(H),x="#projects"});let pt=document.getElementById("launch-about-me");pt.addEventListener("click",()=>{x==="#resume"?Q(et):G(et),x="#about-me"});let ft=document.getElementById("launch-resume");ft.addEventListener("click",()=>{dt(),x="#resume"});const it=[mt,_t,pt,ft];it.forEach(c=>{c.addEventListener("click",()=>{c.classList.add("pushed"),document.getElementById("home").classList.add("hidden"),document.getElementById("projects").classList.add("hidden"),document.getElementById("about-me").classList.add("hidden"),document.getElementById("resume").classList.add("hidden"),setTimeout(()=>{$=!0},100),it.forEach(t=>{c!==t&&(t.classList.remove("pushed"),t.classList.add("other-active"))})})});const M=30,O=.8,S=.1,I=2,C=.1;Y=new A(16777215,I,M,O,S,C);K=new A(16777215,I,M,O,S,C);X=new A(16777215,I,M,O,S,C);Z=new A(16777215,I,M,O,S,C);D=new A(16777215,I,M,O,S,C);J=new A(16777215,I,M,O,S,C);Y.position.set(0,35,0);K.position.set(0,-35,0);X.position.set(35,0,0);Z.position.set(-35,0,0);D.position.set(0,0,35);J.position.set(0,0,-35);const v=[Nt,Dt,Gt,V,ut,H,Qt,et,Vt,Ht,Ut,Wt];let z=[];const $t=()=>{const c=v.map(t=>t.asyncLoadModel());return Promise.all(c).then(()=>{v.forEach(t=>{p.add(t.model)})})},Yt=()=>{new nt,p=new Pt,P=new vt({canvas:document.querySelector("#bg")});const c=75,t=window.innerWidth/window.innerHeight,e=.1,i=1e4;b=new Tt(c,t,e,i),b.position.set(-5,27.5,-1.7),k=new jt(b),R=new Bt(p,k),P.setPixelRatio(window.devicePixeRatio),P.setSize(window.innerWidth,window.innerHeight),P.render(p,b),lt=new At(b,P.domElement);const s=new kt(16777215,1.3),n=new Rt(16777215,.3);s.position.set(0,0,0),p.add(s,n),new Mt(D),new Ot(200,20),p.add(Y,K,X,Z,D,J),$t();let o;G=a=>{const h=k.targetPosition,l=new U([h.x,h.y,h.z],!1,!0);o=l,p.add(l.getRocketModel()),z.push(l),R.launchNewRocketToPlanet(l,a)},dt=()=>{const a=k.targetPosition,h=new U([a.x,a.y,a.z],!1,!0);o=h,p.add(h.getRocketModel()),z.push(h),R.launchNewRocketToOrbit(h)},Q=a=>{R.moveRocketToPlanet(o,a)},tt=a=>{for(let h=0;h<a;h++)setTimeout(()=>{Zt()},h*100)},tt(0),Xt(9e3),k.setTarget(H),window.addEventListener("resize",function(){const a=window.innerWidth,h=window.innerHeight;P.setSize(a,h),b.aspect=a/h,b.updateProjectionMatrix()}),setTimeout(gt,150),document.querySelector("#home").scrollIntoView({behavior:"smooth"})};function gt(){requestAnimationFrame(gt),z.forEach(c=>{c.update(z)}),v.forEach(c=>{c.update()}),R.update(),lt.update(),k.update(),P.render(p,b),ct&&(document.querySelector("#loading-screen").style.display="none",ct=!1),$&&!R.inNavbarAnimation&&(document.querySelector(x).classList.remove("hidden"),it.forEach(c=>{c.classList.remove("other-active")}),$=!1)}function Kt(){f.loadRocketModel().then(()=>{Yt()})}const Xt=c=>{const t=new E.Vector(0,0,0);let e=0,i=[],s=new E.Vector,n;for(;e<c;){const o=N.randFloat(.25,.5),a=new ot(o,24,24),h=new at({color:16777215}),l=new rt(a,h);i=Array(3).fill().map(()=>N.randFloatSpread(1e3)),s.set(i[0],i[1],i[2]),n=f.distance(s,t),n>400&&(l.position.set(i[0],i[1],i[2]),p.add(l),e++)}},Zt=()=>{let c=v[N.randInt(0,v.length-1)];for(;c===V||c===ut;)c=v[N.randInt(0,v.length-1)];const t=c.position,e=new U([t.x,t.y,t.z]);z.push(e),p.add(e.getRocketModel()),document.getElementById("numberOfRockets").innerHTML=z.length};Kt();
