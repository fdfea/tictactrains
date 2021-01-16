#include <stdlib.h>
#include <time.h>

#include "random.h"
#ifdef DEBUG
#include "debug.h"
#endif

void rand_init(tRandom *pRand)
{
#ifdef DEBUG
    srand(DEBUG_RANDOM_SEED);
#else
    srand(time(NULL));
#endif
    pRand->s[0] = (uint64_t) rand();
    pRand->s[1] = (uint64_t) rand() + 1;
}

uint64_t rand_xorshft128(tRandom *pRand)
{
    uint64_t s1 = pRand->s[0];
    uint64_t s0 = pRand->s[1];
    pRand->s[0] = s0;
    s1 ^= s1 << 23;
    pRand->s[1] = s1 ^ s0 ^ (s1 >> 18) ^ (s0 >> 5);
    return pRand->s[1] + s0;
}
