from pathlib import Path
import csv
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Patch
from matplotlib.lines import Line2D
import numpy as np
p=Path('/Users/pauloldham/Documents/cali-allocation-model-unscale-v3');o=Path('outputs/iusaf-distribution')
def read(f):return list(csv.DictReader(f.open()))
order=read(o/'figure-data.csv');source={r['iso3c']:r for r in read(p/'country_allocations.csv')};rows=[source[r['ISO3']] for r in order];assert len(rows)==142
annex={r['party']:r for r in read(p/'country-annexes/one-billion/band-order-boundary/band-order-boundary-country-annex.csv')}
for r in rows:
 # Fixed membership and component shares make allocation linear in TSAC.
 r['share_boundary']=float(r['share_strict'])+1.5*(float(r['share_gini_minimum'])-float(r['share_strict']))
 assert abs(r['share_boundary']*1000-float(annex[r['party']]['total_allocation']))<.000051
bands=np.array([int(r['Band']) for r in order]);base=np.array([float(r['share_iusaf'])*100 for r in rows]);colors=['#147D92','#48A9A6','#89B9B0','#D7AE64','#CE7950','#98465A'];cs=[colors[b-1] for b in bands]
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':11,'axes.spines.top':False,'axes.spines.right':False,'axes.spines.left':False,'axes.spines.bottom':False,'svg.fonttype':'none','text.parse_math':False,'text.color':'#193445','axes.labelcolor':'#193445','xtick.color':'#526775','ytick.color':'#526775'})
sids=np.array([r['is_sids'].lower()=='true' for r in rows]);assert sids.sum()==39
sosac=.97*base+sids*(3/39)
for i,r in enumerate(rows):r['share_sosac_only']=sosac[i]/100
assert np.allclose(sosac, np.array([float(r['share_strict'])-1.5*(float(r['share_gini_minimum'])-float(r['share_strict'])) for r in rows])*100,atol=1e-10)
scenarios=[('sosac_only','Ocean stewardship only','0','97'),('strict','Strict','1.5','95.5'),('gini_minimum','Gini minimum (band-order constrained)','2.5','94.5'),('boundary','Band-order boundary','3.0','94.0')]
fig,axs=plt.subplots(4,1,figsize=(16,9));fig.subplots_adjust(left=.08,right=.97,top=.707,bottom=.23,hspace=.8)
fig.text(.08,.942,'Recognising ocean and terrestrial stewardship (4 options)',fontsize=22,weight='bold')
fig.text(.08,.898,'TSAC: Terrestrial Stewardship Allocation Component',fontsize=12,color='#526775')
fig.text(.08,.873,'(recognises greater stewardship responsibilities associated with size, not species richness)',fontsize=11,color='#526775')
fig.text(.08,.843,'SOSAC: Small Island Developing States Ocean Stewardship Allocation Component',fontsize=12,color='#526775')
fig.text(.08,.818,'(recognises greater ocean stewardship responsibilities and structural constraints of UN recognised SIDS)',fontsize=11,color='#526775')
fig.text(.08,.782,'Same 142 Parties and country order as the previous slide • SOSAC fixed at 3% • $1 billion fund',fontsize=13,color='#526775')
notes=[]
for ax,(key,title,beta,equity) in zip(axs,scenarios):
 vals=np.array([float(r['share_'+key])*100 for r in rows]);assert abs(vals.sum()-100)<1e-7
 m5=vals[bands==5].mean()*10;m6=vals[bands==6].mean()*10
 notes.append(f'{title}: Band 5 mean ${m5:.4f}m; China ${m6:.4f}m')
 ax.bar(np.arange(142),vals,color=cs,width=.88,zorder=3)
 ax.step(np.arange(-.5,142.5),np.r_[base,base[-1]],where='post',color='#263949',lw=1.15,ls='--',zorder=4)
 ax.set_xlim(-1,142);ax.set_ylim(0,1.05);ax.set_yticks([0,.5,1]);ax.set_ylabel('Allocation (%)',fontsize=9);ax.grid(axis='y',alpha=.18,zorder=0);ax.tick_params(length=0);ax.set_xticks([])
 ax.set_title(f'{title}  |  TSAC {beta}% · SOSAC 3% · IUSAF {equity}%',loc='left',fontsize=12,weight='bold',pad=9)
 for b in range(1,6):ax.axvline(sum(bands<=b)-.5,color='#cad5db',lw=.7,zorder=1)
 if key=='sosac_only':
  ax.vlines(np.where(sids)[0],.97*base[sids],vals[sids],color='#202c3b',linewidth=2,zorder=5)
  ax.scatter(np.where(sids)[0],vals[sids],s=7,color='#202c3b',zorder=6)
  ax.text(.99,1.075,'39 SIDS: SOSAC component USD 769,231 each',transform=ax.transAxes,ha='right',fontsize=10)
 else:ax.text(.99,1.075,f'Band 5 mean ${m5:.2f}m  /  China ${m6:.2f}m',transform=ax.transAxes,ha='right',fontsize=10,color='#98465A' if key=='boundary' else '#526775')
