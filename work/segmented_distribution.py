from pathlib import Path
import csv,hashlib
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Patch
from matplotlib.ticker import FuncFormatter
import numpy as np
p=Path('outputs/iusaf-distribution');original=p/'country-distributions.png';before=hashlib.sha256(original.read_bytes()).hexdigest()
rows=list(csv.DictReader((p/'figure-data.csv').open()))
bands=np.array([int(r['Band']) for r in rows]);u=np.array([float(r['UN assessment percent']) for r in rows]);raw=np.array([float(r['Raw inversion allocation percent']) for r in rows]);banded=np.array([float(r['Banded allocation percent']) for r in rows])
colors=['#147D92','#48A9A6','#89B9B0','#D7AE64','#CE7950','#98465A'];cs=[colors[b-1] for b in bands]
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':11,'axes.spines.top':False,'axes.spines.right':False,'axes.spines.left':False,'axes.spines.bottom':False,'svg.fonttype':'none','text.color':'#193445','axes.labelcolor':'#193445','xtick.color':'#526775','ytick.color':'#526775'})
fig=plt.figure(figsize=(16,9))
fig.text(.07,.945,'From UN assessments to IUSAF allocations',fontsize=25,weight='bold')
fig.text(.07,.903,'Segmented view • same 142 Parties • UN assessments shown on separate scales within each band',fontsize=13,color='#526775')
fig.text(.07,.86,'1  UN assessment as recorded',fontsize=14,weight='bold')
fig.text(.97,.86,'Vertical axes: % of UN budget — compare values, not heights across segments',fontsize=10,ha='right',color='#526775')
ceilings=[.0012,.012,.12,1.0,1.6,24];ticks=[[0,.001],[0,.005,.01],[0,.05,.1],[0,.5,1],[0,.75,1.5],[0,10,20]]
for i in range(6):
 ax=fig.add_axes([.07+i*.153,.625,.117,.17]);idx=np.where(bands==i+1)[0];v=u[idx];ax.bar(np.arange(len(idx)),v,color=colors[i],width=.8 if len(idx)>3 else .55,zorder=3)
 ax.set_ylim(0,ceilings[i]);ax.set_yticks(ticks[i]);ax.yaxis.set_major_formatter(FuncFormatter(lambda x,pos:f'{x:g}'));ax.grid(axis='y',alpha=.18);ax.tick_params(length=0,labelsize=9)
 ax.set_title(f'Band {i+1} · {len(idx)} {"Party" if len(idx)==1 else "Parties"}',fontsize=11,weight='bold',pad=9)
 if i==4:ax.set_xticks(range(3),[rows[j]['Party'] for j in idx],fontsize=9)
 elif i==5:ax.set_xticks([0],['China'],fontsize=9);ax.text(0,v[0]+.6,'20.004%',ha='center',fontsize=10)
 else:ax.set_xticks([0,len(idx)-1],[str(idx[0]+1),str(idx[-1]+1)],fontsize=9)
 if i==0:ax.text(.5,.47,'28 at 0.001%\n3 without assessment',transform=ax.transAxes,ha='center',fontsize=8,color='#193445',bbox={'facecolor':'white','edgecolor':'none','alpha':.9,'pad':2})
 ax.set_xlim(-.6,len(idx)-.4)
for y,vals,title in [(.405,raw,'2  Raw inversion: normalised 1 / assessment'),(.185,banded,'3  Banded inversion: paper baseline, 3.75 : 1')]:
 ax=fig.add_axes([.07,y,.895,.135]);ax.bar(range(142),vals,color=cs,width=.88,zorder=3);ax.set_xlim(-1,142);ax.set_ylim(0,max(vals)*1.22);ax.set_title(title,loc='left',fontsize=14,weight='bold',pad=10);ax.set_ylabel('Allocation (%)',fontsize=10);ax.grid(axis='y',alpha=.18);ax.tick_params(length=0,labelsize=9)
 for b in range(1,6):ax.axvline(sum(bands<=b)-.5,color='#cad5db',lw=.7)
 if y==.185:ax.set_xticks([0,30,60,90,120,141],['1','31','61','91','121','142']);ax.set_xlabel('Party position, ordered by increasing original UN assessment',fontsize=10)
 else:ax.set_xticks([])
fig.legend(handles=[Patch(color=c,label=f'Band {i+1}') for i,c in enumerate(colors)],loc='lower center',bbox_to_anchor=(.52,.085),ncol=6,frameon=False,fontsize=10)
fig.text(.07,.064,'Cook Islands, Niue and State of Palestine have no positive assessment: the raw model assigns zero; banded inversion includes them.',fontsize=10)
fig.text(.07,.03,'Source: UN scale, 2027 column; version 3 membership and Table 1 weights. Segment widths do not represent membership. No SOSAC or TSAC.',fontsize=10,color='#526775')
for ext in ['png','svg']:fig.savefig(p/('country-distributions-segmented.'+ext),dpi=240,facecolor='white')
assert hashlib.sha256(original.read_bytes()).hexdigest()==before
print('Created separate segmented PNG and SVG; original PNG unchanged.')
