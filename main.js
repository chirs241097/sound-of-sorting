//License: Expat(MIT)
//Chris Xiong 2017
const mrkcol=["#FFF","#F00","#0F0","#00F","#0FF","#F0F","#FF0","#F80","#F08","#0F8","#8F0","#80F","#08F"];
const ui={};
function min(a,b){return a<b?a:b;}
function max(a,b){return a>b?a:b;}
async function sleep(ms)
{
	return new Promise(resolve=>setTimeout(resolve,ms));
}
class ISort
{
	constructor(h)
	{
		this.executing=false;
		this.finished=false;
		this.step=false;
		this.h=h;
	}
	options()
	{
		return "";
	}
	async wait()
	{
		do{await sleep(5);}while(!this.step);
		this.step=false;
	}
	async execute(){}
};
class BubbleSort extends ISort
{
	constructor(h){super(h);}
	async execute()
	{
		this.executing=true;
		const h=this.h;
		let c=h.count;
		let swapped=false;
		do
		{
			swapped=false;
			for(let i=1;i<c;++i)
			{
				h.mark(i,1);h.mark(i-1,2);
				if(h.compar(i-1,i)==1)
				{
					h.swap(i-1,i);
					swapped=true;
				}
				await this.wait();
				h.mark(i,0);h.mark(i-1,0);
			}
			c=c-1;
		}
		while(swapped);
		this.finished=true;
	}
};
class SelectSort extends ISort
{
	constructor(h){super(h);}
	async execute()
	{
		this.executing=true;
		const h=this.h;
		const c=h.count;
		for(let i=0;i<c;++i)
		{
			let m=i;
			h.mark(i,1);
			for(let j=i+1;j<c;++j)
			{
				h.mark(j,3);
				if(h.get(j)<h.get(m))
				{
					if(m!=i)h.mark(m,0);
					m=j;h.mark(m,2);
				}
				await this.wait();
				if(m!==j)h.mark(j,0);
			}
			h.mark(i,0);h.mark(m,0);
			h.swap(i,m);
		}
		for(let i=0;i<c;++i)h.mark(i,0);
		this.finished=true;
	}
};
class InsertSort extends ISort
{
	constructor(h){super(h);}
	async execute()
	{
		this.executing=true;
		const h=this.h;
		const c=h.count;
		for(let i=1;i<c;++i)
		{
			let t=h.get(i);
			h.mark(i,1);
			for(let j=i-1;j>=0&&h.get(j)>t;--j)
			{
				h.mark(j,2);
				h.swap(j,j+1);
				await this.wait();
				h.mark(j,0);
			}
			h.mark(i,0);
		}
		this.finished=true;
	}
}
class CombSort extends ISort
{
	constructor(h){super(h);}
	async execute()
	{
		this.executing=true;
		const h=this.h;
		let swapped=false;
		let gap=h.count;
		while((gap>1)||swapped)
		{
			if(gap>1)gap=Math.floor(gap/1.3);
			swapped=false;
			for(let i=0;gap+i<h.count;++i)
			{
				h.mark(i,1);h.mark(i+gap,1);
				if(h.get(i)>h.get(i+gap))
				{
					h.swap(i,i+gap);
					swapped=true;
				}
				await this.wait();
				h.mark(i,0);h.mark(i+gap,0);
			}
		}
		this.finished=true;
	}
}
class ShellSort extends ISort
{
	constructor(h){super(h);}
	async execute()
	{
		this.executing=true;
		const gaps=[1073790977,268460033,67121153,16783361,4197377,
		1050113,262913,65921,16577,4193,1073,281,77,23,8,1];
		for(let g=0;g<gaps.length;++g)
		for(let cg=gaps[g],i=cg;i<h.count;++i)
		{
			h.mark(i,2);
			let t=h.get(i),j=i;
			for(let tv;j>=cg&&(tv=h.get(j-cg))>t;j-=cg)
			{
				let om=h.getmark(j);
				h.mark(j,1);
				h.set(j,tv);
				await this.wait();
				h.mark(j,om);
			}
			h.set(j,t);
			await this.wait();
			h.mark(i,0);
		}
		this.finished=true;
	}
}
class ShakerSort extends ISort
{
	constructor(h){super(h);}
	async execute()
	{
		this.executing=true;
		const h=this.h;
		for(let L=0,R=h.count-1,m=0;L<R;)
		{
			for(let i=R;i>L;--i)
			{
				h.mark(i-1,2);h.mark(i,1);
				if(h.compar(i-1,i)>0)
				{
					h.swap(i-1,i);
					m=i;
				}
				await this.wait();
				h.mark(i-1,0);h.mark(i,0);
			}
			L=m;
			for(let i=L;i<R;++i)
			{
				h.mark(i+1,2);h.mark(i,1);
				if(h.compar(i,i+1)>0)
				{
					h.swap(i+1,i);
					m=i;
				}
				await this.wait();
				h.mark(i+1,0);h.mark(i,0);
			}
			R=m;
		}
		this.finished=true;
	}
}
class QuickSort extends ISort
{
	constructor(h){super(h);}
	options()
	{
		return `{
			"optionlist":
			[
				{
					"dispname":"Pivot Selection",
					"opt":"pivot",
					"type":"enumsingle",
					"options":[
						"First",
						"Last",
						"Middle",
						"Random"
					],
					"defaultv":"2"
				}
			]
		}`;
	}
	async _sort(l,r)
	{
		const h=this.h;
		let i=l,j=r;
		let p=l;
		switch(Number(h.getopt("pivot")))
		{
			case 0:
			break;
			case 1:
				p=r;
			break;
			case 2:
				p=(l+r)>>1;
			break;
			case 3:
				p=Math.floor(Math.random()*(r+1-l))+l;
			break;
		}
		let x=h.get(p);
		h.mark(p,3);
		do
		{
			while(h.comparv(h.get(i),x)==-1)
			{
				++i;h.mark(i,1);
				await this.wait();h.mark(i,0);
			}
			while(h.comparv(h.get(j),x)== 1)
			{
				--j;h.mark(j,1);
				await this.wait();h.mark(j,0);
			}
			if(i<=j){h.swap(i,j);++i;--j;}
			h.mark(i,1);h.mark(j,1);
			await this.wait();
			h.mark(i,0);h.mark(j,0);
			h.mark(p,3);
		}
		while(i<=j);
		h.mark(p,0);
		if(l<j)await this._sort(l,j);
		if(i<r)await this._sort(i,r);
	}
	async execute()
	{
		this.executing=true;
		await this._sort(0,this.h.count-1);
		this.finished=true;
	}
}
class MergeSort extends ISort
{
	constructor(h){super(h);}
	async merge(L,R,M)
	{
		this.h.mark(L,2);this.h.mark(R-1,2);
		this.h.mark(M,3);
		let t=[];
		let i=L,j=M;
		while(i<M&&j<R)
		{
			let a=this.h.get(i);
			let b=this.h.get(j);
			t.push(
				this.h.comparv(a,b)<0?
				(++i,a):
				(++j,b)
			);
			this.h.mark(i,1);this.h.mark(j,1);
			await this.wait();
			this.h.mark(i,0);this.h.mark(j,0);
			this.h.mark(L,2);this.h.mark(R-1,2);
			this.h.mark(M,3);
		}
		while(i<M){t.push(this.h.get(i++));await this.wait();}
		while(j<R){t.push(this.h.get(j++));await this.wait();}
		for(i=0;i<R-L;++i)
		{
			this.h.set(L+i,t[i]);
			let om=this.h.getmark(L+i);
			this.h.mark(L+i,1);
			await this.wait();
			this.h.mark(L+i,om);
		}
		this.h.mark(L,0);this.h.mark(R-1,0);
		this.h.mark(M,0);
	}
	async _sort(L,R)
	{
		if(L+1>=R)return;
		const M=(L+R)>>1;
		await this._sort(L,M);
		await this._sort(M,R);
		await this.merge(L,R,M);
	}
	async execute()
	{
		this.executing=true;
		await this._sort(0,this.h.count);
		this.finished=true;
	}
}
class HeapSort extends ISort
{
	constructor(h){super(h);}
	async execute()
	{
		this.executing=true;
		const h=this.h;
		let n=h.count,le=n>>1;
		for(let i=le;i<n;++i)h.mark(i,Math.floor(Math.log(i+1)/Math.log(2))+2);
		for(;;)
		{
			if(le>0)--le;
			else
			{
				if(!--n)break;
				h.swap(0,n);
				h.mark(n,1);
				if(n+1<h.count)h.mark(n+1,0);
				await this.wait();
			}
			let par=le,ch=(le<<1)|1;
			while(ch<n)
			{
				if(ch+1<n&&h.compar(ch+1,ch)>0)++ch;
				if(h.compar(ch,par)>0)
				{
					h.swap(ch,par);
					par=ch;ch=(par<<1)|1;
				}else break;
				await this.wait();
			}
			h.mark(le,Math.floor(Math.log(le+1)/Math.log(2))+2);
			await this.wait();
		}
		this.finished=true;
	}
}
class LSDRadixSort extends ISort
{
	constructor(h){super(h);}
	async execute()
	{
		this.executing=true;
		const R=4;
		const pm=Math.ceil(Math.log(h.maxval+1)/Math.log(R));
		for(let p=0;p<pm;++p)
		{
			let base=Math.round(Math.pow(R,p));
			let c=[];for(let i=0;i<R;++i)c[i]=0;
			let cpy=[];
			for(let i=0;i<h.count;++i)
			{
				h.mark(i,1);
				cpy[i]=h.get(i);
				let r=Math.floor(cpy[i]/base)%R;
				++c[r];
				await this.wait();
				h.mark(i,0);
			}
			let ps=[];ps.push(0);
			for(let i=0;i<R;++i)
			ps[i+1]=ps[i]+c[i];
			for(let i=0;i<ps.length-1;++i)
			{
				if(ps[i]>=h.count)continue;
				h.mark(ps[i],3);
			}
			for(let i=0;i<h.count;++i)
			{
				let r=Math.floor(cpy[i]/base)%R;
				let om=h.getmark(ps[r]);
				h.set(ps[r],cpy[i]);
				h.mark(ps[r],1);
				await this.wait();
				h.mark(ps[r]++,om);
			}
			for(let i=0;i<h.count;++i)h.mark(i,0);
		}
		this.finished=true;
	}
}
class MSDRadixSort extends ISort
{
	constructor(h){super(h);}
	async _sort(L,R,dpt)
	{
		const Rdx=4;
		const h=this.h;
		h.mark(L,2);h.mark(R-1,2);
		const pm=Math.floor(Math.log(h.maxval+1)/Math.log(Rdx));
		let base=Math.round(Math.pow(Rdx,pm-dpt));
		let c=[];for(let i=0;i<Rdx;++i)c[i]=0;
		for(let i=L;i<R;++i)
		{
			let om=h.getmark(i);
			h.mark(i,1);
			let r=Math.floor(h.get(i)/base)%Rdx;
			++c[r];
			await this.wait();
			h.mark(i,om);
		}
		let ps=[];ps[0]=c[0];
		for(let i=1;i<Rdx;++i)
		ps[i]=ps[i-1]+c[i];
		for(let i=0;i<ps.length;++i)
		{
			if(ps[i]===0)continue;
			h.mark(L+ps[i]-1,3);
		}
		for(let i=0,j;i<(R-L);)
		{
			while((j=--ps[Math.floor(h.get(L+i)/base)%Rdx])>i)
			{
				h.swap(L+i,L+j);
				await this.wait();
			}
			i+=c[Math.floor(h.get(L+i)/base)%Rdx];
		}
		for(let i=0;i<h.count;++i)h.mark(i,0);
		if(dpt+1>pm)return;
		let s=L;
		for(let i=0;i<Rdx;++i)
		{
			if(c[i]>1)
			await this._sort(s,s+c[i],dpt+1);
			s+=c[i];
		}
	}
	async execute()
	{
		this.executing=true;
		await this._sort(0,h.count,0);
		this.finished=true;
	}
}
class SortHypervisor
{
	constructor()
	{
		this.ctx=ui.cvs.getContext("2d");
		this.w=ui.cvs.width;
		this.h=ui.cvs.height;
		this.ctx.clearRect(0,0,this.w,this.h);
		this.ctx.lineWidth=window.devicePixelRatio.toString();
		window.AudioContext=window.AudioContext||window.webkitAudioContext;
		this.actx=new AudioContext();
		this.dly=20;
		this.reset(100);
	}
	reset(c)
	{
		this.raccess=0;
		this.waccess=0;
		this.count=c;
		this.bin=[];
		this.mrk=[];
		this.algo=null;
		this.initalgo();
		this.breakexec=false;
		for(let i=0;i<this.count;++i)
		{this.bin[i]=i+1;this.mrk[i]=0;}
		this.maxval=this.count+1;
	}
	shuffle()
	{
		this.breakexec=true;
		this.initalgo();
		for(let i=0;i<this.count;++i)
		{this.bin[i]=i+1;this.mrk[i]=0;}
		this.maxval=this.count+1;
		switch(ui.sdat.value)
		{
			case "asc":
			break;
			case "dec":
				for(let i=0;i<this.count;++i)
				this.bin[i]=this.count-i;
			break;
			case "rnd":
			case "cub":
			case "qui":
				let pow=(ui.sdat.value==="cub"?3:5);
				if(ui.sdat.value!="rnd")
				for(let i=0;i<this.count;++i)
				this.bin[i]=Math.floor((Math.pow((2.*i/this.count-1),pow)+1)*this.count/2)+1;
				this.maxval=this.bin[this.count-1];
				for(let i=this.count-1;i>0;--i)
				{
					let r=Math.floor(Math.random()*(i+1));
					let t=this.bin[i];
					this.bin[i]=this.bin[r];
					this.bin[r]=t;
				}

			break;
		}
		this.fullredraw();
	}
	swap(ida,idb)
	{
		this.raccess+=2;
		this.waccess+=2;
		let t=this.bin[ida];
		this.bin[ida]=this.bin[idb];
		this.bin[idb]=t;
		this.singleredraw(ida);
		this.singleredraw(idb);
	}
	get(id)
	{
		++this.raccess;
		this.sound(this.bin[id]/this.count*1100+132);
		return this.bin[id];
	}
	set(id,v)
	{
		++this.waccess;
		this.bin[id]=v;
		this.sound(this.bin[id]/this.count*1100+132);
		this.singleredraw(id);
	}
	comparv(a,b){return a<b?-1:a>b?1:0;}
	compar(ida,idb)
	{
		let a=this.get(ida),b=this.get(idb);
		return this.comparv(a,b);
	}
	getmark(id){return this.mrk[id];}
	mark(id,m){
		this.mrk[id]=m;
		this.singleredraw(id);
	}
	fullredraw()
	{
		const w=this.w,h=this.h,n=this.count;
		this.ctx.clearRect(0,0,w,h);
		for(let i=0;i<n;++i)
		{
			this.ctx.fillStyle=mrkcol[this.mrk[i]];
			this.ctx.fillRect(i*w/n,(n+1-this.bin[i])/n*h,w/n,this.bin[i]/n*h);
			this.ctx.strokeRect(i*w/n,(n+1-this.bin[i])/n*h,w/n,this.bin[i]/n*h);
		}
	}
	singleredraw(id)
	{
		const w=this.w,h=this.h,n=this.count;
		this.ctx.clearRect(id*w/n-w/n*0.5,0,w/n*2,h);
		for(let i=max(id-1,0);i<=min(id+1,n-1);++i)
		{
			this.ctx.fillStyle=mrkcol[this.mrk[i]];
			this.ctx.fillRect(i*w/n,(n+1-this.bin[i])/n*h,w/n,this.bin[i]/n*h);
			this.ctx.strokeRect(i*w/n,(n+1-this.bin[i])/n*h,w/n,this.bin[i]/n*h);
		}
	}
	initalgo(algochanged)
	{
		this.raccess=this.waccess=0;
		ui.lbra.innerHTML="0";
		ui.lbwa.innerHTML="0";
		this.algo=eval('new '+ui.salg.value+'(this);');
		if(algochanged)
		{
			this.algoopt=new Map();
			while(ui.wopt.hasChildNodes())ui.wopt.removeChild(ui.wopt.lastChild);
			if(!this.algo.options().length)return;
			let ol=JSON.parse(this.algo.options()).optionlist;
			for(let i=0;i<ol.length;++i)
			{
				let ell=document.createElement('label');
				ell.htmlFor=ol[i].opt;
				ell.innerHTML=ol[i].dispname;
				ui.wopt.appendChild(ell);
				switch(ol[i].type)
				{
					case "enumsingle":
						let elo=document.createElement('select');
						this.algoopt.set(ol[i].opt,{"el":elo,"type":ol[i].type});
						elo.id=ol[i].opt;
						ui.wopt.appendChild(elo);
						for(let j=0;j<ol[i].options.length;++j)
						{
							let eloc=document.createElement('option');
							eloc.text=ol[i].options[j];
							eloc.value=j;
							if(j==Number(ol[i].defaultv))
							eloc.selected="selected";
							elo.appendChild(eloc);
						}
						ui.wopt.appendChild(elo);
					break;
				}
			}
		}
	}
	async execute()
	{
		if(!this.algo.executing||this.algo.finished)
		{
			this.initalgo();
			this.algo.execute();
		}
		this.breakexec=false;
		while(!this.algo.finished&&!this.breakexec)
		{
			await sleep(this.dly);
			this.algo.step=true;
			ui.lbra.innerHTML=this.raccess;
			ui.lbwa.innerHTML=this.waccess;
		}
		if(this.algo.finished)
		{
			let last=0,err=false;
			for(let i=0;i<this.count;++i)
			{
				let t=this.get(i);
				if(t<last){if(!err)alert("The algorithm failed to sort the array...");err=true;}
				last=t;
				this.mark(i,2);
				await sleep(10);
			}
			for(let i=0;i<this.count;++i)this.mark(i,0);
		}
	}
	step()
	{
		if(!this.algo.executing||this.algo.finished)
		{
			this.initalgo();
			this.algo.execute();
		}
		else this.algo.step=true;
		this.breakexec=true;
		ui.lbra.innerHTML=this.raccess;
		ui.lbwa.innerHTML=this.waccess;
	}
	changealgo()
	{
		this.breakexec=true;
		this.initalgo(true);
		this.shuffle();
	}
	getopt(o)
	{
		switch(this.algoopt.get(o).type)
		{
			case "enumsingle":
				return this.algoopt.get(o).el.value;
			break;
		}
	}
	sound(freq)
	{
		let o=this.actx.createOscillator();
		let g=this.actx.createGain();
		o.connect(g);g.connect(this.actx.destination);
		o.frequency.value=freq;o.type="triangle";
		let t=this.actx.currentTime;
		o.start(0);
		g.gain.setValueAtTime(0,0);
		g.gain.linearRampToValueAtTime(0.1,t+0.005)
		g.gain.linearRampToValueAtTime(0,t+0.105);
		o.stop(t+0.1);
	}
};
let h=null;
function init()
{
	ui.cvs=document.getElementById("cvs");
	ui.rspd=document.getElementById("spd");
	ui.rcnt=document.getElementById("count");
	ui.wopt=document.getElementById("optw");
	ui.salg=document.getElementById("sel");
	ui.sdat=document.getElementById("data");
	ui.lbra=document.getElementById("racc");
	ui.lbwa=document.getElementById("wacc");
	ui.lbcnt=document.getElementById("lbcnt");
	ui.lbspd=document.getElementById("lbspd");
	if(!window.devicePixelRatio)window.devicePixelRatio=1;
	if(ui.cvs.width>window.innerWidth*0.95)ui.cvs.width=window.innerWidth*0.95;
	ui.cvs.height=ui.cvs.width/16*9;
	if(ui.cvs.height>window.innerHeight*0.72)
	{
		ui.cvs.height=window.innerHeight*0.72;
		ui.cvs.width=ui.cvs.height/9*16;
	}
	ui.cvs.style.width=ui.cvs.width+"px";
	ui.cvs.style.height=ui.cvs.height+"px";
	ui.cvs.width=ui.cvs.width*window.devicePixelRatio;
	ui.cvs.height=ui.cvs.height*window.devicePixelRatio;
	ui.rspd.onchange=()=>{h.dly=Number(ui.rspd.value);}
	ui.rcnt.onchange=()=>{h.reset(Number(ui.rcnt.value));h.fullredraw();}
	ui.rspd.oninput=()=>{ui.lbspd.innerHTML=ui.rspd.value+"ms";}
	ui.rcnt.oninput=()=>{ui.lbcnt.innerHTML=ui.rcnt.value;}
	ui.salg.onchange=()=>{h.changealgo();}
	h=new SortHypervisor();
	h.fullredraw();
}
