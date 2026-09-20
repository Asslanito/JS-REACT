import { cp, lstat, mkdir, rm } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const output = resolve(root, 'dist')

if (relative(root, output) !== 'dist') {
  throw new Error('Unexpected build output directory.')
}

for (const task of ['task1', 'task2']) {
  const project = join(root, task)
  const result = spawnSync(
    process.execPath,
    [join(project, 'node_modules/vite/bin/vite.js'), 'build'],
    { cwd: project, stdio: 'inherit' },
  )
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}

const existing = await lstat(output).catch((error) => {
  if (error.code === 'ENOENT') return null
  throw error
})

if (existing?.isSymbolicLink()) {
  throw new Error('Build output must not be a symbolic link.')
}

await rm(output, { recursive: true, force: true })
await mkdir(output, { recursive: true })
await cp(join(root, 'task2/dist'), output, { recursive: true })

for (const task of ['task1', 'task2']) {
  await cp(join(root, task, 'dist'), join(output, task), { recursive: true })
}

console.log('Built task1, task2, and the existing portfolio entry page.')
