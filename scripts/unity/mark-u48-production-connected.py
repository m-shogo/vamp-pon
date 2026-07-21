#!/usr/bin/env python3
"""Record production catalog/provider connection while runtime approval remains pending."""
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
def read(path): return json.loads((ROOT/path).read_text())
def write(path,value): (ROOT/path).write_text(json.dumps(value,ensure_ascii=False,indent=2)+"\n")

approved=read('docs/design-targets/generated/unity-u48/approved-production-set.json')
approval=read('docs/design-targets/generated/unity-u48/approval-pack/approval-manifest.json')
summary=read('docs/design-targets/generated/unity-u48/human-approval-summary.json')
readiness=read('docs/design-targets/generated/unity-u48/readiness.json')
for entry in approved['entries']: entry['productionConnected']=True; entry['runtimeApproved']=False
approved['productionConnectionStatus']='connected-awaiting-runtime-verification'; approved['productionConnectedCount']=46; approved['runtimeApprovedCount']=0
for group in approval['assetGroups']:
    for candidate in group['candidates']:
        candidate['productionConnected']=candidate['candidateId']==group['humanApprovedCandidateId']; candidate['runtimeApproved']=False
approval['productionProviderModified']=True; approval['runtimeApprovedCount']=0
summary['productionConnectionStatus']='connected-awaiting-runtime-verification'; summary['productionConnectedCount']=46; summary['runtimeApprovedCount']=0
readiness.update({'approvedProductionAssetSetAvailable':True,'productionVisualAssetProviderConnected':True,'runtimeVisualReady':False,'simulatorReady':False,'status':'PRODUCTION_VISUAL_CONNECTED_AWAITING_SIMULATOR_VERIFICATION','completionBlocked':True,'blockers':['PRODUCTION_VISUAL_SIMULATOR_VERIFICATION_REQUIRED'],'blockReason':'PRODUCTION_VISUAL_SIMULATOR_VERIFICATION_REQUIRED'})
write('docs/design-targets/generated/unity-u48/approved-production-set.json',approved); write('docs/design-targets/generated/unity-u48/approval-pack/approval-manifest.json',approval); write('docs/design-targets/generated/unity-u48/human-approval-summary.json',summary); write('docs/design-targets/generated/unity-u48/readiness.json',readiness)
print('U48 production connection recorded: connected=46, runtimeApproved=0.')
