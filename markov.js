// ====== SCENARIOS HMM ======
const SCENARIOS = [
  { 
    id:'weather', emoji:'🌦️', name:'Clima', desc:'HMM: Estado = Clima Real, Observación = Sensor Humedad',
    states:['Soleado','Nublado','Lluvioso'], // Estados Ocultos
    observations:['Humedad Baja', 'Humedad Media', 'Humedad Alta'], // Observaciones Visibles
    initial:[0.6, 0.3, 0.1], // Distribución Inicial (Pi)
    transition:[ // Matriz de Transición (A)
      [0.7, 0.2, 0.1],
      [0.3, 0.4, 0.3],
      [0.2, 0.3, 0.5]
    ],
    emission:[ // Matriz de Emisión (B)
      [0.8, 0.15, 0.05], // Soleado -> [Baja, Media, Alta]
      [0.2, 0.6, 0.2],   // Nublado -> [Baja, Media, Alta]
      [0.05, 0.25, 0.7]  // Lluvioso -> [Baja, Media, Alta]
    ]
  },
  { 
    id:'ecommerce', emoji:'🛒', name:'Cliente E-commerce', desc:'HMM: Estado = Intención, Observación = Comportamiento',
    states:['Dudoso', 'Interesado', 'Decidido'],
    observations:['Scroll Lento', 'Pausa', 'Click Rápido'],
    initial:[0.5, 0.4, 0.1],
    transition:[
      [0.6, 0.3, 0.1],
      [0.2, 0.5, 0.3],
      [0.1, 0.2, 0.7]
    ],
    emission:[
      [0.6, 0.3, 0.1], // Dudoso
      [0.2, 0.6, 0.2], // Interesado
      [0.1, 0.2, 0.7]  // Decidido
    ]
  },
  { 
    id:'health', emoji:'🏥', name:'Estado de Salud', desc:'HMM: Estado = Salud Real, Observación = Síntomas',
    states:['Sano', 'Infección Leve', 'Infección Grave'],
    observations:['Temp Normal', 'Fiebre Leve', 'Fiebre Alta'],
    initial:[0.8, 0.15, 0.05],
    transition:[
      [0.8, 0.15, 0.05],
      [0.2, 0.6, 0.2],
      [0.05, 0.3, 0.65]
    ],
    emission:[
      [0.9, 0.08, 0.02], // Sano
      [0.3, 0.6, 0.1],   // Leve
      [0.05, 0.15, 0.8]  // Grave
    ]
  },
  { 
    id:'stock', emoji:'📈', name:'Mercado Bursátil', desc:'HMM: Estado = Tendencia, Observación = Variación Diaria',
    states:['Bear (Baja)', 'Stagnant (Estable)', 'Bull (Alza)'],
    observations:['Caída Fuerte', 'Variación Mínima', 'Subida Fuerte'],
    initial:[0.3, 0.4, 0.3],
    transition:[
      [0.6, 0.3, 0.1],
      [0.2, 0.6, 0.2],
      [0.1, 0.3, 0.6]
    ],
    emission:[
      [0.7, 0.2, 0.1], // Bear
      [0.15, 0.7, 0.15], // Stagnant
      [0.1, 0.2, 0.7]  // Bull
    ]
  }
];

const COLORS=['#6366f1','#06b6d4','#f472b6','#f59e0b','#10b981','#e879f9'];
const OBS_COLORS=['#94a3b8', '#fbbf24', '#f87171', '#34d399'];
let currentScenario=SCENARIOS[0], simResults=null;

// ====== INIT ======
function init(){
  const grid=document.getElementById('scenario-grid');
  grid.innerHTML=SCENARIOS.map((s,i)=>`<div class="scenario-card${i===0?' active':''}" id="sc-${s.id}" onclick="selectScenario('${s.id}')"><div class="scenario-emoji">${s.emoji}</div><div class="scenario-name">${s.name}</div><div class="scenario-desc">${s.desc}</div></div>`).join('');
  loadScenario(currentScenario);
  document.getElementById('num-steps').oninput=e=>document.getElementById('num-steps-value').textContent=e.target.value;
  document.getElementById('num-simulations').oninput=e=>document.getElementById('num-simulations-value').textContent=e.target.value;
}

