import math,json
from pathlib import Path
n=[31,59,30,18,3,1];base=[1.5,1.3,1.1,.95,.75,.4]
def alloc(w):return [1e9*x/sum(c*v for c,v in zip(n,w)) for x in w]
a0=alloc(base)
cases=[('Paper baseline',base),('Equal absolute steps · 3.75:1',[1.5-i*(1.1/5) for i in range(6)]),('Equal proportional steps · 3.75:1',[1.5*(.4/1.5)**(i/5) for i in range(6)])]
for r in [2,5]:cases.append((f'Baseline shape · {r}:1',[.4*(w/.4)**(math.log(r)/math.log(3.75)) for w in base]))
out=[]
for name,w in cases:
 a=alloc(w);total=[x*c for x,c in zip(a,n)];delta=[(x/y-1)*100 for x,y in zip(a,a0)];moved=sum(abs(x-y)*c for x,y,c in zip(a,a0,n))/2
 assert all(a[i]>a[i+1] for i in range(5)) and abs(sum(total)-1e9)<1e-5
 out.append(dict(name=name,weights=w,alloc=a,delta=delta,totals=total,moved=moved,ratio=w[0]/w[-1]))
print(json.dumps(out,indent=2))
Path('work/weight_comparison.json').write_text(json.dumps(out))
