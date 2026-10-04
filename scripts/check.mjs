import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
const html=readFileSync(new URL('../src/index.html',import.meta.url),'utf8');
const scripts=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
if(!scripts.length)throw new Error('No inline scripts found');
const dir=mkdtempSync(join(tmpdir(),'story-tree-check-'));
try {
  const file=join(dir,'editor.js');writeFileSync(file,scripts.join('\n'));
  const result=spawnSync(process.execPath,['--check',file],{stdio:'inherit'});
  if(result.status!==0)process.exitCode=result.status||1;
  else console.log('Editor JavaScript syntax OK');
} finally {rmSync(dir,{recursive:true,force:true});}