function selectScenario(id){
  currentScenario=SCENARIOS.find(s=>s.id===id);
  document.querySelectorAll('.scenario-card').forEach(c=>c.classList.remove('active'));
  document.getElementById('sc-'+id).classList.add('active');
  loadScenario(currentScenario);
  resetResults();
}

function loadScenario(sc){
  renderInitial(sc.states, sc.initial);
  renderMatrix('transition-matrix', sc.states, sc.states, sc.transition, 'transition');
  renderMatrix('emission-matrix', sc.states, sc.observations, sc.emission, 'emission');
  drawDiagram(sc.states, sc.transition);
}

// ====== MATRICES ======
function renderInitial(states, initial){
  let h='<table class="matrix-table"><thead><tr>';
  states.forEach(s=>h+=`<th>${s}</th>`);
  h+='</tr></thead><tbody><tr>';
  states.forEach((_,i)=>h+=`<td><input class="matrix-input initial-input" type="number" step="0.01" min="0" max="1" value="${initial[i]}" data-i="${i}" onchange="onMatrixChange()"></td>`);
  h+='</tr></tbody></table>';
  document.getElementById('initial-container').innerHTML=h;
}

function renderMatrix(containerId, rows, cols, matrix, type){
  let h='<table class="matrix-table"><thead><tr><th></th>';
  cols.forEach(c=>h+=`<th>${c}</th>`);
  h+='</tr></thead><tbody>';
  for(let i=0;i<rows.length;i++){
    h+=`<tr><th class="row-header">${rows[i]}</th>`;
    for(let j=0;j<cols.length;j++)
      h+=`<td><input class="matrix-input ${type}-input" type="number" step="0.01" min="0" max="1" value="${matrix[i][j]}" data-i="${i}" data-j="${j}" onchange="onMatrixChange()"></td>`;
    h+='</tr>';
  }
  h+='</tbody></table>';
  document.getElementById(containerId).innerHTML=h;
}

function getInitial(){
  const n=currentScenario.states.length, ini=[];
  for(let i=0;i<n;i++) ini[i]=parseFloat(document.querySelector(`.initial-input[data-i="${i}"]`).value)||0;
  return ini;
}

function getMatrix(type, rows, cols){
  const m=[];
  for(let i=0;i<rows;i++){
    m[i]=[];
    for(let j=0;j<cols;j++) m[i][j]=parseFloat(document.querySelector(`.${type}-input[data-i="${i}"][data-j="${j}"]`).value)||0;
  }
  return m;
}

function onMatrixChange(){
  currentScenario.initial=getInitial();
  currentScenario.transition=getMatrix('transition', currentScenario.states.length, currentScenario.states.length);
  currentScenario.emission=getMatrix('emission', currentScenario.states.length, currentScenario.observations.length);
  validateMatrices();
  drawDiagram(currentScenario.states, currentScenario.transition);
}

function validateMatrices(){
  const ini=getInitial();
  const trans=getMatrix('transition', currentScenario.states.length, currentScenario.states.length);
  const em=getMatrix('emission', currentScenario.states.length, currentScenario.observations.length);
  
  let valid=true;
  if(Math.abs(ini.reduce((a,b)=>a+b,0)-1)>0.01) valid=false;
  for(let i=0;i<trans.length;i++){ if(Math.abs(trans[i].reduce((a,b)=>a+b,0)-1)>0.01) valid=false; }
  for(let i=0;i<em.length;i++){ if(Math.abs(em[i].reduce((a,b)=>a+b,0)-1)>0.01) valid=false; }
  
  const el=document.getElementById('matrix-validation');
  el.className='matrix-validation '+(valid?'success':'error');
  el.style.display='block';
  el.textContent=valid?'✓ Probabilidades válidas (todas las filas suman 1.0)':'✗ Error: Las distribuciones deben sumar 1.0 en todas las filas.';
}

