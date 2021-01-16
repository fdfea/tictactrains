#ifndef __TTT_H__
#define __TTT_H__

#include "board.h"
#include "rules.h"
#include "mcts.h"

#define TTT_CONFIG_MAXLINE              128
#define TTT_CONFIG_FILENAME             "ttt.conf"
#define TTT_CONFIG_COMPUTER_PLAYING     "COMPUTER_PLAYING"
#define TTT_CONFIG_COMPUTER_PLAYER      "COMPUTER_PLAYER"
#define TTT_CONFIG_RULES_TYPE           "RULES_TYPE"
#define TTT_CONFIG_SIMULATIONS          "SIMULATIONS"
#define TTT_CONFIG_SCORING_ALGORITHM    "SCORING_ALGORITHM"
#define TTT_CONFIG_PREDICTION_POLICY    "PREDICTION_POLICY"
#define TTT_CONFIG_PREDICTION_STRATEGY  "PREDICTION_STRATEGY"

#define TTT_CFG_KEY_ERR_PRINT(Key, Line)                                            \
    do {                                                                            \
        { fprintf(stderr, "ERROR: Config key \"%s\" at line %d\n", Key, Line); }    \
    } while (0)

#define TTT_CFG_VAL_ERR_PRINT(Val, Line)                                            \
    do {                                                                            \
        { fprintf(stderr, "ERROR: Config value \"%d\" at line %d\n", Val, Line); }  \
    } while (0)

typedef struct TTTConfig
{
    bool ComputerPlaying;
    bool ComputerPlayer;
    tRulesConfig RulesConfig;
    tMctsConfig MctsConfig;

} tTTTConfig;

typedef struct TTT 
{
    tBoard Board;
    tRules Rules;
    tMcts Mcts;
    tIndex Moves[BOARD_ROWS*BOARD_COLUMNS];

} tTTT;

void ttt_cfg_init(tTTTConfig *pConfig);
int ttt_init(tTTT *pGame, tTTTConfig *pConfig);
void ttt_free(tTTT *pGame);
int ttt_give_move(tTTT* pGame, int Index);
int ttt_get_ai_move(tTTT *pGame);
bool ttt_get_player(tTTT *pGame);
bool ttt_is_finished(tTTT *pGame);
int ttt_get_score(tTTT *pGame);
int *ttt_get_moves(tTTT *pGame, int *pSize);

#endif