axs[-1].set_xticks([0,30,60,90,120,141],['1','31','61','91','121','142']);axs[-1].set_xlabel('Party position, ordered by original UN assessment',fontsize=10)
fig.legend(handles=[Patch(color=c,label=f'Band {i+1}') for i,c in enumerate(colors)]+[Line2D([0],[0],color='#263949',ls='--',label='Pure IUSAF reference')],loc='lower center',bbox_to_anchor=(.52,.129),ncol=7,frameon=False,fontsize=10)
fig.text(.08,.108,'First panel: dark caps mark the SOSAC component for 39 SIDS. Dashed line: pure IUSAF. Country order is unchanged.',fontsize=11)
fig.text(.08,.071,'SOSAC is funded by reducing IUSAF to 97%: net SIDS gains are smaller than USD 769,231. Non-SIDS receive 3% less in the first panel.',fontsize=10)
fig.text(.08,.035,'Source: v3 scenario shares; 3% boundary checked against its dedicated country annex. Gini minimum is constrained by band-order preservation; it is not the unconstrained optimum.',fontsize=10,color='#526775')
for ext in ['png','svg']:fig.savefig(o/('stewardship-adjustments.'+ext),dpi=240,facecolor='white')
plt.close(fig)
with (o/'stewardship-data.csv').open('w') as f:
 writer=csv.writer(f);writer.writerow(['Party','Band','Pure IUSAF percent','SOSAC only percent','Strict percent','Gini minimum percent','Band boundary percent'])
 for i,r in enumerate(rows):writer.writerow([r['party'],bands[i],base[i]]+[float(r['share_'+k])*100 for k,_,_,_ in scenarios])
(o/'stewardship-notes.md').write_text('# Stewardship follow-on figure\n\nFour panels preserve the exact country order and band colours of country-distributions.png. All share the 0–1.05% vertical scale. Bars show total combined allocations; the dashed line is pure IUSAF, not the reduced IUSAF component inside each scenario.\n\nOcean-only: TSAC 0%, SOSAC 3%, IUSAF 97%. Computed as 0.97 × pure IUSAF plus 0.03/39 for each eligible SIDS; independently checked against the linear extrapolation of the strict and Gini scenarios. Each receives USD 769,230.77 from SOSAC; net gain subtracts 3% of its previous IUSAF allocation. Strict: TSAC 1.5%, SOSAC 3%, IUSAF 95.5%. Gini minimum: TSAC 2.5%, SOSAC 3%, IUSAF 94.5%. Band-order boundary: TSAC 3%, SOSAC 3%, IUSAF 94%. These are the paper’s recorded scenarios, not newly optimized results.\n\n'+'\n\n'.join(notes)+'\n\nBand-order boundary at 3% is already marginally across the band-mean threshold, not an exact equality. Country-level rank changes can occur before band means cross. Gini minimum is constrained by the requirement for band-order preservation; it is not the unconstrained optimum. Strict and Gini inputs are country_allocations.csv unrounded shares, joined by ISO3 to the previous figure. Its boundary column does not match the dedicated 3% annex and was not used. The 3% boundary was calculated by linear extrapolation from the 1.5% and 2.5% scenario shares with SOSAC fixed at 3%; all 142 results were verified against the dedicated band-order-boundary annex to its four-decimal million-dollar precision (within USD 51). All scenario shares sum to 100%. Pure IUSAF, SOSAC and TSAC divide the same fixed fund; overlays are not extra money.\n')
print('\n'.join(notes))

print('SIDS by band',[(b,int(sum(sids & (bands==b)))) for b in range(1,7)])
print('Net SIDS gain dollars',min((sosac-base)[sids])*1e7,max((sosac-base)[sids])*1e7)
