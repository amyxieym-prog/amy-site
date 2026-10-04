import { mkdir, cp, readFile, writeFile } from 'node:fs/promises';
import { validateContent } from '../content-model.js';
validateContent(JSON.parse((await readFile('content/site.json', 'utf8')).replace(/^\uFEFF/, '')));
await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js', 'content-model.js', 'assets', 'content']) await cp(file, `dist/${file}`, { recursive: true });
await writeFile('dist/.nojekyll', '');
console.log('Built dist/ — public website only, no editor or private source records.');