// ====== DIAGRAM ======
function drawDiagram(states, matrix){
  const c=document.getElementById('state-diagram'), ctx=c.getContext('2d');
  const W=c.width, H=c.height, n=states.length, cx=W/2, cy=H/2, R=Math.min(W,H)*0.32;
  ctx.clearRect(0,0,W,H);
  const pos=states.map((_,i)=>{const a=(-Math.PI/2)+(2*Math.PI*i/n);return{x:cx+R*Math.cos(a),y:cy+R*Math.sin(a)};});
  
  for(let i=0;i<n;i++) for(let j=0;j<n;j++){
    if(matrix[i][j]<0.01) continue;
    const p=pos[i], q=pos[j], lw=1+matrix[i][j]*4;
    ctx.globalAlpha=0.3+matrix[i][j]*0.7;
    if(i===j){
      ctx.beginPath(); ctx.arc(p.x, p.y-28, 18, 0, Math.PI*2);
      ctx.strokeStyle=COLORS[i%COLORS.length]; ctx.lineWidth=lw; ctx.stroke();
    } else {
      const dx=q.x-p.x, dy=q.y-p.y, d=Math.sqrt(dx*dx+dy*dy), ux=dx/d, uy=dy/d;
      const sx=p.x+ux*26, sy=p.y+uy*26, ex=q.x-ux*26, ey=q.y-uy*26;
      ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(ex,ey);
      ctx.strokeStyle=COLORS[i%COLORS.length]; ctx.lineWidth=lw; ctx.stroke();
      const al=10, aa=0.4;
      ctx.beginPath(); ctx.moveTo(ex,ey);
      ctx.lineTo(ex-al*Math.cos(Math.atan2(ey-sy,ex-sx)-aa), ey-al*Math.sin(Math.atan2(ey-sy,ex-sx)-aa));
      ctx.moveTo(ex,ey);
      ctx.lineTo(ex-al*Math.cos(Math.atan2(ey-sy,ex-sx)+aa), ey-al*Math.sin(Math.atan2(ey-sy,ex-sx)+aa));
      ctx.stroke();
      const mx=(sx+ex)/2+uy*14, my=(sy+ey)/2-ux*14;
      ctx.globalAlpha=1; ctx.font='600 11px Inter'; ctx.fillStyle='#94a3b8'; ctx.textAlign='center';
      ctx.fillText(matrix[i][j].toFixed(2), mx, my);
    }
    ctx.globalAlpha=1;
  }
  
  pos.forEach((p,i)=>{
    ctx.beginPath(); ctx.arc(p.x,p.y,24,0,Math.PI*2);
    ctx.fillStyle=COLORS[i%COLORS.length]; ctx.globalAlpha=0.15; ctx.fill();
    ctx.globalAlpha=1; ctx.strokeStyle=COLORS[i%COLORS.length]; ctx.lineWidth=2; ctx.stroke();
    ctx.font='600 12px Inter'; ctx.fillStyle=COLORS[i%COLORS.length]; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(states[i].substring(0,6), p.x, p.y);
  });
}

// ====== SIMULATION ENGINE ======
function sampleIndex(probabilities){
  let r=Math.random(), cum=0;
  for(let i=0;i<probabilities.length;i++){
    cum+=probabilities[i];
    if(r<=cum) return i;
  }
  return probabilities.length-1;
}

function simulateHMM(initial, transition, emission, steps){
  const hiddenTrace=[];
  const obsTrace=[];
  
  // Paso Inicial
  let state = sampleIndex(initial);
  hiddenTrace.push(state);
  obsTrace.push(sampleIndex(emission[state]));
  
  // Siguientes pasos
  for(let t=1;t<steps;t++){
    state = sampleIndex(transition[state]);
    hiddenTrace.push(state);
    obsTrace.push(sampleIndex(emission[state]));
  }
  
  return {hiddenTrace, obsTrace};
}

