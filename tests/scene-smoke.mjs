import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import * as THREE from '../game/vendor/three/three.module.min.js';
const noop=()=>{};const ctx2d=new Proxy({},{get:()=>noop,set:()=>true});
const context=vm.createContext({console,Map,Math,Float32Array,Float64Array,Uint16Array,Uint32Array,Int16Array,Array,Infinity,devicePixelRatio:1,innerWidth:1280,innerHeight:720,document:{createElement:()=>({width:0,height:0,getContext:()=>ctx2d})},addEventListener:noop});
class Renderer{constructor(){this.shadowMap={};this.domElement={};}setPixelRatio(){}setSize(){}render(scene,camera){scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);}}
const three=new vm.SyntheticModule(Object.keys(THREE),function(){for(const name of Object.keys(THREE))this.setExport(name,name==='WebGLRenderer'?Renderer:THREE[name]);},{context});
const cache=new Map();async function load(file){file=resolve(file);if(cache.has(file))return cache.get(file);const m=new vm.SourceTextModule(readFileSync(file,'utf8'),{context,identifier:file});cache.set(file,m);await m.link((name,parent)=>name==='three'?three:load(resolve(dirname(parent.identifier),name)));return m;}
const sim=await load('game/src/sim.js');await sim.evaluate();const render=await load('game/src/render.js');await render.evaluate();const s=sim.namespace.createGame();const view=render.namespace.createView({appendChild:noop},s);for(const shot of ['start','play','end']){sim.namespace.stage(s,shot);view.render(1/60);}let meshes=0,instances=0;view.scene.traverse(o=>{if(o.isMesh)meshes++;if(o.isInstancedMesh)instances+=o.count;});console.log('PASS: real Three scene construction and all shot render paths, GPU calls stubbed.',{meshes,instances});
