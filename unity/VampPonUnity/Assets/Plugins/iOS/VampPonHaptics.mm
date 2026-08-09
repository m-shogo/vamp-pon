#import "VampPonHaptics.h"
#import <CoreHaptics/CoreHaptics.h>
#import <TargetConditionals.h>
#import <math.h>

static CHHapticEngine *vpEngine = nil;
static NSString *vpLastError = @"";

static void VPSetError(NSError *error)
{
    vpLastError = error == nil ? @"" : [error.localizedDescription copy];
}

static BOOL VPStartEngine(void)
{
    if (vpEngine == nil) return NO;
    NSError *error = nil;
    BOOL started = [vpEngine startAndReturnError:&error];
    VPSetError(error);
    return started;
}

extern "C" int VP_Haptics_IsSupported(void)
{
#if TARGET_OS_SIMULATOR
    return 0;
#else
    if (@available(iOS 13.0, *))
    {
        return [CHHapticEngine.capabilitiesForHardware supportsHaptics] ? 1 : 0;
    }
    return 0;
#endif
}

extern "C" int VP_Haptics_Start(void)
{
    @autoreleasepool
    {
        if (VP_Haptics_IsSupported() != 1) return 0;
        if (@available(iOS 13.0, *))
        {
            if (vpEngine == nil)
            {
                NSError *error = nil;
                vpEngine = [[CHHapticEngine alloc] initAndReturnError:&error];
                VPSetError(error);
                if (vpEngine == nil) return 0;
                vpEngine.playsHapticsOnly = YES;
                vpEngine.autoShutdownEnabled = YES;
                vpEngine.resetHandler = ^{
                    VPStartEngine();
                };
                vpEngine.stoppedHandler = ^(CHHapticEngineStoppedReason reason) {
                    if (reason != CHHapticEngineStoppedReasonApplicationSuspended &&
                        reason != CHHapticEngineStoppedReasonIdleTimeout)
                    {
                        vpLastError = [NSString stringWithFormat:@"Core Haptics engine stopped: %ld", (long)reason];
                    }
                };
            }
            return VPStartEngine() ? 1 : 0;
        }
        return 0;
    }
}

extern "C" void VP_Haptics_Stop(void)
{
    @autoreleasepool
    {
        if (@available(iOS 13.0, *)) [vpEngine stopWithCompletionHandler:nil];
    }
}

extern "C" void VP_Haptics_Reset(void)
{
    @autoreleasepool
    {
        VP_Haptics_Stop();
        vpEngine = nil;
        vpLastError = @"";
    }
}

extern "C" int VP_Haptics_Play(float intensity, float durationSeconds)
{
    @autoreleasepool
    {
        if (VP_Haptics_IsSupported() != 1 || VP_Haptics_Start() != 1) return 0;
        if (@available(iOS 13.0, *))
        {
            const float clampedIntensity = fmaxf(0.0f, fminf(1.0f, intensity));
            const float clampedDuration = fmaxf(0.015f, fminf(0.5f, durationSeconds));
            CHHapticEventParameter *intensityParameter = [[CHHapticEventParameter alloc]
                initWithParameterID:CHHapticEventParameterIDHapticIntensity value:clampedIntensity];
            CHHapticEventParameter *sharpnessParameter = [[CHHapticEventParameter alloc]
                initWithParameterID:CHHapticEventParameterIDHapticSharpness value:(0.25f + clampedIntensity * 0.45f)];
            CHHapticEvent *event = [[CHHapticEvent alloc]
                initWithEventType:CHHapticEventTypeHapticContinuous
                parameters:@[intensityParameter, sharpnessParameter]
                relativeTime:0
                duration:clampedDuration];
            NSError *error = nil;
            CHHapticPattern *pattern = [[CHHapticPattern alloc] initWithEvents:@[event] parameters:@[] error:&error];
            if (pattern == nil)
            {
                VPSetError(error);
                return 0;
            }
            id<CHHapticPatternPlayer> player = [vpEngine createPlayerWithPattern:pattern error:&error];
            if (player == nil || ![player startAtTime:0 error:&error])
            {
                VPSetError(error);
                return 0;
            }
            VPSetError(nil);
            return 1;
        }
        return 0;
    }
}

extern "C" const char *VP_Haptics_LastError(void)
{
    return [vpLastError UTF8String];
}
