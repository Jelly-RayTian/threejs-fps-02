// Relay 9: three north/south approaches, linked by two east/west courts.
export const sites = [{x:-17,z:-16,name:'A / SOLAR'},{x:17,z:-16,name:'B / TIDAL'}];
export const blocks = [];
const add=(x,z,w,d,h,color,type='wall')=>blocks.push({x,z,w,d,h,color,type});
add(-26,0,2,64,7,0xd6c9ad);add(26,0,2,64,7,0xd6c9ad);add(0,-32,54,2,7,0xd6c9ad);add(0,32,54,2,4,0x9daea6);
// The solar workshop and tidal pump house separate the three lanes.
add(-9,0,10,17,5.8,0xd4ba94,'building');add(9,0,10,17,5.8,0xa4bbb1,'building');
add(-20,8,6,3,2.6,0xb56b47,'container');add(20,5,6,3,2.6,0x4e8387,'container');
add(0,14,4,3,1.25,0xd6c5a7,'crate');add(0,-10,3,3,1.4,0xd6c5a7,'crate');
add(-14,-20,4,4,2.6,0x4d7476,'crate');add(-20,-10,3,3,1.25,0xb6a080,'crate');
add(14,-12,4,3,1.3,0xb6a080,'crate');add(21,-22,3,5,2.5,0x4d7476,'crate');
add(-10,24,5,3,1.5,0x8c9b8d,'crate');add(12,25,5,3,1.5,0x8c9b8d,'crate');
export function free(x,z,r=.36){for(const b of blocks)if(Math.abs(x-b.x)<b.w/2+r&&Math.abs(z-b.z)<b.d/2+r)return false;return Math.abs(x)<25-r&&Math.abs(z)<31-r;}
export function move(a,dx,dz){if(free(a.x+dx,a.z))a.x+=dx;if(free(a.x,a.z+dz))a.z+=dz;}
// Slab intersection, usable for both a bullet and a line-of-sight query.
export function wallDistance(x,y,z,dx,dy,dz,max=100){let nearest=max;for(const b of blocks){let lo=0,hi=nearest;for(let axis=0;axis<3;axis++){const p=axis===0?x:axis===1?y:z,d=axis===0?dx:axis===1?dy:dz,c=axis===0?b.x:axis===1?b.h/2:b.z,h=axis===0?b.w/2:axis===1?b.h/2:b.d/2;if(Math.abs(d)<1e-8){if(p<c-h||p>c+h){hi=-1;break;}}else{let a=(c-h-p)/d,v=(c+h-p)/d;if(a>v){const t=a;a=v;v=t;}lo=Math.max(lo,a);hi=Math.min(hi,v);}}if(hi>=lo&&hi>=0)nearest=Math.min(nearest,lo);}return nearest;}
export function visible(a,b){const dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz);return d<.1||wallDistance(a.x,1.5,a.z,dx/d,0,dz/d,d)>=d-.1;}
// Small grid A*: replanned on decisions, never in the rendering loop.
const step=2, cols=25,rows=31;
export function route(a,goal){const cell=(x,z)=>[Math.max(0,Math.min(cols-1,Math.round((x+24)/step))),Math.max(0,Math.min(rows-1,Math.round((z+30)/step)))];const [sx,sz]=cell(a.x,a.z),[gx,gz]=cell(goal.x,goal.z),start=sz*cols+sx,end=gz*cols+gx,open=[start],cost=new Float32Array(cols*rows).fill(Infinity),prev=new Int16Array(cols*rows).fill(-1);cost[start]=0;let found=start;while(open.length){let bi=0,best=Infinity;for(let i=0;i<open.length;i++){let n=open[i],f=cost[n]+Math.abs(n%cols-gx)+Math.abs(Math.floor(n/cols)-gz);if(f<best){best=f;bi=i;}}let n=open.splice(bi,1)[0];if(n===end){found=n;break;}const cx=n%cols,cz=Math.floor(n/cols);for(const [ox,oz] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=cx+ox,nz=cz+oz,k=nz*cols+nx;if(nx<0||nx>=cols||nz<0||nz>=rows||!free(nx*step-24,nz*step-30,.55))continue;const c=cost[n]+1;if(c<cost[k]){cost[k]=c;prev[k]=n;if(!open.includes(k))open.push(k);}}}const path=[];for(let n=found;n!==start&&n>=0;n=prev[n])path.push({x:(n%cols)*step-24,z:Math.floor(n/cols)*step-30});path.reverse();return path;}
