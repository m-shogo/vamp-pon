#import <Foundation/Foundation.h>

extern "C" int VampPonGetThermalState(void)
{
    if (@available(iOS 11.0, *))
    {
        return (int)[NSProcessInfo processInfo].thermalState;
    }

    return -1;
}
