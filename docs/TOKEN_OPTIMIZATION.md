# Token Optimization Patterns

## The Rule
Every tool call carries your FULL conversation context to the model.
Do MORE work per call, not more calls.

## Patterns

### BAD (5 calls = 5x context)
```
terminal("git status")
terminal("git log --oneline -3")
terminal("git diff main")
read_file("README.md")
read_file("AGENTS.md")
```

### GOOD (1 call = 1x context)
```
execute_code('''
import subprocess, os
status = subprocess.run(["git","status"], capture_output=True, text=True).stdout
log = subprocess.run(["git","log","--oneline","-3"], capture_output=True, text=True).stdout
diff = subprocess.run(["git","diff","main"], capture_output=True, text=True).stdout
readme = open("README.md").read()[:2000]
agents = open("AGENTS.md").read()[:2000]
print(f"STATUS:\n{status}\nLOG:\n{log}\nDIFF:\n{diff}\nREADME:\n{read}")
''')
```

### Batch file reads with pathlib
```python
from pathlib import Path
files = list(Path("src").rglob("*.ts"))[:20]
for f in files:
    print(f"=== {f} ===")
    print(f.read_text()[:500])
```

### Pre-compute diffs once, reference by hash
```bash
# Run ONCE, save to temp
git diff main..wt/p1-rebrand > /tmp/diff-rebrand.txt
# Reference in tasks: "see /tmp/diff-rebrand.txt — +26/-26 across 13 files"
```

## Kanban Worker Optimization

### For task creators
- Pre-compute `git diff main..<branch>` and paste summary into task body
- Instead of "read the file and check X", paste the relevant snippet
- Merge 3 small related tasks into one worker session
- Set `goal_mode: leaf` (strips agent framework overhead)

### For task workers
- Read only files you need to modify
- Batch reads via execute_code
- Don't re-run git commands — use cached output
- One commit per logical change, not per file
