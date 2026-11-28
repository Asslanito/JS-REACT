import React,{useEffect,useRef,useState} from 'react'
import {createRoot} from 'react-dom/client'
import {Route, Layers3, ListTodo, Timer, ArrowUpRight, ArrowRight, Footprints, SlidersHorizontal, Smartphone, Laptop, BookOpen, Code2, Coffee, Plus, Play, Check, Pencil, Trash2, X, MapPin, Flag, CornerDownRight, CircleCheck, Clock3, Circle, ChevronRight, Navigation, CalendarDays, RotateCcw} from 'lucide-react'
import '@fontsource-variable/manrope'
import {initialTasks, defaults, gear, subjects, plan, minute, clock} from './planner'
import RouteMap from './RouteMap'
import './style.css'

const icons={'Учёба':BookOpen,'Практика':Code2,'Личное':Coffee}
const priorityNames=['','Обычный','Важный','Срочный']
const storageKey='do-pary-v1'
function load(){
  try {
    const saved=JSON.parse(localStorage.getItem(storageKey))
    if(Array.isArray(saved?.tasks)&&saved.config?.devices) return saved
  } catch {}
  return {config:defaults,tasks:initialTasks,session:null}
}
const Label=({children})=><span className="label">{children}</span>
function Category({group}){const Icon=icons[group]||BookOpen;return <span className={'category c'+subjects.indexOf(group)}><Icon size={19}/></span>}
function Modal({onClose,title,children}){
 const ref=useRef(null)
 useEffect(()=>{const el=ref.current; el.showModal();return ()=>el.close()},[])
 return <dialog ref={ref} onCancel={onClose} onClick={e=>{if(e.target===ref.current)onClose()}} aria-label={title}><div className="modalhead"><h2>{title}</h2><button className="iconbtn" aria-label="Закрыть" onClick={onClose}><X/></button></div>{children}</dialog>
}
function TaskEditor({task,onSave,onClose}){
 const [draft,set]=useState(task??{title:'',mins:15,priority:2,group:'Учёба',gear:'any'})
 const update=(key,value)=>set({...draft,[key]:value})
 return <Modal title={task?'Изменить задачу':'Новая задача'} onClose={onClose}><form className="form" onSubmit={e=>{e.preventDefault();if(draft.title.trim())onSave({...draft,id:draft.id||crypto.randomUUID(),title:draft.title.trim(),mins:Number(draft.mins)})}}>
 <label>Что нужно сделать?<input autoFocus required maxLength="100" placeholder="Например, проверить решение" value={draft.title} onChange={e=>update('title',e.target.value)} pattern=".*\S.*"/></label>
 <div className="fieldgrid"><label>Время, мин<input type="number" required min="1" max="180" value={draft.mins} onChange={e=>update('mins',e.target.value)}/></label>
 <label>Приоритет<select value={draft.priority} onChange={e=>update('priority',Number(e.target.value))}>{[1,2,3].map(n=><option key={n} value={n}>{priorityNames[n]}</option>)}</select></label></div>
 <label>Категория<select value={draft.group} onChange={e=>update('group',e.target.value)}>{subjects.map(g=><option key={g}>{g}</option>)}</select></label>
 <label>Что понадобится<select value={draft.gear} onChange={e=>update('gear',e.target.value)}>{Object.entries(gear).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label>
 <button className="primary">Сохранить задачу <Check size={16}/></button></form></Modal>
}
function Settings({config,set}){
 const toggle=device=>set({...config,devices:config.devices.includes(device)?config.devices.filter(d=>d!==device):[...config.devices,device]})
 return <section className="panel settings"><div className="panelhead"><span className="roundIcon"><SlidersHorizontal size={19}/></span><h2>Параметры перерыва</h2></div>
 <label className="rangelabel" htmlFor="minutes">До следующей пары <b>{config.minutes} мин</b></label><input id="minutes" type="range" min="5" max="180" step="5" value={config.minutes} onChange={e=>set({...config,minutes:+e.target.value,walk:Math.min(config.walk,+e.target.value)})}/>
 <div className="presets">{[15,30,45,60,90].map(n=><button key={n} aria-pressed={config.minutes===n} onClick={()=>set({...config,minutes:n,walk:Math.min(config.walk,n)})}>{n} мин</button>)}</div>
 <label className="rangelabel" htmlFor="walk"><span><Footprints size={16}/> На дорогу</span><select id="walk" value={config.walk} onChange={e=>set({...config,walk:+e.target.value})}>{[0,5,10,15,20,25,30].filter(n=>n<=config.minutes).map(n=><option key={n} value={n}>{n} мин</option>)}</select></label>
 <div className="deviceblock"><b>Что под рукой?</b><div className="devices">{[['phone',Smartphone],['laptop',Laptop]].map(([d,Icon])=><button key={d} aria-pressed={config.devices.includes(d)} onClick={()=>toggle(d)}><Icon size={16}/>{gear[d]}{config.devices.includes(d)&&<Check size={13}/>}</button>)}</div></div>
 </section>
}
function Ticket({config,now}){
 const available=config.minutes-config.walk
 return <section className="ticket"><div className="ticketTop"><Label><i/> ВРЕМЯ НА ДЕЛА</Label><span className="ticketNo">БИЛЕТ НА ПЕРЕРЫВ</span></div>
 <div className="ticketBody"><div className="bigtime">{available}<small>мин</small></div><RouteMap minutes={config.minutes} walk={config.walk}/></div>
 <div className="ticketBottom"><span><Clock3/>{clock(now)} — {clock(now+available*minute)}</span><span><Footprints/>{config.walk} мин в пути</span></div></section>
}
function Itinerary({items,now,config,onStart,onAdd}){
 let cursor=now
 const total=items.reduce((n,t)=>n+t.mins,0), spare=config.minutes-config.walk-total
 return <section className="panel itinerary"><div className="routehead"><div><Label>ПЛАН НА ПЕРЕРЫВ</Label><h2>Твой маршрут</h2></div><span className="pill"><Timer size={15}/>{total} мин дел</span></div>
 {items.length===0&&<div className="empty"><p>Пока ни одна задача не помещается. Добавь короткое дело или измени параметры перерыва.</p><button className="textbtn" onClick={onAdd}><Plus size={16}/>Добавить задачу</button></div>}
 <div className="steps">{items.map(t=>{const start=cursor;cursor+=t.mins*minute;return <div className="step" key={t.id}><time>{clock(start)}</time><i/><Category group={t.group}/><div className="stepTitle"><strong>{t.title}</strong><small>{t.group} · {gear[t.gear]}</small></div><b className="length">{t.mins} мин</b></div>})}
 {spare>0&&<div className="simpleStep"><time>{clock(cursor)}</time><i/><span>Свободное время · {spare} мин</span></div>}
 <div className="simpleStep"><time>{clock(now+(config.minutes-config.walk)*minute)}</time><i/><span><Footprints size={16}/>{config.walk?'Выйти на пару':'Начало пары'} · {clock(now+config.minutes*minute)}</span></div></div>
 <button className="primary" disabled={!items.length} onClick={onStart}><Play fill="currentColor" size={15}/>Начать маршрут<ArrowRight size={18}/></button></section>
}
function TaskBank({tasks,edit,update,remove,add}){
 const [filter,setFilter]=useState('Активные')
 const list=tasks.filter(t=>filter==='Активные'?!t.done:t.done)
 return <section className="panel bank"><div className="routehead"><div className="filters">{['Активные','Готовые'].map(f=><button key={f} aria-pressed={filter===f} onClick={()=>setFilter(f)}>{f}</button>)}</div><button className="textbtn" onClick={add}><Plus size={18}/>Добавить</button></div>
 {list.length===0&&<p className="empty">{filter==='Активные'?'Все дела закончились. Можно добавить новое.':'Здесь появятся выполненные задачи.'}</p>}
 {list.map(t=><div className="taskrow" key={t.id}><button className="iconbtn" aria-label={t.done?'Вернуть в активные':'Отметить выполненной'} onClick={()=>update(t)}>{t.done?<CircleCheck/>:<Circle/>}</button><Category group={t.group}/><div className="stepTitle"><strong>{t.title}</strong><small>{t.mins} мин · {gear[t.gear]} · {priorityNames[t.priority]}</small></div><button className="iconbtn" onClick={()=>edit(t)} aria-label={'Изменить: '+t.title}><Pencil size={17}/></button><button className="iconbtn" onClick={()=>remove(t)} aria-label={'Удалить: '+t.title}><Trash2 size={17}/></button></div>)}</section>
}
function Focus({s,now,advance,end}){
 const current=s.items[s.index], cutoff=now>=s.leaveAt
 const sec=Math.max(0,Math.ceil((Math.min(s.due,s.leaveAt)-now)/1000))
 const ended=cutoff||!current
 return <section className="panel focus"><Label><Navigation size={15}/> РЕЖИМ ФОКУСА</Label><h2>{cutoff?'Пора на пару':!current?'Маршрут пройден':current.title}</h2>
 {ended?<p>Выполнено задач: {s.completed} из {s.items.length}. {cutoff?'Время на дорогу началось.':'Можно перевести дух.'}</p>:<><div className="counter">{String(Math.floor(sec/60)).padStart(2,'0')}:{String(sec%60).padStart(2,'0')}</div><p aria-live="polite">{sec===0?'Время задачи истекло. Отметь результат.':'Задача '+(s.index+1)+' из '+s.items.length+' · Выход в '+clock(s.leaveAt)}</p><button className="primary" onClick={()=>advance(true)}><Check size={18}/>Выполнено</button><button className="textbtn" onClick={()=>advance(false)}>Пропустить <ChevronRight size={16}/></button></>}
 <button className="secondary" onClick={end}>{ended?'Вернуться в планировщик':'Завершить маршрут'}</button></section>
}
function App(){
 const [data,save]=useState(load),[tab,setTab]=useState('planner'),[editor,setEditor]=useState(null),[now,setNow]=useState(Date.now),[undo,setUndo]=useState(null)
 const {tasks,config,session}=data
 useEffect(()=>{try{localStorage.setItem(storageKey,JSON.stringify(data))}catch{}},[data])
 useEffect(()=>{const id=setInterval(()=>setNow(Date.now()),1000);return ()=>clearInterval(id)},[])
 const items=plan(tasks,config), active=tasks.filter(t=>!t.done).length
 const add=()=>setEditor({task:null})
 function start(){const at=Date.now();setNow(at);save({...data,session:{items,index:0,completed:0,leaveAt:at+(config.minutes-config.walk)*minute,due:at+items[0].mins*minute}})}
 function advance(done){save(prev=>{const s=prev.session,task=s.items[s.index],next=s.index+1;return {...prev,tasks:done?prev.tasks.map(t=>t.id===task.id?{...t,done:true}:t):prev.tasks,session:{...s,index:next,completed:s.completed+Number(done),due:Date.now()+(s.items[next]?.mins??0)*minute}}})}
 const date=new Intl.DateTimeFormat('ru',{weekday:'short',day:'numeric',month:'long'}).format(now)
 return <><header><div className="top"><a className="brand" href="#" onClick={e=>{e.preventDefault();setTab('planner')}}><img src="./mark.svg" alt=""/>Class<span>.</span></a><nav aria-label="Разделы"><button aria-current={tab==='planner'?'page':undefined} onClick={()=>setTab('planner')}><Route size={17}/>Планировщик</button><button aria-current={tab==='tasks'?'page':undefined} onClick={()=>setTab('tasks')}><Layers3 size={17}/>Мои задачи</button></nav><span className="date"><CalendarDays size={16}/>{date}</span></div></header>
 <main><div className="heading"><div><Label><span className="blueLine"/> КАМПУС / {tab==='tasks'?'ЗАДАЧИ':'ПЛАНИРОВЩИК'}</Label><h1>{tab==='tasks'?'Мои задачи':session?'В процессе':'Между парами'}<em>.</em></h1><p>{tab==='tasks'?'Собери дела, из которых складывается твой перерыв.':session?'Следи за временем и отмечай сделанное.':'Выбери длину перерыва — подберём дела и оставим время на дорогу.'}</p></div><button className="secondary" onClick={add}><Plus size={18}/>Новая задача</button></div>
 {tab==='tasks'?<TaskBank tasks={tasks} add={add} edit={t=>setEditor({task:t})} update={t=>save({...data,tasks:tasks.map(x=>x.id===t.id?{...x,done:!x.done}:x)})} remove={t=>{setUndo(t);save({...data,tasks:tasks.filter(x=>x.id!==t.id)})}}/>:
 session?<Focus s={session} now={now} advance={advance} end={()=>save({...data,session:null})}/>:
 <div className="dashboard"><div className="left"><Ticket config={config} now={now}/><Itinerary items={items} now={now} config={config} onStart={start} onAdd={add}/></div><aside><Settings config={config} set={config=>save({...data,config})}/><button className="bankLink" onClick={()=>setTab('tasks')}><span className="roundIcon"><Layers3 size={21}/></span><span><strong>Банк задач</strong><small>Активных задач: {active}</small></span><ArrowUpRight size={20}/></button></aside></div>}
 </main><footer><span><Route size={15}/>Class</span><span>Планировщик студента</span></footer>
 {editor&&<TaskEditor task={editor.task} onClose={()=>setEditor(null)} onSave={v=>{save({...data,tasks:editor.task?tasks.map(t=>t.id===v.id?v:t):[...tasks,v]});setEditor(null)}}/>}
 {undo&&<div role="status" className="toast">Задача удалена <button onClick={()=>{save({...data,tasks:[...tasks,undo]});setUndo(null)}}>Вернуть</button><button aria-label="Закрыть уведомление" onClick={()=>setUndo(null)}><X size={15}/></button></div>}</>
}
createRoot(document.getElementById('root')).render(<App/>)

