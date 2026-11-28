import test from 'node:test'
import assert from 'node:assert/strict'
import {plan,defaults,initialTasks} from '../src/planner.js'
test('reserve walking time and respect available equipment',()=>{
 const picked=plan(initialTasks,defaults)
 assert.equal(picked.reduce((s,t)=>s+t.mins,0),35)
 assert.ok(!picked.some(t=>t.gear==='laptop'))
 assert.deepEqual(plan(initialTasks,{...defaults,walk:45}),[])
})
test('choose the best combination rather than the first task that fits',()=>{
 const tasks=[9,6,4].map(mins=>({id:String(mins),mins,gear:'any',priority:1}))
 assert.deepEqual(plan(tasks,{minutes:10,walk:0,devices:[]}).map(t=>t.mins),[6,4])
})
test('exclude completed tasks and weight urgent work',()=>{
 const tasks=[{id:'a',mins:10,priority:1,gear:'any'}, {id:'b',mins:7,priority:3,gear:'any'}, {id:'c',mins:3,priority:3,gear:'any',done:true}]
 assert.deepEqual(plan(tasks,{minutes:10,walk:0,devices:[]}).map(t=>t.id),['b'])
})
