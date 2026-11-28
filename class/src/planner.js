export const gear = {any:'Без техники', phone:'Телефон', laptop:'Ноутбук'}
export const subjects = ['Учёба','Практика','Личное']
export const initialTasks = [
  {id:'notes', title:'Разобрать конспект лекции', mins:20, gear:'any', priority:2, group:'Учёба'},
  {id:'cards', title:'Повторить карточки по английскому', mins:10, gear:'phone', priority:2, group:'Учёба'},
  {id:'mail', title:'Ответить старосте', mins:5, gear:'phone', priority:1, group:'Личное'},
  {id:'code', title:'Дописать лабораторную', mins:40, gear:'laptop', priority:3, group:'Практика'},
  {id:'proof', title:'Решить задачу по матанализу', mins:25, gear:'any', priority:1, group:'Практика'}
]
export const defaults = {minutes:45, walk:10, devices:['phone']}
export function eligible(task, config) {
  return !task.done && (task.gear === 'any' || config.devices.includes(task.gear))
}
// A 0/1 knapsack maximizes priority-weighted minutes. Each task can occur once.
export function plan(tasks, config) {
  const capacity = Math.max(0, config.minutes - config.walk)
  const best = Array.from({length:capacity+1},()=>({score:0, ids:[]}))
  for (const task of tasks.filter(t=>eligible(t,config))) {
    for (let min=capacity; min>=task.mins; min--) {
      const prev=best[min-task.mins]
      const score=prev.score+task.priority*task.mins
      if (score>best[min].score) best[min]={score,ids:[...prev.ids,task.id]}
    }
  }
  return tasks.filter(t=>best[capacity].ids.includes(t.id)).sort((a,b)=>b.priority-a.priority)
}
export function clock(time) {
  return new Intl.DateTimeFormat('ru',{hour:'2-digit',minute:'2-digit'}).format(time)
}
export const minute = 60000

