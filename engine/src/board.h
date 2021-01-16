#ifndef __BOARD_H__
#define __BOARD_H__

#include <stdint.h>
#include <stdbool.h>

#include "bitutil.h"

#define BOARD_ROWS      7
#define BOARD_COLUMNS   7

#define BOARD_ID_STR_LEN    3
#define BOARD_STR_LEN       190

#define BOARD_MASK              0x0001FFFFFFFFFFFFULL
#define BOARD_LAST_MOVE_INDEX   58
#define BOARD_MIN_ADJ_SQS       5

#define BOARD_WIN   1.0f
#define BOARD_DRAW  0.5f
#define BOARD_LOSS  0.0f

#define BOARD_WIN_BASE      0.90f
#define BOARD_WIN_BONUS     0.025f
#define BOARD_LOSS_BASE     0.10f
#define BOARD_LOSS_PENALTY  0.025f

typedef int_fast8_t tScore;

typedef struct Board
{
    uint64_t Data;
    uint64_t Valid;

} tBoard;

typedef enum ScoringAlgorithm
{
    SCORING_ALGORITHM_OPTIMAL   = 1,
    SCORING_ALGORITHM_QUICK     = 2,

} eScoringAlgorithm;

void board_init(tBoard *pBoard);
void board_copy(tBoard *pDest, tBoard *pSrc);
bool board_equals(tBoard *pBoard, tBoard *pB);
void board_make_move(tBoard *pBoard, tIndex Index, bool Player);
bool board_finished(tBoard *pBoard);
tSize board_move(tBoard *pBoard);
tIndex board_last_move_index(tBoard *pBoard);
uint64_t board_valid_indices(tBoard *pBoard, uint64_t Policy, bool Adj);
tScore board_score(tBoard *pBoard, eScoringAlgorithm Algorithm);
float board_fscore(tScore Score);
tSize board_longest_path(tBoard *pBoard);
char *board_string(tBoard *pBoard);
char board_index_char(tBoard *pBoard, tIndex Index);
tIndex board_id_index(char (*pId)[BOARD_ID_STR_LEN]);
char *board_index_id(tIndex Index);
bool board_id_valid(char (*pId)[BOARD_ID_STR_LEN]);
bool board_index_valid(tIndex Index);
bool board_index_empty(tBoard *pBoard, tIndex Index);
bool board_index_player(tBoard *pBoard, tIndex Index);
bool board_index_left_valid(tIndex Index);
bool board_index_right_valid(tIndex Index);
bool board_index_top_valid(tIndex Index);
bool board_index_bottom_valid(tIndex Index);
tIndex board_index_left(tIndex Index);
tIndex board_index_right(tIndex Index);
tIndex board_index_top(tIndex Index);
tIndex board_index_bottom(tIndex Index);

#endif
