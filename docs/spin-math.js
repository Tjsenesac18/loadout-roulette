(function(root){
function randomIndex(n,cryptoSource=globalThis.crypto){if(!Number.isInteger(n)||n<1)throw new Error('Empty wheel');const limit=Math.floor(4294967296/n)*n;let x;do{x=cryptoSource.getRandomValues(new Uint32Array(1))[0]}while(x>=limit);return x%n}
function landingRotation(previous,index,count,turns=6){const slice=360/count;const desired=((360-(index+.5)*slice)%360+360)%360;const normalized=((previous%360)+360)%360;return previous+turns*360+((desired-normalized+360)%360)}
function indexAtPointer(rotation,count){const local=(((-rotation)%360)+360)%360;return Math.min(count-1,Math.floor(local/(360/count)))}
const api={randomIndex,landingRotation,indexAtPointer};if(typeof module!=='undefined')module.exports=api;else root.SpinMath=api;
})(globalThis);
