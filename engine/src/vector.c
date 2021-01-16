#include <stdlib.h>
#include <errno.h>

#include "vector.h"
#include "util.h"
#ifdef DEBUG
#include "debug.h"
#endif

int vector_init(tVector *pVector)
{
    int Res = 0;

    pVector->ppItems = malloc(sizeof(void*) * VECTOR_MAX_SIZE);
    if (pVector->ppItems IS NULL)
    {
        Res = -ENOMEM;
#ifdef DEBUG
        dbg_printf("ERROR: No memory available\n");
#endif
        goto Error;
    }

    pVector->Size = 0;

Error:
    return Res;
}

void vector_free(tVector *pVector)
{
    if (pVector->ppItems IS_NOT NULL)
    {
        free(pVector->ppItems);
        pVector->ppItems = NULL;
    }

    pVector->Size = 0;
}

tSize vector_size(tVector *pVector)
{
    return pVector->Size;
}

bool vector_empty(tVector *pVector)
{
    return pVector->Size == 0;
}

bool vector_add(tVector *pVector, void *pItem)
{
    bool Added = false;

    if (pVector->Size < VECTOR_MAX_SIZE) 
    {
        pVector->ppItems[pVector->Size++] = pItem;
        Added = true;
    }
#ifdef DEBUG
    else
    {
        dbg_printf("WARN: Vector reached max capacity\n");
    }
#endif

    return Added;
}

void *vector_get(tVector *pVector, tIndex Index)
{
    void *pTmp = NULL;

    if (Index >= 0 AND Index < pVector->Size)
    {
        pTmp = pVector->ppItems[Index];
    }
#ifdef DEBUG
    else
    {
        dbg_printf("WARN: Vector index out of bounds\n");
    }
#endif

    return pTmp;
}

void *vector_set(tVector *pVector, tIndex Index, void *pItem)
{
    void *pTmp = NULL;

    if (Index >= 0 AND Index < pVector->Size)
    {
        pTmp = pVector->ppItems[Index];
        pVector->ppItems[Index] = pItem;
    }
#ifdef DEBUG
    else
    {
        dbg_printf("WARN: Vector index out of bounds\n");
    }
#endif

    return pTmp;
}

void *vector_delete(tVector *pVector, tIndex Index)
{
    void *pTmp = NULL;

    if (Index >= 0 AND Index < pVector->Size)
    {
        pTmp = pVector->ppItems[Index];

        for (tIndex i = Index; i < pVector->Size - 1; ++i) 
        {
            pVector->ppItems[i] = pVector->ppItems[i + 1];
        }
        pVector->ppItems[--pVector->Size] = NULL;
    }
#ifdef DEBUG
    else
    {
        dbg_printf("WARN: Vector index out of bounds\n");
    }
#endif

    return pTmp;
}

void vector_shuffle(tVector *pVector, tRandom *pRand)
{
    void *pTmp;
    tIndex i, j;

    for (i = pVector->Size - 1; i > 0; --i) 
    {
        j = rand_xorshft128(pRand) % (i + 1);
        pTmp = vector_set(pVector, i, vector_get(pVector, j));
        (void) vector_set(pVector, j, pTmp);
    }
}
