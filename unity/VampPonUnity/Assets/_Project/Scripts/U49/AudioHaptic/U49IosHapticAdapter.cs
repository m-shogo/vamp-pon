using System;
using System.Runtime.InteropServices;
using VampPon.UnitySpike.U28.FeelIntegration;

namespace VampPon.UnitySpike.U49.AudioHaptic
{
    public sealed class U49IosHapticAdapter : IU28HapticPlatformAdapter
    {
        private bool initialized;
        private bool supported;

        public bool IsDeviceExecutionSupported => initialized && supported;
        public bool LastExecutionSucceeded { get; private set; }
        public U49HapticCapability Capability => !initialized ? U49HapticCapability.Unknown : supported ? U49HapticCapability.Supported : U49HapticCapability.Unsupported;
        public string LastError => ReadLastError();

        public bool Initialize()
        {
#if UNITY_IOS && !UNITY_EDITOR
            supported = VP_Haptics_IsSupported() == 1;
            initialized = supported && VP_Haptics_Start() == 1;
            return !supported || initialized;
#else
            supported = false;
            initialized = true;
            return true;
#endif
        }

        public void Execute(U28HapticDefinition definition)
        {
            LastExecutionSucceeded = false;
            if (!IsDeviceExecutionSupported || definition.Id == U28HapticEventId.None) return;
#if UNITY_IOS && !UNITY_EDITOR
            LastExecutionSucceeded = VP_Haptics_Play(definition.IntensityDraft, definition.DurationSecondsDraft) == 1;
#endif
        }

        public void Suspend()
        {
#if UNITY_IOS && !UNITY_EDITOR
            if (initialized && supported) VP_Haptics_Stop();
#endif
            initialized = false;
        }

        public void Resume() => Initialize();

        public void Shutdown()
        {
#if UNITY_IOS && !UNITY_EDITOR
            VP_Haptics_Stop();
            VP_Haptics_Reset();
#endif
            initialized = false;
            supported = false;
            LastExecutionSucceeded = false;
        }

        private static string ReadLastError()
        {
#if UNITY_IOS && !UNITY_EDITOR
            var pointer = VP_Haptics_LastError();
            return pointer == IntPtr.Zero ? string.Empty : Marshal.PtrToStringAnsi(pointer) ?? string.Empty;
#else
            return string.Empty;
#endif
        }

#if UNITY_IOS && !UNITY_EDITOR
        [DllImport("__Internal")] private static extern int VP_Haptics_IsSupported();
        [DllImport("__Internal")] private static extern int VP_Haptics_Start();
        [DllImport("__Internal")] private static extern void VP_Haptics_Stop();
        [DllImport("__Internal")] private static extern void VP_Haptics_Reset();
        [DllImport("__Internal")] private static extern int VP_Haptics_Play(float intensity, float durationSeconds);
        [DllImport("__Internal")] private static extern IntPtr VP_Haptics_LastError();
#endif
    }
}
