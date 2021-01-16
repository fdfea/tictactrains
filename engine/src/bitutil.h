#ifndef __BITUTIL_H__
#define __BITUTIL_H__

#include <stdint.h>
#include <stdbool.h>

#include "random.h"

typedef uint_fast8_t tIndex;
typedef uint_fast8_t tSize;

bool BitTest64(uint64_t Mask, tIndex Index);
void BitSet64(uint64_t *pMask, tIndex Index);
void BitReset64(uint64_t *pMask, tIndex Index);
tSize BitPopCount64(uint64_t Mask);
tIndex BitLzCount64(uint64_t Mask);
tIndex BitKthSetIndex64(uint64_t Mask, uint64_t Rank);
tIndex BitScanRandom64(uint64_t Mask, tRandom *pRand);

#endif
