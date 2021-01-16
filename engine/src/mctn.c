#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include <float.h>

#include "mctn.h"
#include "util.h"
#ifdef DEBUG
#include "debug.h"
#endif

static uint32_t mctn_size(tMctn *pNode);
static float UCT(tVisits TotalVisits, tVisits NodeVisits, float NodeScore);

void mctn_init(tMctn *pNode, tBoard *pBoard)
{
    board_copy(&pNode->State, pBoard);
    mctn_list_init(&pNode->Children);
    pNode->Visits = 0;
    pNode->Score = 0.0f;
}

void mctn_free(tMctn *pNode)
{
    for (tIndex i = 0; i < mctn_list_size(&pNode->Children); ++i)
    {
        tMctn *pChild = mctn_list_get(&pNode->Children, i);
        mctn_free(pChild);
        pChild = NULL;
    }

    mctn_list_free(&pNode->Children);
}

void mctn_update(tMctn *pNode, float Score)
{
    pNode->Score += Score;
    pNode->Visits++;
}

int mctn_expand(tMctn *pNode, tVector *pNextStates)
{
    int Res = mctn_list_expand(&pNode->Children, pNextStates);
    return Res;
}

bool mctn_equals(tMctn *pNode, tMctn *pN)
{
    return board_equals(&pNode->State, &pN->State);
}

tMctn *mctn_random_child(tMctn *pNode, tRandom *pRand)
{
    tIndex RandIndex = rand_xorshft128(pRand) % mctn_list_size(&pNode->Children);
    return mctn_list_get(&pNode->Children, RandIndex);
}

tMctn *mctn_best_child_uct(tMctn *pNode)
{
    float ChildUCT, BestUCT = -FLT_MAX;
    tMctn *BestNode = NULL;

    for (tIndex i = 0; i < mctn_list_size(&pNode->Children); ++i)
    {
        tMctn *pChild = mctn_list_get(&pNode->Children, i);
        ChildUCT = UCT(pNode->Visits, pChild->Visits, pChild->Score);

        SET_IF_GREATER_EQ_W_EXTRA(ChildUCT, BestUCT, pChild, BestNode);
    }

    return BestNode;
}

tMctn *mctn_most_visited_child(tMctn *pNode)
{
    tVisits ChildVisits, MostVisits = 0;
    tMctn* BestNode = NULL;

    for (tIndex i = 0; i < mctn_list_size(&pNode->Children); ++i)
    {
        tMctn *pChild = mctn_list_get(&pNode->Children, i);
        ChildVisits = pChild->Visits;

        SET_IF_GREATER_EQ_W_EXTRA(ChildVisits, MostVisits, pChild, BestNode);
    }

    return BestNode;
}

char *mctn_string(tMctn *pNode)
{
    char *pStr = NULL;

    pStr = malloc(sizeof(char)*MCTN_STR_LEN);
    if (pStr IS NULL)
    {
#ifdef DEBUG
        dbg_printf("ERROR: No memory available\n");
#endif
        goto Error;
    }

    char *pBegin = pStr, *pId = NULL;

    tVisits Visits = pNode->Visits;

    pStr += sprintf(pStr, "Tree size: %d, Root visits: %d\n", mctn_size(pNode), Visits);

    for (tIndex i = 0; i < mctn_list_size(&pNode->Children); ++i)
    {

        tMctn *pChild = mctn_list_get(&pNode->Children, i);
        pId = board_index_id(board_last_move_index(&pChild->State));

        pStr += sprintf(pStr, "%s: %.2f/%d ** %d Nodes ** %3.3e UCT\n", 
            pId, pChild->Score, pChild->Visits, mctn_size(pChild),
            UCT(Visits, pChild->Visits, pChild->Score));

        free(pId);
        pId = NULL;
    }

    pStr = pBegin;

Error:
    return pStr;
}

static uint32_t mctn_size(tMctn *pNode)
{
    uint32_t Size = 1;

    for (tIndex i = 0; i < mctn_list_size(&pNode->Children); ++i)
    {
        Size += mctn_size(mctn_list_get(&pNode->Children, i));
    }

    return Size;
}

static float UCT(tVisits TotalVisits, tVisits NodeVisits, float NodeScore)
{
    return (NodeVisits == 0) 
        ? FLT_MAX 
        : (NodeScore/NodeVisits) + sqrtf(2*logf(TotalVisits)/NodeVisits);
}