// Viterbi Algorithm para inferir estados ocultos a partir de observaciones
function viterbi(obsTrace, states, initial, transition, emission){
  const T = obsTrace.length;
  const N = states.length;
  const V = Array(T).fill(0).map(()=>Array(N).fill(0)); // Probabilidades
  const ptr = Array(T).fill(0).map(()=>Array(N).fill(0)); // Backpointers
  
  // Initialization
  const obs0 = obsTrace[0];
  for(let s=0;s<N;s++){
    V[0][s] = initial[s] * emission[s][obs0];
    ptr[0][s] = 0;
  }
  
  // Recursion
  for(let t=1;t<T;t++){
    const obs = obsTrace[t];
    for(let s=0;s<N;s++){
      let max_prob = -1;
      let max_s = -1;
      for(let prev_s=0;prev_s<N;prev_s++){
        const prob = V[t-1][prev_s] * transition[prev_s][s] * emission[s][obs];
        if(prob > max_prob){
          max_prob = prob;
          max_s = prev_s;
        }
      }
      V[t][s] = max_prob;
      ptr[t][s] = max_s;
    }
    
    // Normalizar para evitar underflow
    const sum = V[t].reduce((a,b)=>a+b, 0);
    if(sum > 0){
      for(let s=0;s<N;s++) V[t][s] /= sum;
    }
  }
  
  // Termination
  let bestPathProb = -1;
  let bestLastState = 0;
  for(let s=0;s<N;s++){
    if(V[T-1][s] > bestPathProb){
      bestPathProb = V[T-1][s];
      bestLastState = s;
    }
  }
  
  // Backtrack
  const inferredPath = new Array(T);
  inferredPath[T-1] = bestLastState;
  for(let t=T-1;t>0;t--){
    inferredPath[t-1] = ptr[t][inferredPath[t]];
  }
  
  return inferredPath;
}

function computeFrequencies(trace, n){
  const freq=new Array(n).fill(0);
  trace.forEach(s=>freq[s]++);
  return freq.map(f=>f/trace.length);
}

function stationaryDistribution(matrix, iters=200){
  const n=matrix.length; let pi=new Array(n).fill(1/n);
  for(let t=0;t<iters;t++){
    const next=new Array(n).fill(0);
    for(let j=0;j<n;j++) for(let i=0;i<n;i++) next[j]+=pi[i]*matrix[i][j];
    pi=next;
  }
  return pi;
}

// ====== RUN ======
function runSimulation(){
  const ini=getInitial();
  const trans=getMatrix('transition', currentScenario.states.length, currentScenario.states.length);
  const em=getMatrix('emission', currentScenario.states.length, currentScenario.observations.length);
  const steps=parseInt(document.getElementById('num-steps').value);
  const numSim=parseInt(document.getElementById('num-simulations').value);
  const n=currentScenario.states.length;
  
  // HMM Simulation
  const {hiddenTrace, obsTrace} = simulateHMM(ini, trans, em, steps);
  const inferredTrace = viterbi(obsTrace, currentScenario.states, ini, trans, em);
  
  // Accuracy
  let correct = 0;
  for(let i=0;i<steps;i++) if(hiddenTrace[i] === inferredTrace[i]) correct++;
  const accuracy = (correct/steps)*100;
  
  const freq=computeFrequencies(hiddenTrace, n);
  const stationary=stationaryDistribution(trans);
  
  // Multi sim
  const allFreqs=[];
  let multiCorrect = 0;
  for(let s=0;s<numSim;s++){
    const tr = simulateHMM(ini, trans, em, steps);
    allFreqs.push(computeFrequencies(tr.hiddenTrace, n));
    const infTr = viterbi(tr.obsTrace, currentScenario.states, ini, trans, em);
    let c=0;
    for(let i=0;i<steps;i++) if(tr.hiddenTrace[i] === infTr[i]) c++;
    multiCorrect += c;
  }
  const avgAccuracy = (multiCorrect/(numSim*steps))*100;
  
  const avgFreq=new Array(n).fill(0);
  allFreqs.forEach(f=>f.forEach((v,i)=>avgFreq[i]+=v));
  avgFreq.forEach((_,i)=>avgFreq[i]/=numSim);

  simResults={hiddenTrace, obsTrace, inferredTrace, accuracy, avgAccuracy, freq, stationary, avgFreq, allFreqs, steps, numSim};
  
  document.getElementById('results-wrapper').classList.remove('hidden');
  drawTraceChart('trace-chart', hiddenTrace, currentScenario.states, COLORS, 'Estados Ocultos Reales');
  drawTraceChart('obs-chart', obsTrace, currentScenario.observations, OBS_COLORS, 'Observaciones');
  drawTraceChart('inferred-chart', inferredTrace, currentScenario.states, COLORS, 'Estados Inferidos (Viterbi)');
  
  drawBarChart('freq-chart', currentScenario.states, [{label:'Freq Simulada', data:freq, color:'#6366f1'}]);
  drawBarChart('stationary-chart', currentScenario.states,[
    {label:'Simulación', data:freq, color:'#6366f1'},
    {label:'Teórica (π)', data:stationary, color:'#06b6d4'}
  ]);
  
  renderStats(freq, stationary, avgFreq, accuracy, avgAccuracy);
}

