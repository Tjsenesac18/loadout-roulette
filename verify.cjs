const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const core=require('./docs/core.js'),spin=require('./docs/spin-math.js');
const ctx=vm.createContext({});vm.runInContext(fs.readFileSync('./docs/catalog.js','utf8'),ctx);
const weapons=JSON.parse(vm.runInContext('JSON.stringify(WEAPONS)',ctx)),slots=JSON.parse(vm.runInContext('JSON.stringify(SLOTS)',ctx));
assert.equal(weapons.length,22);for(const w of weapons){assert.ok(w.image&&fs.existsSync('./docs/'+w.image),`Missing image for ${w.name}`);assert.ok(fs.statSync('./docs/'+w.image).size>10000)}assert.equal(new Set(weapons.map(w=>w.id)).size,22);const m4=weapons.find(w=>w.id==='m4');const official=m4.attachments.filter(a=>a.status==='official');assert.equal(official.length,5);assert.equal(weapons.reduce((n,w)=>n+w.attachments.length,0),995);assert.equal(weapons.filter(w=>w.attachments.length).length,17);assert.equal(weapons.find(w=>w.id==='patriot').attachments.length,62);assert.equal(weapons.find(w=>w.id==='nyx').attachments.length,45);assert.equal(weapons.find(w=>w.id==='signal').attachments.length,71);assert.equal(weapons.find(w=>w.id==='gs').attachments.length,47);assert.ok(slots.includes('Trigger Action')&&slots.includes('Bolt')&&slots.includes('Comb')&&slots.includes('Guard'));
let selected={};for(const a of official)selected=core.chooseAttachment(selected,a);assert.ok(core.complete(selected));
assert.throws(()=>core.chooseAttachment(selected,{id:'sample-extra',slot:'Laser',name:'Sample Laser',status:'sample'}),/Five slots/);
selected=core.chooseAttachment(selected,{id:'sample-replacement',slot:'Barrel',name:'Sample Barrel',status:'sample'});assert.equal(Object.keys(selected).length,5);assert.equal(selected.Barrel.id,'sample-replacement');
selected=core.chooseAttachment(selected,selected.Barrel);assert.equal(Object.keys(selected).length,4);assert.ok(!core.complete(selected));
const kit={id:'kit1',name:'M4 Field Kit',weaponId:'m4',attachments:official,photo:''};const state={version:1,loadouts:[kit],selected:['kit1','kit1']};assert.equal(core.validateState(state,weapons,slots).selected.length,1);
const cleared=core.validateState({...state,selected:[]},weapons,slots);assert.equal(cleared.loadouts.length,1);assert.equal(cleared.selected.length,0);
// Every catalog attachment must round-trip in a valid five-category build.
for(const w of weapons.filter(w=>w.attachments.length))for(const a of w.attachments){const attachments=[a];const used=new Set([a.slot]);for(const candidate of w.attachments){if(attachments.length===5)break;if(!used.has(candidate.slot)){used.add(candidate.slot);attachments.push(candidate)}}const backup={version:1,selected:['all-records'],loadouts:[{id:'all-records',name:'Catalog check',weaponId:w.id,attachments,photo:''}]};assert.equal(core.validateState(backup,weapons,slots).loadouts[0].attachments[0].id,a.id)}
const oldSample={...kit,attachments:['Muzzle','Barrel','Underbarrel','Optic','Stock'].map((slot,i)=>({id:`sample-${i}-0`,name:`Sample ${slot} Alpha`,slot,status:'sample',source:''}))};assert.equal(core.validateState({...state,loadouts:[oldSample]},weapons,slots).loadouts[0].attachments[0].status,'sample');
assert.throws(()=>core.validateState({...state,loadouts:[{...kit,weaponId:'han86'}]},weapons,slots));
for(const bad of [{...kit,attachments:[...official.slice(0,4),official[0]]},{...kit,attachments:official.slice(0,4)},{...kit,weaponId:'knife'},{...kit,photo:'javascript:alert(1)'},{...kit,attachments:official.map((a,i)=>i===0?{...a,name:'False attachment'}:a)}])assert.throws(()=>core.validateState({...state,loadouts:[bad]},weapons,slots));
let checks=0;for(let n=1;n<=200;n++)for(let i=0;i<n;i++)for(const previous of [0,19.2,4001.7]){const rotation=spin.landingRotation(previous,i,n);assert.equal(spin.indexAtPointer(rotation,n),i);assert.ok(rotation-previous>=2160);checks++}
let sequence=[4294967295,7];assert.equal(spin.randomIndex(3,{getRandomValues(a){a[0]=sequence.shift();return a}}),1);assert.equal(sequence.length,0);
for(const name of ['app.js','catalog.js','core.js','spin-math.js'])new vm.Script(fs.readFileSync('./docs/'+name,'utf8'));
const html=fs.readFileSync('./docs/index.html','utf8'),app=fs.readFileSync('./docs/app.js','utf8');for(const m of app.matchAll(/\$\('([^']+)'\)/g))assert.ok(html.includes(`id="${m[1]}"`),`Missing DOM ID ${m[1]}`);
console.log(`PASS: slot replacement, five-slot limit, backup integrity, reset preserves armory, 22 beta records, JS syntax, DOM references, rejection sampling and ${checks} wheel alignment scenarios.`);
async function interactions(){
 const nodes=new Map,storage=new Map;let uuid=0;const noop=()=>{};
 const node=id=>{if(!nodes.has(id))nodes.set(id,{id,value:'',checked:false,hidden:false,disabled:false,textContent:'',innerHTML:'',style:{},classList:{toggle:noop},closest:()=>node('label-'+id),setAttribute:noop,removeAttribute:noop,scrollIntoView:noop,showModal:noop,close:noop,click:noop,getContext:()=>new Proxy({},{get:()=>noop}),animate:()=>({finished:Promise.resolve(),cancel:noop})});return nodes.get(id)};
 const env=vm.createContext({console,document:{getElementById:node,querySelectorAll:()=>[],querySelector:()=>node('brand'),addEventListener:noop},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},crypto:{randomUUID:()=>`kit-${++uuid}`,getRandomValues:a=>{a[0]=0;return a}},matchMedia:()=>({matches:true}),setTimeout:()=>0,clearTimeout:noop,confirm:()=>true});
 for(const f of ['catalog.js','core.js','spin-math.js','app.js'])vm.runInContext(fs.readFileSync('./docs/'+f,'utf8'),env);
 vm.runInContext("startBuild('m4');for(const a of WEAPONS.find(w=>w.id==='m4').attachments.filter(a=>a.status==='official'))choose(a.id);saveBuild()",env);
 assert.equal(vm.runInContext('state.loadouts.length',env),1);assert.equal(vm.runInContext('state.selected.length',env),1);assert.equal(vm.runInContext('state.loadouts[0].attachments.length',env),5);
 vm.runInContext('spin()',env);await Promise.resolve();assert.equal(vm.runInContext('spinning',env),false);assert.equal(node('winner').hidden,false);assert.ok(node('winner').innerHTML.includes('weapons/m4.webp'));assert.ok(node('winner').innerHTML.includes('FTAC Dominion Muzzle'));assert.equal(vm.runInContext('state.selected.length',env),1);
 vm.runInContext('spin()',env);await Promise.resolve();assert.equal(vm.runInContext('state.selected.length',env),1);
 node('resetWheel').onclick();assert.equal(vm.runInContext('state.selected.length',env),0);assert.equal(vm.runInContext('state.loadouts.length',env),1);assert.equal(node('winner').hidden,true);
 const backed=JSON.parse(storage.get('loadout-roulette-v1'));assert.equal(backed.loadouts.length,1);assert.equal(backed.selected.length,0);
 for(const w of weapons.filter(w=>w.attachments.length)){
  vm.runInContext(`{startBuild(${JSON.stringify(w.id)});let picked=new Set;for(const a of draft.attachments){if(!picked.has(a.slot)&&picked.size<5){choose(a.id);picked.add(a.slot)}}saveBuild()}`,env);
  assert.equal(vm.runInContext('Object.keys(draftAttachments).length',env),5);assert.ok(node('draftArt').innerHTML.includes(w.image));assert.ok(node('savedList').innerHTML.includes(w.image));
  const restored=core.validateState(JSON.parse(storage.get('loadout-roulette-v1')),weapons,slots);assert.equal(restored.loadouts.at(-1).weaponId,w.id);assert.equal(restored.loadouts.at(-1).attachments.length,5);
 }
 assert.equal(vm.runInContext('state.loadouts.length',env),18);
 vm.runInContext("startBuild('vulcan');$('attachmentSearch').value='bolt';renderDraft()",env);assert.ok(node('attachmentSlots').innerHTML.includes('Bolt'));assert.ok(!node('attachmentSlots').innerHTML.includes('<summary>Optic'));
 vm.runInContext("startBuild('m4');$('attachmentSearch').value='not-a-real-attachment';renderDraft()",env);assert.ok(node('attachmentSlots').innerHTML.includes('No matching attachments'));
 console.log('PASS: 17 community weapons can build/save/restore five-slot kits, attachment search, and actual app handlers build and save an M4 kit, spin twice with unchanged membership, display five winning attachments, reset and persist the preserved armory.');
}
interactions().catch(e=>{console.error(e);process.exitCode=1});
