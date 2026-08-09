#pragma once

#ifdef __cplusplus
extern "C" {
#endif

int VP_Haptics_IsSupported(void);
int VP_Haptics_Start(void);
void VP_Haptics_Stop(void);
void VP_Haptics_Reset(void);
int VP_Haptics_Play(float intensity, float durationSeconds);
const char *VP_Haptics_LastError(void);

#ifdef __cplusplus
}
#endif
