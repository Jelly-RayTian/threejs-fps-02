import * as T from 'three';
import {blocks,sites} from './map.js';
export function createView(container,s){
 const renderer=new T.WebGLRenderer({antialias:true,powerPreference:'high-performance',preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;container.appendChild(renderer.domElement);
 const scene=new T.Scene();scene.background=new T.Color(0xb4d4d4);scene.fog=new T.Fog(0xb4d4d4,38,125);const camera=new T.PerspectiveCamera(76,innerWidth/innerHeight,.05,180);camera.rotation.order='YXZ';scene.add(camera);
 scene.add(new T.HemisphereLight(0xd7f4ff,0x7d7050,2.1));const sun=new T.DirectionalLight(0xffe1ac,3.4);sun.position.set(-25,45,20);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-40,right:40,top:40,bottom:-40,near:1,far:100});sun.shadow.bias=-.0005;sun.shadow.normalBias=.035;scene.add(sun);
 const materials=new Map();function mat(color,metalness=0,roughness=.8){const key=color+'/'+metalness+'/'+roughness;if(!materials.has(key))materials.set(key,new T.MeshStandardMaterial({color,metalness,roughness}));return materials.get(key);}
 const cube=new T.BoxGeometry(1,1,1);function box(x,y,z,w,h,d,color,parent=scene,metal=0){const m=new T.Mesh(cube,mat(color,metal));m.position.set(x,y,z);m.scale.set(w,h,d);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function cyl(x,y,z,r,h,color,parent=scene,segments=12){const m=new T.Mesh(new T.CylinderGeometry(r,r,h,segments),mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function label(text,x,y,z,w,h,rotation=0,color='#e9e0c6',background='#274b50',parent=scene){const c=document.createElement('canvas');c.width=512;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle=background;ctx.fillRect(0,0,512,256);ctx.strokeStyle=color;ctx.lineWidth=5;ctx.strokeRect(12,12,488,232);ctx.fillStyle=color;ctx.font='bold 72px Arial';ctx.textAlign='center';ctx.textBaseline='middle';const lines=text.split('\n');lines.forEach((v,i)=>ctx.fillText(v,256,128+(i-(lines.length-1)/2)*80,460));const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map:texture,roughness:.9}));m.position.set(x,y,z);m.rotation.y=rotation;parent.add(m);return m;}
 box(0,-.35,0,54,.7,66,0xc5bb9b);box(0,-1.5,0,130,1,130,0x4f9299);
 // Paving joints and lane markings make distances and routes legible.
 for(let x=-24;x<26;x+=3)box(x,.006,0,.025,.015,62,0xb1a88f);
 for(let z=-30;z<32;z+=3)box(0,.008,z,50,.015,.025,0xb1a88f);
 for(const x of [-17,0,17])for(let z=27;z>-26;z-=5)box(x,.025,z,.12,.025,2,0xe4d5a7);
 for(const b of blocks){box(b.x,b.h/2,b.z,b.w,b.h,b.d,b.color);if(b.type==='building'){
   box(b.x,b.h+.1,b.z,b.w+.4,.25,b.d+.4,0xf1dfb9);box(b.x,.3,b.z,b.w+.1,.6,b.d+.1,0x6b8580);
   for(const side of [-1,1]){box(b.x+side*(b.w/2+.025),2.7,b.z,.06,.18,b.d,0xf1dfb9);for(let z=-6;z<=6;z+=4){box(b.x+side*(b.w/2+.05),3.8,z,.1,1.2,2.2,0x395e60);for(let n=-.7;n<=.7;n+=.7)box(b.x+side*(b.w/2+.11),3.8,z+n,.06,1.2,.04,0xb6c7b2);}}
   box(b.x,1.65,b.z+b.d/2+.04,2.2,3.3,.08,0x3d6060);for(let y=.4;y<3;y+=.35)box(b.x,y,b.z+b.d/2+.1,2,.035,.03,0x6a8883);
   label(b.x<0?'SOLAR\nWORKSHOP':'TIDAL\nPUMP HOUSE',b.x,4.6,b.d/2+.08,5,1.6,0,'#f4dfaf',b.x<0?'#9b563b':'#315d62');
   for(let z=-5;z<=5;z+=5){const solar=box(b.x,b.h+.7,z,7,.13,3,0x254e62,scene,.6);solar.rotation.z=-.16;for(let x=-3;x<=3;x++)box(b.x+x,b.h+.8,z,.025,.03,2.9,0x8ba8a6);}
   for(let i=0;i<2;i++){cyl(b.x-2+i*4,b.h+.8,-7,.35,1.5,0x637e7e);cyl(b.x-2+i*4,b.h+1.55,-7,.55,.1,0xc4d0be);}
 }else if(b.type==='container'){for(let x=-b.w/2+.2;x<b.w/2;x+=.45)box(b.x+x,b.h/2,b.z+b.d/2+.025,.06,b.h-.15,.08,0x354f51);label('R9 / FREIGHT',b.x,1.5,b.z+b.d/2+.08,b.w*.7,.7);box(b.x,b.h+.05,b.z,b.w+.1,.1,b.d+.1,0xd5c7a4);
 }else if(b.type==='crate'){for(const y of [.15,b.h-.15])box(b.x,y,b.z,b.w+.06,.12,b.d+.06,0x546760);for(const x of [-b.w/2+.15,b.w/2-.15])box(b.x+x,b.h/2,b.z,.1,b.h+.03,b.d+.08,0x546760);}}
 for(let i=0;i<2;i++){const p=sites[i];box(p.x,.035,p.z,7,.05,7,i?0x5c9994:0xc28f4e);box(p.x,.065,p.z,6.5,.025,6.5,0xbfb89a);for(let k=-3;k<=3;k+=2)for(const side of [-1,1]){box(p.x+k,.085,p.z+side*3,.7,.02,.18,0xf1d89a);box(p.x+side*3,.085,p.z+k,.18,.02,.7,0xf1d89a);}
   const reactor=new T.Group();reactor.position.set(p.x-2,0,p.z-2);scene.add(reactor);cyl(0,1.2,0,.65,2.4,0x3d686a,reactor);for(let y=.3;y<2.5;y+=.7)cyl(0,y,0,.73,.14,0xd7c6a0,reactor);cyl(0,2.8,0,.15,1,0xf8c36a,reactor);box(.5,1.5,.55,.5,.6,.3,0x203d46,reactor);label(i?'B':'A',p.x,4.7,p.z-5,3,3,0,'#f5d59d','#345e60');
   box(p.x,4.7,p.z-5.1,3.2,3.2,.15,0x294c4e);for(const side of [-1,1])cyl(p.x+side*1.35,2.3,p.z-5.2,.07,4.6,0x637775);
 }
 label('RELAY 9  /  COASTAL ENERGY',0,4.8,-30.9,13,2.3);label('SOUTH DOCK  /  09',0,2.6,30.85,10,1.5,Math.PI);
 // Perimeter lighting, cables, pipes and native wind palms.
 for(const x of [-24,24])for(const z of [-24,-5,16]){cyl(x,3.5,z,.075,7,0x526f70);box(x,7,z,1.3,.12,.8,0x294f54);const bulb=box(x,6.9,z,1,.06,.6,0xffde8e);bulb.material=new T.MeshStandardMaterial({color:0xffde8e,emissive:0xffc877,emissiveIntensity:2});}
 for(let i=0;i<10;i++){const x=i%2?-30:30,z=-28+Math.floor(i/2)*14;cyl(x,3,z,.2,6,0x807b57);for(let j=0;j<7;j++){const leaf=box(x,6,z,.55,.1,5.8,0x526d50);leaf.rotation.set(.28, j*Math.PI*2/7,.2);leaf.position.x+=Math.sin(j*Math.PI*2/7)*1.6;leaf.position.z+=Math.cos(j*Math.PI*2/7)*1.6;}}
 for(let z=-29;z<31;z+=4){box(-24.8,.35,z,.22,.35,3,0x8c9c8b);box(24.8,.35,z,.22,.35,3,0x8c9c8b);}
 // Distant silhouette: lighthouse and offshore wind collectors.
 cyl(-38,8,-42,2,16,0xd1d0b6);cyl(-38,16.5,-42,2.5,1,0x335a60);cyl(-38,17.5,-42,1.5,1,0xf9dc8c);
 for(let i=0;i<5;i++){const x=-48+i*22,z=-60; cyl(x,10,z,.25,20,0xc5d3c9);const hub=new T.Group();hub.position.set(x,20,z);scene.add(hub);for(let j=0;j<3;j++){const blade=box(0,4,0,.3,8,.1,0xd7ded1,hub);blade.rotation.z=j*Math.PI*2/3;blade.position.set(-Math.sin(j*Math.PI*2/3)*4,Math.cos(j*Math.PI*2/3)*4,0);}}
 // Batch the static box geometry by material; shadows use the same instances.
 scene.updateMatrixWorld(true);
 const batches=new Map();
 for(const mesh of scene.children.slice()){if(mesh.isMesh&&mesh.geometry===cube){let batch=batches.get(mesh.material);if(!batch){batch=[];batches.set(mesh.material,batch);}batch.push(mesh);}}
 for(const [material,meshes] of batches){const batch=new T.InstancedMesh(cube,material,meshes.length);meshes.forEach((mesh,i)=>{batch.setMatrixAt(i,mesh.matrixWorld);scene.remove(mesh);});batch.castShadow=true;batch.receiveShadow=true;scene.add(batch);}
 const actors=s.actors.map(a=>{const g=new T.Group();scene.add(g);const color=a.team===0?0xc78a43:0x3e9694;box(0,.98,0,.62,.78,.4,color,g);box(0,1.03,-.23,.48,.5,.1,0x263e42,g);box(0,.75,.03,.66,.14,.42,0x293d3e,g);const head=new T.Mesh(new T.SphereGeometry(.23,12,10),mat(0xd1ac85));head.position.y=1.66;g.add(head);const helm=new T.Mesh(new T.SphereGeometry(.255,12,8,0,Math.PI*2,0,Math.PI*.6),mat(color));helm.position.y=1.72;g.add(helm);box(0,1.68,-.215,.38,.12,.08,0x173b44,g, .5);box(0,1.47,-.16,.35,.2,.19,0x334c4c,g);for(const side of [-1,1]){box(side*.4,1.1,-.12,.18,.6,.2,color,g);box(side*.18,.36,0,.23,.7,.26,0x354e51,g);box(side*.18,.08,-.09,.26,.17,.43,0x263a3f,g);}box(.24,1.14,-.5,.16,.2,.8,0x243b42,g);box(.24,1.2,-.95,.08,.08,.25,0x172b30,g);box(-.34,.95,.1,.12,.22,.18,0xe0c697,g);return g;});
 const gun=new T.Group();camera.add(gun);gun.position.set(.27,-.25,-.4);const gunBody=box(0,-.015,-.25,.13,.17,.63,0x27464d,gun,.6);box(0,.07,-.18,.105,.055,.44,0x122b32,gun,.7);box(0,.1,-.06,.06,.09,.06,0xc3b386,gun);box(0,.1,-.52,.035,.09,.04,0x122b32,gun);box(0,-.02,-.7,.065,.065,.36,0x192d32,gun,.7);box(0,-.07,-.47,.14,.08,.26,0xb89b68,gun);const mag=box(0,-.22,-.12,.09,.3,.14,0x1b3339,gun);mag.rotation.x=.18;box(0,-.1,.05,.1,.24,.14,0x755e43,gun);box(.03,-.28,.22,.18,.19,.45,0xc18c55,gun);box(-.11,-.22,-.3,.18,.16,.38,0xb18354,gun);box(.025,-.2,.08,.18,.19,.2,0x3d5555,gun);box(-.09,-.15,-.43,.2,.18,.2,0x3d5555,gun);label('09',.071,.01,-.22,.15,.065,Math.PI/2,'#e9d8aa','#27464d',gun);
 const flash=new T.Mesh(new T.ConeGeometry(.09,.3,6),new T.MeshBasicMaterial({color:0xffd99b}));flash.rotation.x=-Math.PI/2;flash.position.set(0,-.02,-.98);gun.add(flash);flash.visible=false;
 const bomb=new T.Group();scene.add(bomb);box(0,.13,0,.5,.26,.38,0x203e46,bomb);box(0,.28,0,.3,.06,.2,0xe6a34b,bomb);const lamp=box(.19,.28,0,.05,.08,.08,0xffc66e,bomb);lamp.material=new T.MeshBasicMaterial({color:0xffbb58});
 const tracePool=[];for(let i=0;i<24;i++){const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(new Float32Array(6),3));const line=new T.Line(geo,new T.LineBasicMaterial({color:0xffdc92,transparent:true,opacity:.8}));scene.add(line);line.visible=false;tracePool.push(line);}
 const fragPool=[];for(let i=0;i<12;i++){const m=new T.Mesh(new T.IcosahedronGeometry(.13,1),mat(0x3d5142));scene.add(m);m.visible=false;fragPool.push(m);}
 const blasts=[];const blastGeo=new T.SphereGeometry(1,16,12);for(let i=0;i<5;i++){const m=new T.Mesh(blastGeo,new T.MeshBasicMaterial({color:0xffbd62,transparent:true,opacity:.4,depthWrite:false}));scene.add(m);m.visible=false;blasts.push({mesh:m,life:0});}
 let spec=0;
 function render(dt){const p=s.actors[0];let focus=p;if(p.hp<=0){let count=0;for(const a of s.actors)if(a.team===0&&a.hp>0)count++;if(count){let index=spec%count;for(const a of s.actors)if(a.team===0&&a.hp>0&&index--===0){focus=a;break;}}}camera.position.set(focus.x,focus.eye,focus.z);camera.rotation.set(focus.pitch+(p===focus?p.recoil*.33:0),focus.yaw,0,'YXZ');const speed=Math.hypot(focus.vx,focus.vz);camera.position.y+=Math.sin(s.time*12)*Math.min(.035,speed*.008);camera.fov+=( (s.aim?53:76)-camera.fov)*Math.min(1,dt*14);camera.updateProjectionMatrix();gun.visible=p.hp>0;gun.position.set(s.aim?.015:.27,-.25+(p.reload?Math.sin(p.reload*3)*.06-.18:0),-.4+p.recoil*.5);gun.rotation.set(p.reload?-.4:0,0,Math.sin(s.time*6)*speed*.003);gun.scale.setScalar(p.weapon==='kite'?.8:1);gunBody.scale.z=p.weapon==='needle'?.9:p.weapon==='kite'?.32:.63;flash.visible=p.cd>weaponsRate(p.weapon)-.045&&p.cd<=weaponsRate(p.weapon)&&!p.reload;flash.rotation.y=s.time*20;
 for(let i=0;i<actors.length;i++){const a=s.actors[i],m=actors[i];m.visible=a!==focus;if(a.hp<=0){m.position.set(a.x,.14,a.z);m.rotation.set(0,a.yaw,Math.PI/2);m.scale.setScalar(.8);}else{m.position.set(a.x,0,a.z);m.rotation.set(0,a.yaw,0);m.scale.set(1,a.eye/1.65,1);}}
 bomb.visible=!!s.bomb;if(s.bomb){bomb.position.set(s.bomb.x,.04,s.bomb.z);lamp.visible=Math.floor(s.time*5)%2===0;}
 tracePool.forEach((m,i)=>{const tr=s.traces[i];m.visible=!!tr;if(tr){const p=m.geometry.attributes.position;p.setXYZ(0,tr.x,tr.y,tr.z);p.setXYZ(1,tr.ex,tr.ey,tr.ez);p.needsUpdate=true;}});fragPool.forEach((m,i)=>{const g=s.grenades[i];m.visible=!!g;if(g)m.position.set(g.x,g.y,g.z);});for(const b of blasts){b.life=Math.max(0,b.life-dt);b.mesh.visible=b.life>0;if(b.life>0){b.mesh.scale.setScalar((1-b.life/.5)*7);b.mesh.material.opacity=b.life*.6;}}
 renderer.render(scene,camera);}
 function event(e){if(e.type==='blast'){const b=blasts.find(v=>!v.life)||blasts[0];b.life=.5;b.mesh.position.set(e.x,.7,e.z);}}
 function resize(){camera.aspect=innerWidth/innerHeight;renderer.setSize(innerWidth,innerHeight);camera.updateProjectionMatrix();}addEventListener('resize',resize);
 return {render,event,renderer,scene,camera,cycle(){spec++;}};
}
function weaponsRate(key){return {kite:.27,tern:.115,spray:.075,needle:.75}[key];}
