import {createGame,tick,reload,switchWeapon,throwFrag,stage} from './sim.js';
import {createView} from './render.js';
import {createAudio} from './audio.js';
import {createUI} from './ui.js';
const params=new URLSearchParams(location.search),shot=params.get('shot');
const s=createGame(Number(params.get('seed')||1));if(['start','play','end'].includes(shot))stage(s,shot);
const view=createView(document.getElementById('viewport'),s),audio=createAudio(),ui=createUI(s);
const input={forward:false,back:false,left:false,right:false,crouch:false,walk:false,fire:false,interact:false};
const menu=document.getElementById('menu'),shop=document.getElementById('buy'),canvas=view.renderer.domElement;
let deployed=false,paused=true,last=performance.now(),accumulator=0,uiTime=0;
function lock(){audio.start();deployed=true;canvas.requestPointerLock();}
document.getElementById('play').onclick=lock;
document.getElementById('closebuy').onclick=()=>{shop.hidden=true;lock();};
function supply(){if(!deployed||s.actors[0].hp<=0)return;if(!shop.hidden){shop.hidden=true;lock();}else if(s.phase==='buy'){shop.hidden=false;menu.hidden=true;document.exitPointerLock();}}
document.addEventListener('pointerlockchange',()=>{paused=document.pointerLockElement!==canvas;menu.hidden=!paused||!shop.hidden;document.getElementById('play').innerHTML=deployed?'RESUME OPERATION <span>→</span>':'DEPLOY TO RELAY 9 <span>→</span>';if(paused){for(const k in input)input[k]=false;s.aim=false;}});
addEventListener('mousemove',e=>{if(paused||s.actors[0].hp<=0)return;const p=s.actors[0],sensitivity=s.aim?.0014:.0021;p.yaw-=e.movementX*sensitivity;p.pitch=Math.max(-1.4,Math.min(1.4,p.pitch-e.movementY*sensitivity));});
addEventListener('mousedown',e=>{if(paused)return;if(s.actors[0].hp<=0){view.cycle();return;}if(e.button===0)input.fire=true;if(e.button===2)s.aim=true;});addEventListener('mouseup',e=>{if(e.button===0)input.fire=false;if(e.button===2)s.aim=false;});addEventListener('contextmenu',e=>e.preventDefault());
const bindings={KeyW:'forward',KeyS:'back',KeyA:'left',KeyD:'right',ControlLeft:'crouch',ControlRight:'crouch',ShiftLeft:'walk',ShiftRight:'walk',KeyE:'interact'};
addEventListener('keydown',e=>{if(['Tab','ControlLeft','ControlRight','Space'].includes(e.code))e.preventDefault();if(e.code==='Tab'){document.getElementById('roster').hidden=false;return;}if(e.repeat)return;if(e.code==='KeyB'){supply();return;}if(paused)return;if(bindings[e.code])input[bindings[e.code]]=true;const p=s.actors[0];if(e.code==='KeyR')reload(s,p);if(e.code==='KeyG')throwFrag(s,p);if(e.code==='Digit1')switchWeapon(p,1);if(e.code==='Digit2')switchWeapon(p,2);});
addEventListener('keyup',e=>{if(bindings[e.code])input[bindings[e.code]]=false;if(e.code==='Tab')document.getElementById('roster').hidden=true;});
addEventListener('blur',()=>{for(const k in input)input[k]=false;});
if(shot){deployed=true;paused=false;menu.hidden=true;}
function frame(now){const dt=Math.min(.1,(now-last)/1000);last=now;if((!paused||!shop.hidden)&&!shot){accumulator+=dt;while(accumulator>=1/60){tick(s,input,1/60);accumulator-=1/60;}if(s.phase!=='buy'&&!shop.hidden){shop.hidden=true;menu.hidden=false;}}else accumulator=0;for(const e of s.events){audio.event(e,s.actors[0]);view.event(e);}s.events.length=0;view.render(dt);uiTime-=dt;if(uiTime<=0){ui.update();uiTime=.08;}requestAnimationFrame(frame);}requestAnimationFrame(frame);
// Read-only instrumentation for browser checks; no alternate gameplay implementation.
window.sunbreak={state:s,view,input};
