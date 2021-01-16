#ifndef __DEBUG_H__
#define __DEBUG_H__

#include <stdio.h>

#define DEBUG_RANDOM_SEED   20

#define dbg_printf(f, a...)                                             \
    do {                                                                \
        { fprintf(stderr, "%s(%d): " f, __func__, __LINE__, ## a); }    \
    } while (0)

#endif
