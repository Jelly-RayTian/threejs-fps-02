import assert from 'node:assert/strict';
import {createGame,tick,shoot,reload,buy,throwFrag,switchWeapon,stage} from '../game/src/sim.js';
import {free,route,sites,move} from '../game/src/map.js';
const input={};
function advance(s,seconds,input={}){for(let i=0;i<Math.ceil(seconds*60);i++){tick(s,input,1/60);s.events.length=0;}}
let s=createGame(),p=s.actors[0];
assert(sites.every(goal=>route(p,goal).length>10));
buy(s,'tern');assert.equal(p.money,1000);assert.equal(p.weapon,'tern');
buy(s,'armor');assert.equal(p.armor,75);assert.equal(p.money,350);
buy(s,'needle');assert.equal(p.money,350);
switchWeapon(p,1);assert.equal(p.weapon,'kite');switchWeapon(p,2);assert.equal(p.ammo,24);
s.phase='live';for(const a of s.actors.slice(1))a.hp=0;s.actors[3].hp=100;s.actors[3].x=20;s.actors[3].z=-25;s.actors[3].think=Infinity;
p.x=-17;p.z=-16;advance(s,3.1,{interact:true});assert(s.bomb,'plant completes');assert(s.bomb.timer>35);
s.actors[3].think=Infinity;s.actors[3].path=[];s.actors[3].target=null;advance(s,36);assert.equal(s.phase,'end');assert.equal(s.winner,0);
s=createGame();s.phase='live';p=s.actors[0];s.bomb={x:0,z:-25,timer:36,beep:1};s.attacking=1;p.x=0;p.z=-25;for(const a of s.actors.slice(1)){a.hp=0;}s.actors[3].hp=100;s.actors[3].x=20;s.actors[3].z=24;s.actors[3].think=Infinity;advance(s,5.1,{interact:true});assert.equal(s.phase,'end');assert.equal(s.winner,0);assert.match(s.reason,/neutralized/);
s=createGame();s.phase='live';p=s.actors[0];p.x=-17;p.z=3;p.yaw=0;p.pitch=0;for(const a of s.actors.slice(1))a.hp=0;const foe=s.actors[3];foe.hp=100;foe.armor=0;foe.think=Infinity;s.actors[4].hp=100;s.actors[4].think=Infinity;s.actors[4].x=20;s.actors[4].z=-25;foe.x=-17;foe.z=-3;assert(shoot(s,p));assert(foe.hp<30,'head damage');assert.equal(p.ammo,11);p.ammo=0;p.reserve=4;reload(s,p);advance(s,1.6);assert.equal(p.ammo,4);assert.equal(p.reserve,0);
s=createGame();s.phase='live';p=s.actors[0];const start=p.z;advance(s,.5,{forward:true});assert(p.z<start-.5);assert(p.vz<-3);advance(s,.5,{});assert(Math.abs(p.vz)<.1);advance(s,.4,{crouch:true});assert(p.eye<1.2);p.x=0;p.z=1;for(let i=0;i<300;i++)move(p,.1,0);assert(p.x<3.65,'wall collision');
s=createGame();s.phase='live';throwFrag(s,s.actors[0]);assert.equal(s.grenades.length,1);advance(s,2.1);assert.equal(s.grenades.length,0);
for(const shot of ['start','play','end']){s=createGame();stage(s,shot);assert(s.actors.every(a=>free(a.x,a.z)),shot+' staging clear of solids');}
const a=createGame(14),b=createGame(14);advance(a,90);advance(b,90);assert.deepEqual(a,{...b,rand:a.rand});
console.log('PASS: routes, purchases, weapon switching, plant/overload, defuse, headshots, ammo/reload, movement/crouch/collision, grenade fuse, shot staging, deterministic simulation');

s=createGame(7);s.phase='live';s.timer=1000;for(const a of s.actors){a.hp=0;}const bot=s.actors[1];bot.hp=100;s.actors[3].hp=100;s.actors[3].think=Infinity;s.actors[3].x=23;s.actors[3].z=29;let armed=false;for(let i=0;i<60*70;i++){tick(s,{},1/60);s.events.length=0;if(s.bomb){armed=true;break;}}assert(armed,'attacking bot routes to and arms a site');
console.log('PASS: autonomous bot navigation and planting');
s=createGame(9);s.phase='live';s.timer=1000;for(const a of s.actors)a.hp=0;s.actors[3].hp=100;s.actors[1].hp=100;s.actors[1].x=23;s.actors[1].z=29;s.actors[1].think=Infinity;s.bomb={x:17,z:-16,timer:36,beep:1};advance(s,18);assert.equal(s.winner,1);assert.match(s.reason,/neutralized/);console.log('PASS: autonomous bot rotation and defusing');
