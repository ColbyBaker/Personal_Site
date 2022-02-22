import{request as pt}from"https://cdn.skypack.dev/@octokit/request";import{G as Q,V as a,M as _t,p as b,S as U,a as W,b as H,Q as S,C as $,B as ft,L as gt,c as yt,d as y,e as wt,W as xt,P as At,O as vt,f as Pt,A as Mt,g as bt,h as St,i as Tt}from"./vendor.d971c9ec.js";const Lt=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerpolicy&&(n.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?n.credentials="include":s.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(s){if(s.ep)return;s.ep=!0;const n=e(s);fetch(s.href,n)}};Lt();const Et={owner:"ColbyBaker",userURL:"https://api.github.com/repos/ColbyBaker/",personalSiteDescription:"",getRepo:async function(r){return await pt(`GET /repos/${this.owner}/${r}`,{})}},Ft=["payroll-frontend","Atlas","jamming","ravenous","Personal_Site","BossMachine"];class kt extends React.Component{constructor(t){super(t);this.state={}}render(){const t=this.props.repo;return React.createElement("div",{className:"repo-card"},React.createElement("a",{href:t.html_url},t.name),React.createElement("p",null,t.description))}}class zt extends React.Component{constructor(t){super(t);this.state={repos:[]}}componentDidMount(){Ft.forEach(t=>{Et.getRepo(t).then(e=>{t=="Personal_Site"&&(e.data.description="The code for the site you're on right now!"),this.setState({repos:[...this.state.repos,e.data]})})})}render(){let t;return this.state.repos.length>0&&(t=this.state.repos.map(e=>React.createElement(kt,{repo:e,key:e.id}))),React.createElement("div",{className:"github-cards"},t)}}const Ct=document.querySelector("#react-github-cards");ReactDOM.render(React.createElement(zt,null),Ct);const It=new Q;class w{constructor(t,e=!1){this._position=new a(t[0],t[1],t[2]),this._scale=new a(1,1,1),this.inAnimation=e}static distance(t,e){var i=e.x-t.x,s=e.y-t.y,n=e.z-t.z;return Math.hypot(i,s,n)}asyncLoadModel(t,e,i){const s="/assets/"+t;return new Promise((n,o)=>{It.load(s,h=>{let c=h.scene;c.scale.set(i.x,i.y,i.z),c.position.set(e.x,e.y,e.z),n(c)},void 0,h=>{console.error("An error happened while loading a glb",h),o(h)})})}}class X extends w{constructor(t,e=!0,i=!1,s=new a){super(t,i);this._scale=new a(.8,1,.8),this._scale.multiplyScalar(.6),this.fileName="rocket.glb",this._model,this._sceneMin=-700,this._sceneMax=700,this._velocity=new a(s[0],s[1],s[2]),this._velocity.x===0&&this._velocity.y,this._velocity.z===0&&this._velocity.random(),this._velocity=this.setMagnitude(this._velocity,1),this._acceleration=new a,this.flocking=e,this._lastPosition=new a,this._nextPosition=this._position.clone(),this._perception=20,this._maxForce=.01,this._maxSpeed=.8,this._alignmentScalar=1.7,this._cohesionScalar=.5,this._separationScalar=.2,document.getElementById("alignment").value=this._alignmentScalar,document.getElementById("cohesion").value=this._cohesionScalar,document.getElementById("separation").value=this._separationScalar,document.getElementById("perception").value=this._perception,document.getElementById("maxForce").value=this._maxForce,document.getElementById("maxSpeed").value=this._maxSpeed}_getLocalRockets(t){return t.filter((i,s)=>{const n=w.distance(this.position,t[s].position);return n===0?!1:n<=this._perception})}_alignment(t){let e=new a;for(let i of t)e.add(i.velocity);return e.divideScalar(t.length),e=this.setMagnitude(e,1),e.sub(this.velocity),e=this.limit(e,this._maxForce),e}_cohesion(t){let e=new a;for(let s of t)e.add(s.position);e.divideScalar(t.length);let i=e.sub(this.position);return i=e.sub(this.velocity),i=this.setMagnitude(i,this._maxSpeed),i=this.limit(i,this._maxForce),i}_separation(t){let e=new a;for(let s of t){const n=w.distance(this.position,s.position);let o=new a(this.position);o.sub(s.position),o.divideScalar(n*n),e.add(o)}e.divideScalar(t.length);let i=e.sub(this.velocity);return i=this.setMagnitude(i,this._maxSpeed),i=this.limit(i,this._maxForce),i}_aviodWalls(){this.position.x>this._sceneMax?this._position.x=this._sceneMin:this.position.x<this._sceneMin&&(this._position.x=this._sceneMax),this.position.y>this._sceneMax?this._position.y=this._sceneMin:this.position.y<this._sceneMin&&(this._position.y=this._sceneMax),this.position.z>this._sceneMax?this._position.z=this._sceneMin:this.position.z<this._sceneMin&&(this._position.z=this._sceneMax)}_pointForwards(){const t=new _t;t.lookAt(new a(0,0,0),this.velocity,new a(0,1,0)),this._model.quaternion.setFromRotationMatrix(t)}_flock(t){const e=this._getLocalRockets(t);e.length!==0&&(this._updateScalars(),this._acceleration.add(this._alignment(e).multiplyScalar(this._alignmentScalar)),this._acceleration.add(this._cohesion(e).multiplyScalar(this._cohesionScalar)),this._acceleration.add(this._separation(e).multiplyScalar(this._separationScalar)))}update(t){this._acceleration.multiplyScalar(0),this.inAnimation?this.inAnimation&&(this._position.set(this._nextPosition.x,this._nextPosition.y,this._nextPosition.z),this._velocity=new a(this._position.x-this._lastPosition.x,this._position.y-this._lastPosition.y,this._position.z-this._lastPosition.z),this._pointForwards(),this._lastPosition.set(this.position.x,this.position.y,this.position.z)):(this._flock(t),this._position.add(this.limit(this._velocity,this._maxSpeed)),this._velocity.add(this._acceleration),this._aviodWalls(),this._pointForwards()),this._model.position.set(this._position.x,this._position.y,this._position.z)}_updateScalars(){let t=document.getElementById("alignment").value;t=Math.round(t*100)/100,t!=this._alignmentScalar&&console.log(`Alignment: ${t}`),this._alignmentScalar=t;let e=document.getElementById("cohesion").value;e=Math.round(e*100)/100,e!=this._cohesionScalar&&console.log(`Cohesion: ${e}`),this._cohesionScalar=e;let i=document.getElementById("separation").value;i=Math.round(i*100)/100,i!=this._separationScalar&&console.log(`separation: ${i}`),this._separationScalar=i;let s=document.getElementById("perception").value;s=Math.round(s*100)/100,s!=this._perception&&console.log(`perception: ${s}`),this._perception=s;let n=document.getElementById("maxForce").value;n=Math.round(n*100)/100,n!=this._maxForce&&console.log(`maxForce: ${n}`),this._maxForce=n;let o=document.getElementById("maxSpeed").value;o=Math.round(o*100)/100,o!=this._maxSpeed&&console.log(`maxSpeed: ${o}`),this._maxSpeed=o}set nextPosition(t){this._nextPosition.set(t.x,t.y,t.z)}get position(){const t=new a;return t.copy(this._position),t}set position(t){this._position=t}get velocity(){return this._velocity}get model(){return this._model}setMagnitude(t,e){let i=new b.Vector(t.x,t.y,t.z);return i.setMag(e),new a(i.x,i.y,i.z)}limit(t,e){let i=new b.Vector(t.x,t.y,t.z);return i.limit(e),new a(i.x,i.y,i.z)}asyncLoadModel(){return super.asyncLoadModel(this.fileName,this._position,this._scale).then(t=>(this._model=t,t))}}class d extends w{constructor(t,e,i,s){super([0,0,0]);this._radius=t*.5,this._theta=s,this._deltaTheta=2*Math.PI/i*.01,this._scale.multiplyScalar(30),this.fileName=e,this._isLoading=!0,this._model}rotate(){this._model.rotation.y+=.002}orbit(){this._theta+=this._deltaTheta,this._position.x=this._radius*Math.cos(this._theta),this._position.z=this._radius*Math.sin(this._theta)}update(){this.rotate(),this.orbit(),this._model.position.set(this._position.x,this._position.y,this._position.z)}get model(){return this._model}get position(){const t=new a;return t.copy(this._position),t}get deltaTheta(){return this._deltaTheta}get theta(){const t=this._position;return Math.atan2(t.z,t.x)}get radius(){return this._radius}set theta(t){this._theta=t}asyncLoadModel(){return super.asyncLoadModel(this.fileName,[0,0,0],this._scale).then(t=>(t.rotation.y=90,this._model=t,t)).then(this._isLoading=!1)}}class Rt extends d{constructor(t,e,i,s,n,o,h){super(t,e,i,s);this._moonTheta=h,this._moonRadius=n,this._moonDeltaTheta=2*Math.PI/o}orbit(){let t=new b.Vector(0,0,0);this._theta+=this._deltaTheta,t.x=this._radius*Math.cos(this._theta),t.z=this._radius*Math.sin(this._theta),this._moonTheta+=this._moonDeltaTheta,t.x+=this._moonRadius*Math.cos(this._moonTheta),t.z+=this._moonRadius*Math.sin(this._moonTheta),this._position.x=t.x,this._position.z=t.z}rotate(){this._model.rotation.y+=.003}}class Ot{constructor(t){this._camera=t,this._currentPosition=new a,this._currentLookat=new a,this._target,this._offsetBeforeTransition=new a,this._defaultOffset=new a(0,-2,17),this._offset=new a,this._offset.copy(this._defaultOffset),this._lookAt=new a(0,-4,0),this._onMobile=!1,this._mobileLookAtBias=new a(0,-2,0)}update(){window.innerHeight<600||window.innerWidth<600?this._onMobile=!0:this._onMobile=!1;const t=this._calculateIdealOffset(),e=this._calculateIdealLookAT();this._currentPosition.copy(t),this._currentLookat.copy(e),this._camera.position.copy(this._currentPosition),this._camera.lookAt(this._currentLookat)}_calculateIdealOffset(){let t=new a(this._offset.x,this._offset.y,this._offset.z);return t.add(this._target.position),t}_calculateIdealLookAT(){let t=new a(this._lookAt.x,this._lookAt.y,this._lookAt.z);return t.x+=this._target.position.x,t.y+=this._target.position.y,t.z+=this._target.position.z,this._onMobile&&(t.x+=this._mobileLookAtBias.x,t.y+=this._mobileLookAtBias.y,t.z+=this._mobileLookAtBias.z),t}setTarget(t){this._target=t}setOffsetToDefault(){this._offset.copy(this._defaultOffset)}set offset(t){this._offset.copy(t)}get defaultOffset(){const t=new a;return t.copy(this._defaultOffset),t}get targetPosition(){return new a(this._target.position.x,this._target.position.y,this._target.position.z)}set offsetBeforeTransition(t){this._offsetBeforeTransition.copy(t)}get offsetBeforeTransition(){return this._offsetBeforeTransition.clone()}get target(){return this._target}get offset(){return new a(this._offset.x,this._offset.y,this._offset.z)}get radius(){return w.distance(this._currentPosition,new a(0,0,0))}get theta(){const t=this._currentPosition;return Math.atan2(t.z,t.x)}get thetaRelativeToPlanet(){return Math.atan2(this._offset.z,this._offset.x)}get position(){return new a(this._currentPosition.x,this._currentPosition.y,this._currentPosition.z)}}class Bt{constructor(t,e){this._scene=t,this._thirdPersonCamera=e,this.inAnimation=!1,this._animatedObjectsArray=[],this._currentAnimations=[],this._animationQueue=[],this._usedSequenceIDs=[]}update(){this.inAnimation&&this._handleAllCurrentAnimations()}_handleAllCurrentAnimations(){this._currentAnimations.forEach((t,e)=>{if(t.playhead<0){t.playhead+=t.stepRate,console.log(t.playhead);return}switch(t.animationType){case"path":this._handlePathAnimation(e);break;case"cameraTargetAndFollow":this._handleCameraTargetAndFolowAnimation(e);break;case"cameraTargetChange":this._handleCameraTargetChange(e);break;case"other":this._handleOtherAnimation(e);break}})}_handleOtherAnimation(t){const e=this._currentAnimations[t];if(this._animationExpired(e)){this._removeAnimation(t);return}e.playhead+=e.stepRate}_handlePathAnimation(t){const e=this._currentAnimations[t],i=this._animatedObjectsArray[e.movingObjectIndex];if(this._animationExpired(e)){this._removePathAnimation(t);return}e.firstFrame&&(i.inAnimation=!0,e.firstFrame=!1);const n=this._animatedObjectsArray[e.pathIndex].getPoint(e.playhead);i.nextPosition=n,e.playhead+=e.stepRate}_handleCameraTargetAndFolowAnimation(t){const e=this._currentAnimations[t];if(this._animationExpired(e)){this._removeAnimation(t);return}e.firstFrame&&(this._thirdPersonCamera.setTarget(this._animatedObjectsArray[0]),e.firstFrame=!1),e.playhead+=e.stepRate}_handleCameraTargetChange(t){const e=this._currentAnimations[t],i=this._animatedObjectsArray[e.newTargetIndex];if(e.firstFrame){const s=this.getVector(i.position,this._thirdPersonCamera.position);this._thirdPersonCamera.offsetBeforeTransition=this.getVector(i.position,this._thirdPersonCamera.position),this._thirdPersonCamera.offset=s,this._thirdPersonCamera.setTarget(this._animatedObjectsArray[e.newTargetIndex]),e.playhead+=e.stepRate,e.firstFrame=!1}else{if(this._animationExpired(e)){this._removeAnimation(t);return}const s=new a;s.lerpVectors(this._thirdPersonCamera.offsetBeforeTransition,this._thirdPersonCamera.defaultOffset,e.playhead),this._thirdPersonCamera.offset=s,e.playhead+=e.stepRate}}_animationExpired(t){return t.playhead>=t.totalTime}_addAnimation(t,e,i,s=!0,n={},o=.001,h="other",c=0){this.inAnimation=!0;const l=0-c;let u={sequenceID:t,sequenceGroup:e,waitForAnimationToFinish:s,playhead:l,stepRate:o,totalTime:i,animationType:h,firstFrame:!0};for(const m in n)u[m]!=null&&console.log("item in params was already assigned by _addAnimation"),u[m]=n[m];let g=!1;this._currentAnimations.forEach(m=>{m.sequenceID===t&&m.sequenceGroup<e&&m.waitForAnimationToFinish===!0&&(g=!0)}),g?this._animationQueue.push(u):this._currentAnimations.push(u),h==="other"&&console.log("Animation of type 'other' was added to the queue")}_addPathAnimation(t,e,i,s,n=1,o=.001,h="path"){const c=this._animatedObjectsArray.push(s)-1,l=this._animatedObjectsArray.push(i)-1,u=!0;s.inAnimation=!0;const g={movingObjectIndex:c,pathIndex:l};this._addAnimation(t,e,n,u,g,o,h)}_addCameraTargetAndFolowAnimation(t,e,i=1,s=.001,n="cameraTargetAndFollow"){this._addAnimation(t,e,i,!1,{},s,n)}_addCameraTargetChange(t,e,i,s=0,n=0,o=0,h="cameraTargetChange"){const l={newTargetIndex:this._animatedObjectsArray.push(i)-1};this._addAnimation(t,e,s,!1,l,n,h,o)}_removePathAnimation(t){const i=this._currentAnimations[t].movingObjectIndex;this._animatedObjectsArray[i].inAnimation=!1,this._removeAnimation(t)}_removeAnimation(t){const i=this._currentAnimations[t].sequenceID;this._currentAnimations.splice(t,1);let s=!0;if(this._currentAnimations.forEach(n=>{n.sequenceID===i&&n.waitForAnimationToFinish&&(s=!1)}),s){let n;this._animationQueue.forEach(o=>{o.sequenceID===i&&(n?o.sequenceGroup<n&&(n=o.sequenceGroup):n=o.sequenceGroup)}),this._animationQueue.forEach((o,h)=>{o.sequenceID===i&&o.sequenceGroup===n&&(this._animationQueue.splice(h,1),this._currentAnimations.push(o))})}}_getUniqueSequenceID(){let t=!0,e=0;for(;t;)e++,t=this._usedSequenceIDs.includes(e);return this._usedSequenceIDs.push(e),e}getTestPoint(t){const e=new U(.2,24,24),i=new W({color:16711680}),s=new H(e,i);s.position.set(t.x,t.y,t.z),this._scene.add(s)}getRadialPosition(t,e,i=-2){const s=e*Math.cos(t),n=e*Math.sin(t);return new a(s,i,n)}getPointWithTheta(t,e,i=0){t.x,t.z;const s=e,n=Math.cos(s)-Math.sin(s),o=Math.sin(s)+Math.cos(s);return new a(n,i,o)}getVector(t,e){return new a(e.x-t.x,e.y-t.y,e.z-t.z)}getQuaternionFromVectors(t,e,i=new a){const s=new a;s.copy(t),s.sub(i),s.normalize();const n=new a;n.copy(e),n.sub(i),n.normalize();let o=new S;return o.setFromUnitVectors(s,n),o}getScalarFromVectors(t,e,i){const s=new a;s.copy(t);const n=new a;n.copy(e),i&&(s.sub(i),n.sub(i));const o=this.getQuaternionFromVectors(s,n);return s.applyQuaternion(o),n.divide(s)}getPositionUsingQuaternion(t,e,i,s){const n=new a;return n.copy(t),n.sub(e),n.applyQuaternion(i),n.multiplyScalar(s),n.add(e),n}launchRocket(t,e){const i=this._thirdPersonCamera.targetPosition,s=this._thirdPersonCamera.position,n=e.position;this._thirdPersonCamera.target.theta,this._thirdPersonCamera.target.radius,this._thirdPersonCamera.theta,this._thirdPersonCamera.radius;const o=new S(-.042749690783808636,.7740255589161532,.0910618304607239,.6251117029104221),h=new S(-.47758778857662715,.6817708103503712,.08020833062945544,.5483293627504555),c=new S(.09619301751625357,.44899411012929447,.05282283648579934,.8867699478421195),l=new S(.05077657566513715,.033260032158517625,.003912944959825603,.9981483850040926),u=this.getPositionUsingQuaternion(s,i,o,.074319895),g=this.getPositionUsingQuaternion(s,i,h,1.56),m=this.getPositionUsingQuaternion(s,i,c,1.235886),F=this.getPositionUsingQuaternion(s,i,l,.8089725);let ct=new $(u,g,m,F),V=this.getVector(m,F);V.add(F);const lt=new a(0,40,0),C=new a;C.copy(n),C.x-=10;let N=new $(F,V,lt,C);const k=this._getUniqueSequenceID();this._addPathAnimation(k,1,ct,t,1,.006,"path"),this._addCameraTargetChange(k,1,t,1,.01),this._addPathAnimation(k,2,N,t,1,.005,"path"),this._addCameraTargetChange(k,2,e,1,.01,.05);const dt=N.getPoints(50),ut=new ft().setFromPoints(dt),mt=new gt({color:16711680});new yt(ut,mt)}}let Z=!0,_,p,f,T,I,K,R,O,B,q,z,j,L=()=>{},Y=0;document.getElementById("addRocket").addEventListener("click",()=>{Y=document.getElementById("inputNumberRockets").value;for(let r=0;r<Y;r++)ht()});let qt=new d(0,"sun.glb",1e3,0),jt=new d(65,"mercury.glb",241,.73),Dt=new d(100,"venus.glb",615,4.4),D=new d(155,"earth.glb",1e3,5.4),Gt=new Rt(155,"moon.glb",1e3,5.4,8,1700,-1),J=new d(210,"mars.glb",1880,-1.9),Vt=new d(275,"jupiter.glb",11900,3.85),tt=new d(345,"saturn.glb",29400,-3.82),Nt=new d(405,"uranus.glb",83700,.79),Qt=new d(455,"neptune.glb",163700,4.76),et=new d(510,"pluto.glb",247900,-4.57),it=document.getElementById("launch-home");it.addEventListener("click",()=>{L(D)});let st=document.getElementById("launch-projects");st.addEventListener("click",()=>{L(J)});let nt=document.getElementById("launch-about-me");nt.addEventListener("click",()=>{L(tt)});let ot=document.getElementById("launch-resume");ot.addEventListener("click",()=>{L(et)});const at=[it,st,nt,ot];at.forEach(r=>{r.addEventListener("click",()=>{r.classList.add("pushed"),setTimeout(()=>{r.classList.remove("pushed")},6e3),at.forEach(t=>{r!==t&&(t.classList.add("other-active"),setTimeout(()=>{t.classList.remove("other-active")},6e3))})})});const x=30,A=.8,v=.1,P=2,M=.1;R=new y(16777215,P,x,A,v,M);O=new y(16777215,P,x,A,v,M);B=new y(16777215,P,x,A,v,M);q=new y(16777215,P,x,A,v,M);z=new y(16777215,P,x,A,v,M);j=new y(16777215,P,x,A,v,M);R.position.set(0,35,0);O.position.set(0,-35,0);B.position.set(35,0,0);q.position.set(-35,0,0);z.position.set(0,0,35);j.position.set(0,0,-35);const G=[qt,jt,Dt,D,Gt,J,Vt,tt,Nt,Qt,et];let E=[];const Ut=()=>{const r=G.map(t=>t.asyncLoadModel());return Promise.all(r).then(()=>{G.forEach(t=>{p.add(t.model)})})},Wt=()=>{new Q,p=new wt,f=new xt({canvas:document.querySelector("#bg")});const r=75,t=window.innerWidth/window.innerHeight,e=.1,i=1e4;_=new At(r,t,e,i),_.position.set(-5,27.5,-1.7),T=new Ot(_),I=new Bt(p,T),f.setPixelRatio(window.devicePixeRatio),f.setSize(window.innerWidth,window.innerHeight),f.render(p,_),K=new vt(_,f.domElement);const s=new Pt(16777215,1.3),n=new Mt(16777215,.3);s.position.set(0,0,0),p.add(s,n),new bt(z),new St(200,20),p.add(R,O,B,q,z,j),Ut(),L=h=>{const c=T.targetPosition,l=new X([c.x,c.y,c.z],!1,!0);l.asyncLoadModel().then(u=>{p.add(u),E.push(l),I.launchRocket(l,h)})};const o=1;for(let h=0;h<o;h++)ht();$t(9e3),T.setTarget(D),window.addEventListener("resize",function(){const h=window.innerWidth,c=window.innerHeight;f.setSize(h,c),_.aspect=h/c,_.updateProjectionMatrix()}),rt()};function rt(){requestAnimationFrame(rt),E.forEach(r=>{r.update(E)}),G.forEach(r=>{r.update()}),I.update(),K.update(),T.update(),f.render(p,_),Z&&(document.querySelector("#loading-screen").style.display="none",Z=!1)}function Ht(){Wt()}const $t=r=>{const t=new b.Vector(0,0,0);let e=0,i=[],s=new b.Vector,n;const o=new U(.25,24,24),h=new W({color:16777215});for(;e<r;){const c=new H(o,h);i=Array(3).fill().map(()=>Tt.randFloatSpread(1e3)),s.set(i[0],i[1],i[2]),n=w.distance(s,t),n>400&&(c.position.set(i[0],i[1],i[2]),p.add(c),e++)}},ht=()=>{const r=-20,t=20,e=Math.round(Math.random()*(t-r)+r),i=Math.round(Math.random()*(t-r)+r),s=Math.round(Math.random()*(t-r)+r),n=[e,i,s],o=new X(n);E.push(o),o.asyncLoadModel().then(h=>{p.add(h)}),document.getElementById("numberOfRockets").innerHTML=E.length};Ht();
