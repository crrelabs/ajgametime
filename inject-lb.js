const fs = require('fs');

const SUPA_URL = 'https://adudgrfxwildzwpcvyil.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkdWRncmZ4d2lsZHp3cGN2eWlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyOTkzODUsImV4cCI6MjA4Nzg3NTM4NX0.-JYXn5r9QUjxbpwckwDMSvCm8w1xRXOp5lP2TWNOC_E';

const CSS = `
#lb-overlay{position:fixed;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;z-index:100;background:rgba(0,0,0,0.92)}
#lb-overlay h2{font-family:sans-serif;font-size:28px;color:#f59e0b;margin-bottom:12px;font-weight:900}
#lb-list{width:min(340px,90vw);max-height:50vh;overflow-y:auto}
.lb-row{display:flex;justify-content:space-between;padding:8px 14px;border-bottom:1px solid rgba(255,255,255,0.08);color:#e2e8f0;font-size:14px;font-weight:600}
.lb-row:nth-child(1) .lb-rank{color:#fbbf24}.lb-row:nth-child(2) .lb-rank{color:#94a3b8}.lb-row:nth-child(3) .lb-rank{color:#b45309}
.lb-rank{width:30px;color:#64748b}.lb-name{flex:1;margin:0 8px}.lb-score{color:#22d3ee}
#lb-close-btn{pointer-events:auto;margin-top:16px;padding:10px 30px;font-size:16px;font-weight:700;color:#fff;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:10px;cursor:pointer}
#lb-show-btn{pointer-events:auto;padding:8px 20px;font-size:14px;font-weight:700;color:#fff;background:linear-gradient(135deg,#f59e0b,#ef4444);border:none;border-radius:8px;cursor:pointer;margin-top:8px}
#name-modal{position:fixed;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;z-index:101;background:rgba(0,0,0,0.9)}
#name-modal h2{font-size:24px;color:#f59e0b;margin-bottom:6px;font-weight:900}
#name-modal p{color:#94a3b8;font-size:14px;margin-bottom:14px}
#name-input{width:220px;padding:10px 14px;font-size:18px;font-weight:700;border:2px solid #7c3aed;border-radius:10px;background:#1a1a2e;color:#fff;text-align:center;outline:none}
#name-submit{pointer-events:auto;margin-top:12px;padding:10px 30px;font-size:18px;font-weight:700;color:#fff;background:linear-gradient(135deg,#7c3aed,#ec4899);border:none;border-radius:10px;cursor:pointer}
#name-skip{pointer-events:auto;margin-top:8px;color:#64748b;background:none;border:none;font-size:13px;cursor:pointer}`;

const HTML = `
<div id="lb-overlay"><h2>🏆 Leaderboard</h2><div id="lb-list"></div><button id="lb-close-btn">Close</button></div>
<div id="name-modal"><h2>New Score!</h2><p id="nm-score-text">Score: 0</p><input type="text" id="name-input" placeholder="Your name" maxlength="16" autocomplete="off"><button id="name-submit">Submit Score</button><button id="name-skip">Skip</button></div>`;

function makeJS(gameName) {
  return `
// === LEADERBOARD ===
const _LB_URL='${SUPA_URL}';const _LB_KEY='${SUPA_KEY}';const _LB_GAME='${gameName}';
async function _lbFetch(){try{const r=await fetch(_LB_URL+'/rest/v1/ajgametime_leaderboard?game=eq.'+_LB_GAME+'&order=score.desc&limit=20',{headers:{'apikey':_LB_KEY,'Authorization':'Bearer '+_LB_KEY}});return await r.json();}catch(e){return[];}}
async function _lbSubmit(name,sc){try{await fetch(_LB_URL+'/rest/v1/ajgametime_leaderboard',{method:'POST',headers:{'apikey':_LB_KEY,'Authorization':'Bearer '+_LB_KEY,'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify({game:_LB_GAME,player_name:name,score:sc,wave:1})});}catch(e){}}
async function _lbShow(){const lb=document.getElementById('lb-overlay');const list=document.getElementById('lb-list');list.innerHTML='<div style="color:#64748b;text-align:center;padding:20px">Loading...</div>';lb.style.display='flex';const data=await _lbFetch();if(!data.length){list.innerHTML='<div style="color:#64748b;text-align:center;padding:20px">No scores yet!</div>';return;}list.innerHTML=data.map((d,i)=>'<div class="lb-row"><span class="lb-rank">#'+(i+1)+'</span><span class="lb-name">'+d.player_name+'</span><span class="lb-score">'+d.score+'</span></div>').join('');}
document.getElementById('lb-close-btn').addEventListener('click',()=>document.getElementById('lb-overlay').style.display='none');
document.getElementById('name-submit').addEventListener('click',async()=>{const n=document.getElementById('name-input').value.trim()||'Anonymous';await _lbSubmit(n,_lbPendingScore);localStorage.setItem('ajgt_name',n);document.getElementById('name-modal').style.display='none';_lbShow();});
document.getElementById('name-skip').addEventListener('click',()=>document.getElementById('name-modal').style.display='none');
document.getElementById('name-input').addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('name-submit').click();});
let _lbPendingScore=0;
function _lbGameOver(sc){_lbPendingScore=sc;document.getElementById('nm-score-text').textContent='Score: '+sc;document.getElementById('name-input').value=localStorage.getItem('ajgt_name')||'';document.getElementById('name-modal').style.display='flex';document.getElementById('name-input').focus();}
// === END LEADERBOARD ===`;
}

