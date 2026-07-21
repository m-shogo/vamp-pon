import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root=resolve(import.meta.dirname,'../..');
const read=(path:string)=>readFileSync(resolve(root,path));
const json=(path:string)=>JSON.parse(read(path).toString('utf8'));
const sha=(path:string)=>createHash('sha256').update(read(path)).digest('hex');
const check=(value:unknown,message:string)=>{if(!value)throw new Error(`U48 production visual verification failed: ${message}`)};
const approved=json('docs/design-targets/generated/unity-u48/approved-production-set.json');
const manifest=json('docs/design-targets/generated/unity-u48/production-verification/manifest.json');
const matrix=json('docs/design-targets/generated/unity-u48/production-verification/capture-matrix.json');

check(manifest.verificationBuild==='production-catalog-with-smoke-capture-bridge'&&manifest.previewDefineEnabled===false,'production-only verification build');
check(manifest.assetGroupCount===46&&manifest.gameplayGroupCount===16&&manifest.uiGroupCount===30,'46 group partition');
check(manifest.entryCount===138&&manifest.expectedEntryCount===138&&manifest.entries.length===138,'138 capture entries');
check(JSON.stringify(manifest.viewportCounts)===JSON.stringify({compact:46,standard:46,large:46}),'three viewport counts');
check(manifest.previewDependencyUsedCount===0&&manifest.resizeReuseCount===0&&manifest.exceptionCount===0&&manifest.assertionFailureCount===0&&manifest.cleanupFailureCount===0&&manifest.staleCount===0,'runtime integrity counters');
check(manifest.duplicateScreenshotHashCount===0,'duplicate screenshot hashes');
check(matrix.totalCaptureCount===138&&matrix.groups.length===46&&JSON.stringify(matrix.viewportCounts)===JSON.stringify(matrix.expectedViewportCounts),'capture matrix');
const approvedByGroup=new Map(approved.entries.map((entry:any)=>[entry.assetGroup,entry]));
for(const run of manifest.groupRuns){
  check(approvedByGroup.has(run.assetGroup),`${run.assetGroup} approved`);
  check(run.completedCaptureCount===3&&run.productionProvider===true&&run.previewDependencyUsed===false&&run.cleanupPassed===true&&run.exceptionCount===0&&run.assertionFailureCount===0&&run.passed===true,`${run.assetGroup} group summary`);
  check(Array.isArray(run.requiredStates)&&run.requiredStates.length===run.requiredStateCount&&run.requiredStateCount>0,`${run.assetGroup} required states`);
  check(existsSync(resolve(root,run.summaryPath))&&sha(run.summaryPath)===run.summarySha256,`${run.assetGroup} summary identity`);
}
for(const entry of manifest.entries){
  const selected:any=approvedByGroup.get(entry.assetGroup); check(selected,`${entry.assetGroup} selected entry`);
  check(entry.candidateId===selected.candidateId&&entry.candidateSourcePath===selected.candidateSourcePath&&entry.candidateSourceSha256===selected.candidateSourceSha256,`${entry.assetGroup} candidate identity`);
  check(entry.productionPath===selected.productionPath&&entry.productionSha256===selected.productionSha256&&entry.runtimeProviderKey===selected.runtimeProviderKey,`${entry.assetGroup} production identity`);
  check(sha(entry.productionPath)===entry.productionSha256&&existsSync(resolve(root,entry.screenshotPath))&&sha(entry.screenshotPath)===entry.screenshotSha256,`${entry.assetGroup}/${entry.viewport} file hashes`);
  check(existsSync(resolve(root,entry.runtimeResultPath))&&sha(entry.runtimeResultPath)===entry.runtimeResultSha256,`${entry.assetGroup}/${entry.viewport} result hash`);
  check(entry.captureKind==='production-runtime'&&entry.liveRender===true&&entry.sourceIdentityPassed===true&&entry.importContractPassed===true,`${entry.assetGroup}/${entry.viewport} live production route`);
  check(entry.gameplayContractUnchanged===true&&entry.uiContractUnchanged===true&&entry.previewDependencyUsed===false&&entry.resizeReuse===false&&entry.cleanupPassed===true&&entry.exceptionCount===0&&entry.assertionFailureCount===0&&entry.stale===false,`${entry.assetGroup}/${entry.viewport} runtime integrity`);
}
check(new Set(manifest.entries.map((entry:any)=>entry.assetGroup)).size===46,'46 captured groups');
check(new Set(manifest.entries.map((entry:any)=>`${entry.assetGroup}:${entry.viewport}`)).size===138,'unique group/viewport matrix');
console.log('U48 production visual verification passed: groups=46, captures=138, compact=46, standard=46, large=46, preview dependency=0, duplicate screenshots=0.');
