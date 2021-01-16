#ifndef __UTIL_H__
#define __UTIL_H__

#define NOT     !
#define AND     &&
#define OR      ||
#define IS      ==
#define IS_NOT  !=

#define SET_IF_GREATER(Val, MaxVal)                 \
    do {                                            \
        { if (Val > MaxVal) { MaxVal = Val; } }     \
    } while (0)

#define SET_IF_GREATER_W_EXTRA(Val, MaxVal, Extra, MaxExtra)        \
    do {                                                            \
        { if (Val > MaxVal) { MaxVal = Val; MaxExtra = Extra; } }   \
    } while (0)

#define SET_IF_GREATER_EQ_W_EXTRA(Val, MaxVal, Extra, MaxExtra)     \
    do {                                                            \
        { if (Val >= MaxVal) { MaxVal = Val; MaxExtra = Extra; } }  \
    } while (0)

#endif
