#include <stdlib.h>
#include <errno.h>

#include "mctn_list.h"
#include "mctn.h"
#include "board.h"
#include "util.h"
#ifdef DEBUG
#include "debug.h"
#endif

void mctn_list_init(tMctnList *pList)
{
    pList->pItems = NULL;
    pList->Size = 0;
}

void mctn_list_free(tMctnList *pList)
{
    if (pList->pItems IS_NOT NULL)
    {
        free(pList->pItems);
        pList->pItems = NULL;
    }

    pList->Size = 0;
}

tSize mctn_list_size(tMctnList *pList)
{
    return pList->Size;
}

bool mctn_list_empty(tMctnList *pList)
{
    return pList->Size == 0;
}

int mctn_list_expand(tMctnList *pList, tVector *pNextStates)
{
    int Res = 0;

    tSize Size = vector_size(pNextStates);

    if (pList->Size + Size < MCTN_LIST_MAX_SIZE)
    {
        if (mctn_list_empty(pList))
        {
            pList->pItems = malloc(sizeof(tMctn) * Size);
        }
        else
        {
            pList->pItems = realloc(pList->pItems, sizeof(tMctn) * (pList->Size + Size));
        }
        if (pList->pItems IS NULL AND Size > 0) 
        {
            Res = -ENOMEM;
#ifdef DEBUG
            dbg_printf("ERROR: No memory available\n");
#endif
            goto Error;
        }

        for (tIndex i = 0; i < Size; ++i)
        {
            tBoard *pBoard = (tBoard *) vector_get(pNextStates, i);
            tMctn* pChild = &pList->pItems[i];
            mctn_init(pChild, pBoard);
        }

        pList->Size += Size;
    }
    else
    {
        Res = -EINVAL;
#ifdef DEBUG
        dbg_printf("WARN: List reached max capacity\n");
#endif
    }

Error:
    return Res;
}

int mctn_list_add(tMctnList *pList, tMctn *pNode)
{
    int Res = 0;

    if (pList->Size < MCTN_LIST_MAX_SIZE)
    {
        if (mctn_list_empty(pList))
        {
            pList->pItems = malloc(sizeof(tMctn) * (pList->Size+1));
        }
        else
        {
            pList->pItems = realloc(pList->pItems, sizeof(tMctn) * (pList->Size+1));
        }
        if (pList->pItems IS NULL) 
        {
            Res = -ENOMEM;
#ifdef DEBUG
            dbg_printf("ERROR: No memory available\n");
#endif
            goto Error;
        }

        pList->pItems[pList->Size++] = *pNode;
    }
#ifdef DEBUG
    else
    {
        dbg_printf("WARN: List reached max capacity\n");
    }
#endif
    
Error:
    return Res;
}

tMctn *mctn_list_get(tMctnList *pList, tIndex Index)
{
    tMctn *pTmp = NULL;

    if (Index >= 0 AND Index < pList->Size)
    {
        pTmp = &pList->pItems[Index];
    }
#ifdef DEBUG
    else
    {
        dbg_printf("WARN: List index out of bounds\n");
    }
#endif

    return pTmp;
}

void mctn_list_set(tMctnList *pList, tIndex Index, tMctn *pNode)
{
    if (Index >= 0 AND Index < pList->Size)
    {
        pList->pItems[Index] = *pNode;
    }
#ifdef DEBUG
    else
    {
        dbg_printf("WARN: List index out of bounds\n");
    }
#endif
}

int mctn_list_delete(tMctnList *pList, tIndex Index)
{
    int Res = 0;

    if (Index >= 0 AND Index < pList->Size)
    {
        for (tIndex i = Index; i < pList->Size - 1; ++i) 
        {
            pList->pItems[i] = pList->pItems[i + 1];
        }

        pList->pItems = realloc(pList->pItems, sizeof(tMctn) * --pList->Size);
        if (pList->pItems IS NULL AND pList->Size > 0) 
        {
            Res = -ENOMEM;
#ifdef DEBUG
            dbg_printf("ERROR: No memory available\n");
#endif
            goto Error;
        }  
    }
#ifdef DEBUG
    else
    {
        dbg_printf("WARN: List index out of bounds\n");
    }
#endif 

Error: 
    return Res;
}

void mctn_list_shuffle(tMctnList *pList, tRandom* pRand)
{
    tMctn Tmp;
    tIndex i, j;

    for (i = pList->Size - 1; i > 0; --i) 
    {
        j = rand_xorshft128(pRand) % (i + 1);
        Tmp = *mctn_list_get(pList, j);
        mctn_list_set(pList, j, mctn_list_get(pList, i));
        mctn_list_set(pList, i, &Tmp);
    }
}