function resetResults(){
  document.getElementById('results-wrapper').classList.add('hidden');
  simResults=null;
}

// ====== CHARTS ======
function drawTraceChart(canvasId, trace, labels, colorPalette, titleText){
  const c=document.getElementById(canvasId), ctx=c.getContext('2d');
  const W=c.width, H=c.height, n=labels.length;
  const pad={t:30,b:40,l:100,r:20}, pw=W-pad.l-pad.r, ph=H-pad.t-pad.b;
  ctx.clearRect(0,0,W,H);
  
  ctx.font='600 12px Inter'; ctx.fillStyle='#e2e8f0'; ctx.textAlign='left';
  ctx.fillText(titleText, 10, 20);
  
  ctx.strokeStyle='rgba(99,102,241,0.08)'; ctx.lineWidth=1;
  for(let i=0;i<n;i++){const y=pad.t+ph-i*(ph/(Math.max(1,n-1)));ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(W-pad.r,y);ctx.stroke();}
  
  ctx.font='500 11px Inter'; ctx.fillStyle='#94a3b8'; ctx.textAlign='right'; ctx.textBaseline='middle';
  labels.forEach((s,i)=>{const y=pad.t+ph-i*(ph/(Math.max(1,n-1)));ctx.fillText(s,pad.l-8,y);});
  
  ctx.textAlign='center'; ctx.textBaseline='top';
  const xStep=Math.max(1,Math.floor(trace.length/10));
  for(let i=0;i<trace.length;i+=xStep){const x=pad.l+(i/(trace.length-1))*pw;ctx.fillText(i,x,H-pad.b+8);}
  
  ctx.beginPath();
  trace.forEach((s,i)=>{
    const x=pad.l+(i/(trace.length-1))*pw, y=pad.t+ph-s*(ph/(Math.max(1,n-1)));
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.strokeStyle='#6366f1'; ctx.lineWidth=1.5; ctx.globalAlpha=0.7; ctx.stroke(); ctx.globalAlpha=1;
  
  let prev=-1;
  trace.forEach((s,i)=>{
    if(s!==prev){
      const x=pad.l+(i/(trace.length-1))*pw, y=pad.t+ph-s*(ph/(Math.max(1,n-1)));
      ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2);
      ctx.fillStyle=colorPalette[s%colorPalette.length]; ctx.fill();
      prev=s;
    }
  });
}

function drawBarChart(canvasId, labels, datasets){
  const c=document.getElementById(canvasId), ctx=c.getContext('2d');
  const W=c.width, H=c.height;
  const pad={t:30,b:50,l:50,r:20}, pw=W-pad.l-pad.r, ph=H-pad.t-pad.b;
  ctx.clearRect(0,0,W,H);
  const n=labels.length, groupW=pw/n, barW=groupW/(datasets.length+1);
  const maxVal=Math.max(...datasets.flatMap(d=>d.data),0.01);
  
  for(let i=0;i<=4;i++){
    const y=pad.t+ph-i*(ph/4); ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(W-pad.r,y);
    ctx.strokeStyle='rgba(99,102,241,0.08)'; ctx.lineWidth=1; ctx.stroke();
    ctx.font='500 10px JetBrains Mono'; ctx.fillStyle='#64748b'; ctx.textAlign='right'; ctx.textBaseline='middle';
    ctx.fillText((maxVal*i/4).toFixed(2),pad.l-6,y);
  }
  
  datasets.forEach((ds,di)=>{
    ds.data.forEach((v,i)=>{
      const x=pad.l+i*groupW+di*barW+barW*0.3, bw=barW*0.7, bh=(v/maxVal)*ph;
      const y=pad.t+ph-bh;
      ctx.fillStyle=ds.color; ctx.globalAlpha=0.8;
      ctx.beginPath(); ctx.roundRect(x,y,bw,bh,3); ctx.fill();
      ctx.globalAlpha=1;
      ctx.font='600 10px JetBrains Mono'; ctx.fillStyle=ds.color; ctx.textAlign='center';
      ctx.fillText(v.toFixed(3),x+bw/2,y-8);
    });
  });
  
  ctx.font='500 11px Inter'; ctx.fillStyle='#94a3b8'; ctx.textAlign='center'; ctx.textBaseline='top';
  labels.forEach((l,i)=>{const x=pad.l+i*groupW+groupW/2;ctx.fillText(l,x,H-pad.b+8);});
  
  let lx=pad.l;
  datasets.forEach(ds=>{
    ctx.fillStyle=ds.color; ctx.fillRect(lx,8,12,12);
    ctx.font='500 10px Inter'; ctx.fillStyle='#94a3b8'; ctx.textAlign='left';
    ctx.fillText(ds.label,lx+16,17); lx+=ctx.measureText(ds.label).width+32;
  });
}

function renderStats(freq, stationary, avgFreq, accuracy, avgAccuracy){
  const states=currentScenario.states, n=states.length;
  let h=`<table class="stats-table"><thead><tr><th>Estado Oculto</th><th>Freq. Simulada</th><th>Dist. Estacionaria (π)</th><th>Error Absoluto</th></tr></thead><tbody>`;
  for(let i=0;i<n;i++){
    h+=`<tr><td><span class="state-dot" style="background:${COLORS[i%COLORS.length]}"></span>${states[i]}</td>`;
    h+=`<td>${freq[i].toFixed(4)}</td><td>${stationary[i].toFixed(4)}</td>`;
    h+=`<td>${Math.abs(freq[i]-stationary[i]).toFixed(4)}</td></tr>`;
  }
  h+='</tbody></table>';
  document.getElementById('stats-table-wrapper').innerHTML=h;
  
  let h2=`<table class="stats-table" style="margin-top:1rem"><thead><tr><th>Métrica Viterbi (Inferencia)</th><th>Valor</th></tr></thead><tbody>`;
  h2+=`<tr><td>Precisión de Inferencia (1 simulación)</td><td style="color:#10b981; font-weight:bold">${accuracy.toFixed(2)}%</td></tr>`;
  h2+=`<tr><td>Precisión Promedio (${simResults.numSim} simulaciones)</td><td style="color:#10b981; font-weight:bold">${avgAccuracy.toFixed(2)}%</td></tr>`;
  h2+='</tbody></table>';
  document.getElementById('viterbi-stats-wrapper').innerHTML=h2;
}

if(!CanvasRenderingContext2D.prototype.roundRect){
  CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){
    this.moveTo(x+r,y); this.lineTo(x+w-r,y); this.quadraticCurveTo(x+w,y,x+w,y+r);
    this.lineTo(x+w,y+h-r); this.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    this.lineTo(x+r,y+h); this.quadraticCurveTo(x,y+h,x,y+h-r);
    this.lineTo(x,y+r); this.quadraticCurveTo(x,y,x+r,y);
  };
}

window.addEventListener('DOMContentLoaded', init);
