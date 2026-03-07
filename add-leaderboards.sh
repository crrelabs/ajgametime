#!/bin/bash
# Add leaderboard to all games

SUPA_URL="https://adudgrfxwildzwpcvyil.supabase.co"
SUPA_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkdWRncmZ4d2lsZHp3cGN2eWlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyOTkzODUsImV4cCI6MjA4Nzg3NTM4NX0.-JYXn5r9QUjxbpwckwDMSvCm8w1xRXOp5lP2TWNOC_E"

LB_CSS='
/* Leaderboard styles */
#lb-overlay{position:fixed;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;z-index:100;background:rgba(0,0,0,0.92)}
#lb-overlay h2{font-family:"Lilita One",cursive;font-size:28px;color:#f59e0b;margin-bottom:12px}
#lb-list{width:min(340px,90vw);max-height:50vh;overflow-y:auto}
.lb-row{display:flex;justify-content:space-between;padding:8px 14px;border-bottom:1px solid rgba(255,255,255,0.08);color:#e2e8f0;font-size:14px;font-weight:600}
.lb-row:nth-child(1) .lb-rank{color:#fbbf24}.lb-row:nth-child(2) .lb-rank{color:#94a3b8}.lb-row:nth-child(3) .lb-rank{color:#b45309}
.lb-rank{width:30px;color:#64748b}.lb-name{flex:1;margin:0 8px}.lb-score{color:#22d3ee}
#lb-close-btn{pointer-events:auto;margin-top:16px;padding:10px 30px;font-family:"Lilita One",cursive;font-size:16px;color:#fff;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:10px;cursor:pointer}
#lb-show-btn{pointer-events:auto;padding:8px 20px;font-family:"Lilita One",cursive;font-size:14px;color:#fff;background:linear-gradient(135deg,#f59e0b,#ef4444);border:none;border-radius:8px;cursor:pointer;margin-top:8px}
#name-modal{position:fixed;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;z-index:101;background:rgba(0,0,0,0.9)}
#name-modal h2{font-family:"Lilita One",cursive;font-size:24px;color:#f59e0b;margin-bottom:6px}
#name-modal p{color:#94a3b8;font-size:14px;margin-bottom:14px}
#name-input{width:220px;padding:10px 14px;font-size:18px;font-weight:700;border:2px solid #7c3aed;border-radius:10px;background:#1a1a2e;color:#fff;text-align:center;outline:none}
#name-submit{pointer-events:auto;margin-top:12px;padding:10px 30px;font-family:"Lilita One",cursive;font-size:18px;color:#fff;background:linear-gradient(135deg,#7c3aed,#ec4899);border:none;border-radius:10px;cursor:pointer}
#name-skip{pointer-events:auto;margin-top:8px;color:#64748b;background:none;border:none;font-size:13px;cursor:pointer}
'

LB_HTML='
<div id="lb-overlay">
  <h2>🏆 Leaderboard</h2>
  <div id="lb-list"></div>
  <button id="lb-close-btn" onclick="document.getElementById('"'"'lb-overlay'"'"').style.display='"'"'none'"'"'">Close</button>
</div>
<div id="name-modal">
  <h2>New Score!</h2>
  <p id="nm-score-text">Score: 0</p>
  <input type="text" id="name-input" placeholder="Your name" maxlength="16" autocomplete="off">
  <button id="name-submit">Submit Score</button>
  <button id="name-skip">Skip</button>
</div>
'

echo "Done generating templates"