// Games to process
const games = [
  { file: 'hoops.html', name: 'shooting-hoops', scoreVar: 'score', endFn: 'endGame', findEnd: 'function endGame()' },
  { file: 'taco-run.html', name: 'taco-run', scoreVar: 'score', endFn: 'endGame', findEnd: 'function endGame()' },
  { file: 'road-racer.html', name: 'road-racer', scoreVar: 'score', endFn: 'endGame', findEnd: 'function endGame()' },
  { file: 'mouse-chase.html', name: 'mouse-chase', scoreVar: 'score', endFn: 'endGame', findEnd: 'function endGame()' },
  { file: 'ghost-catcher.html', name: 'ghost-catcher', scoreVar: 'score', endFn: 'endGame', findEnd: 'function endGame()' },
  { file: 'crab-dash.html', name: 'crab-dash', scoreVar: 'score', endFn: 'gameOver', findEnd: 'function gameOver()' },
];

const dir = '/tmp/ajgametime-work';

for (const g of games) {
  const path = `${dir}/${g.file}`;
  let html = fs.readFileSync(path, 'utf8');
  
  // Skip if already has leaderboard
  if (html.includes('lb-overlay') || html.includes('_lbFetch')) {
    console.log(`${g.file}: already has leaderboard, skipping`);
    continue;
  }
  
  // 1. Add CSS before </style>
  html = html.replace('</style>', CSS + '\n</style>');
  
  // 2. Add HTML before </body>
  // Also add a leaderboard button to the game over screen
  html = html.replace('</body>', HTML + '\n</body>');
  
  // 3. Add JS before </script> (last one)
  const lastScriptIdx = html.lastIndexOf('</script>');
  html = html.slice(0, lastScriptIdx) + makeJS(g.name) + '\n</script>' + html.slice(lastScriptIdx + '</script>'.length);
  
  // 4. Hook into game over function — add _lbGameOver call
  // Find the endGame/gameOver function and add our call at the start
  const fnPattern = g.findEnd;
  const fnIdx = html.indexOf(fnPattern);
  if (fnIdx !== -1) {
    // Find the opening brace after the function declaration
    const braceIdx = html.indexOf('{', fnIdx);
    if (braceIdx !== -1) {
      html = html.slice(0, braceIdx + 1) + `\n  _lbGameOver(${g.scoreVar});` + html.slice(braceIdx + 1);
    }
  }
  
  // 5. Add leaderboard button to start/game-over screen
  // Look for the play again button and add lb button after it
  const playBtnMatch = html.match(/(<button[^>]*>.*?(?:Try Again|Play Again|Ride Again|Dash Again|Enter).*?<\/button>)/);
  if (playBtnMatch) {
    const afterBtn = playBtnMatch[0];
    // Only add if not already there
    if (!html.includes('lb-show-btn')) {
      html = html.replace(afterBtn, afterBtn + '\n  <button id="lb-show-btn" onclick="_lbShow()">🏆 Leaderboard</button>');
    }
  }
  
  fs.writeFileSync(path, html);
  console.log(`${g.file}: leaderboard added ✅`);
}

console.log('Done!');
