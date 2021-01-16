#include <stdlib.h>
#include <stdio.h>
#include <stdint.h>
#include <string.h>
#include <errno.h>
#include <ctype.h>

#include "ttt.h"
#include "board_pred.h"
#include "mctn.h"
#include "bitutil.h"
#include "util.h"
#ifdef DEBUG
#include "debug.h"
#endif

static void ttt_cfg_load(tTTTConfig *pConfig);

int main(void)
{
    int Res = 0;

    tTTT Game;
    tTTTConfig Config;
    
    ttt_cfg_init(&Config);
    ttt_cfg_load(&Config);

#ifdef DEBUG
    printf("%s: %d\n", TTT_CONFIG_COMPUTER_PLAYING, Config.ComputerPlaying);
    printf("%s: %d\n", TTT_CONFIG_COMPUTER_PLAYER, Config.ComputerPlayer);
    printf("%s: %d\n", TTT_CONFIG_RULES_TYPE, Config.RulesConfig.RulesType);
    printf("%s: %d\n", TTT_CONFIG_SIMULATIONS, Config.MctsConfig.Simulations);
    printf("%s: %d\n", TTT_CONFIG_SCORING_ALGORITHM, Config.MctsConfig.ScoringAlgorithm);
    printf("%s: %d\n", TTT_CONFIG_PREDICTION_POLICY, Config.MctsConfig.PredictionPolicy);
    printf("%s: %d\n\n", TTT_CONFIG_PREDICTION_STRATEGY, Config.MctsConfig.PredictionStrategy);
#endif

    bool ComputerPlaying = Config.ComputerPlaying;
    bool ComputerPlayer = Config.ComputerPlayer;

    Res = ttt_init(&Game, &Config);
    if (Res < 0)
    {
        goto Error;
    }

    char *pBoardStr = NULL;
    char *pMovesStr = NULL;
#ifdef STATS
    char *pMctsStr = NULL;
#endif
    int *pMoves = NULL;
    int MovesSize;

    pBoardStr = board_string(&Game.Board);
    printf("%s\n\n", pBoardStr);
    free(pBoardStr);
    pBoardStr = NULL;

    char (*pId)[BOARD_ID_STR_LEN] = malloc(sizeof(char)*BOARD_ID_STR_LEN);
    if (pId IS NULL)
    {
        Res = -ENOMEM;
#ifdef DEBUG
        dbg_printf("ERROR: No memory available\n");
#endif
        goto Error;
    }

    while (NOT board_finished(&Game.Board))
    {
        int Index;
        bool Player = ttt_get_player(&Game);

        if (ComputerPlaying AND Player == ComputerPlayer) 
        {
            Index = ttt_get_ai_move(&Game);
            if (Index < 0)
            {
                Res = Index;
                goto Error;
            }
        } 
        else
        {
            uint64_t Policy = rules_policy(&Game.Rules, &Game.Board);
            uint64_t Indices = board_valid_indices(&Game.Board, Policy, false);

            while (true)
            {
                if (ComputerPlaying)
                {
                    printf("Enter move: ");
                }
                else
                {
                    printf("Enter move (Player %d): ", (Player ? 1 : 2));
                }

                if (fgets(*pId, BOARD_ID_STR_LEN, stdin) IS_NOT NULL)
                {
                    int c; 
                    while ((c = getchar()) != '\n' AND c != EOF);

                    if (board_id_valid(pId)) 
                    {
                        Index = board_id_index(pId);

                        if (BitTest64(Indices, (tIndex) Index))
                        {
                            break;
                        }
                    }
                }
            }
        }

#ifdef STATS
        if (ComputerPlaying)
        {
            pMctsStr = mctn_string(Game.Mcts.pRoot);
            printf("BEFORE SHIFT\n%s\n", pMctsStr);
            free(pMctsStr);
            pMctsStr = NULL;
        }
#endif

        ttt_give_move(&Game, Index);

#ifdef STATS
        if (ComputerPlaying)
        {
            pMctsStr = mctn_string(Game.Mcts.pRoot);
            printf("AFTER SHIFT\n%s\n", pMctsStr);
            free(pMctsStr);
            pMctsStr = NULL;
        }
#endif

        pMoves = ttt_get_moves(&Game, &MovesSize);
        pMovesStr = rules_moves_string(&Game.Rules, pMoves, MovesSize);
        free(pMoves);
        pMoves = NULL;
        printf("%s\n", pMovesStr);
        free(pMovesStr);
        pMovesStr = NULL;
        pBoardStr = board_string(&Game.Board);
        printf("%s\n\n", pBoardStr);
        free(pBoardStr);
        pBoardStr = NULL;
    }

    int Score = ttt_get_score(&Game);
    printf("Score: %d\n", Score);

    free(pId);
    ttt_free(&Game);

Error:
    return Res;
}

int ttt_init(tTTT *pGame, tTTTConfig *pConfig)
{
    int Res = 0;

    board_init(&pGame->Board);
    rules_init(&pGame->Rules, &pConfig->RulesConfig);
    memset(&pGame->Moves, 0, sizeof(pGame->Moves));

    Res = mcts_init(&pGame->Mcts, &pGame->Rules, &pGame->Board, &pConfig->MctsConfig);
    if (Res < 0)
    {
        goto Error;
    }

Error:
    return Res;
}

void ttt_cfg_init(tTTTConfig *pConfig)
{
    pConfig->ComputerPlaying = false;
    pConfig->ComputerPlayer = false;
    rules_cfg_init(&pConfig->RulesConfig);
    mcts_cfg_init(&pConfig->MctsConfig);
}

void ttt_free(tTTT *pGame)
{
    mcts_free(&pGame->Mcts);
}

int ttt_get_ai_move(tTTT *pGame)
{
    int Res, Index;
    uint64_t Policy = rules_policy(&pGame->Rules, &pGame->Board);
    uint64_t Indices = board_valid_indices(&pGame->Board, Policy, false);

    if (BitTest64(Indices, 24)) 
    {
        Index = 24;
    } 
    else 
    {
        mcts_simulate(&pGame->Mcts);
        tBoard *pNextState = mcts_get_state(&pGame->Mcts);
        if (pNextState IS NULL)
        {
            Res = -ENODATA;
            goto Error;
        }

        Index = board_last_move_index(pNextState);
    }
    goto Success;

Error:
    Index = Res;
Success:
    return Index;
}

int ttt_give_move(tTTT *pGame, int Index)
{
    int Res = 0;
    uint64_t Policy = rules_policy(&pGame->Rules, &pGame->Board);
    uint64_t Indices = board_valid_indices(&pGame->Board, Policy, false);

    if (NOT board_index_valid(Index) 
        OR NOT BitTest64(Indices, Index))
    {
        Res = -EINVAL;
#ifdef DEBUG
        dbg_printf("ERROR: Invalid move attempted\n");
#endif
        goto Error;
    }

    bool Player = rules_player(&pGame->Rules, &pGame->Board);
    pGame->Moves[board_move(&pGame->Board)] = (tIndex) Index;
    board_make_move(&pGame->Board, (tIndex) Index, Player);
    mcts_give_state(&pGame->Mcts, &pGame->Board);

Error:
    return Res;
}

bool ttt_get_player(tTTT *pGame)
{
    return rules_player(&pGame->Rules, &pGame->Board);
}

bool ttt_is_finished(tTTT *pGame)
{
    return board_finished(&pGame->Board);
}

int ttt_get_score(tTTT *pGame)
{
    return (int) board_score(&pGame->Board, SCORING_ALGORITHM_OPTIMAL);
}

int *ttt_get_moves(tTTT *pGame, int *pSize)
{
    int *pMoves = NULL;
    *pSize = (int) board_move(&pGame->Board);

    pMoves = malloc(*pSize*sizeof(int));
    if (pMoves IS NULL)
    {
#ifdef DEBUG
        dbg_printf("ERROR: No memory available\n");
#endif
        *pSize = 0;
        goto Error;
    }

    for (tIndex i = 0; i < *pSize; ++i)
    {
        pMoves[i] = (int) pGame->Moves[i];
    }

Error:
    return pMoves;
}

static void ttt_cfg_load(tTTTConfig *pConfig)
{
    FILE *pFile;
    char Buf[TTT_CONFIG_MAXLINE];

    if ((pFile = fopen(TTT_CONFIG_FILENAME, "r")) IS_NOT NULL)
    {
        int Line = 0;
        while (fgets(Buf, TTT_CONFIG_MAXLINE, pFile) IS_NOT NULL)
        {
            Line++;

            //remove newline and spaces
            Buf[strcspn(Buf, "\n")] = '\0';

            char *pS = &Buf[0], *pD = pS;
            do while (isspace(*pS)) pS++; while ((*pD++ = *pS++));

            //check for empty line or comment
            if (Buf[0] == '\0' OR strncmp(Buf, "#", 1) == 0)
            {
                continue;
            }

            //handle configuration parameters
            char *pKey, *pValue = NULL, *pEnd = NULL;
            pKey = strtok(Buf, "=");
            pValue = strtok(pValue, "=");

            //convert value to number
            int Val = strtol(pValue, &pEnd, 10);

            if (pValue == pEnd)
            {
                fprintf(stderr, "ERROR: Malformatted data at line %d\n", Line);
                continue;
            }

            //compare keys to config params
            if (strncmp(pKey, TTT_CONFIG_COMPUTER_PLAYING, sizeof(TTT_CONFIG_COMPUTER_PLAYING)) == 0)
            {
                if (Val == 1)
                {
                    pConfig->ComputerPlaying = true;
                }
                else if (Val != 0)
                {
                    TTT_CFG_VAL_ERR_PRINT(Val, Line);
                }
            }
            else if (strncmp(pKey, TTT_CONFIG_COMPUTER_PLAYER, sizeof(TTT_CONFIG_COMPUTER_PLAYER)) == 0)
            {
                if (Val == 1)
                {
                    pConfig->ComputerPlayer = true;
                }
                else if (Val != 0)
                {
                    TTT_CFG_VAL_ERR_PRINT(Val, Line);
                }
            }
            else if (strncmp(pKey, TTT_CONFIG_RULES_TYPE, sizeof(TTT_CONFIG_RULES_TYPE)) == 0)
            {
                switch (Val)
                {
                    case RULES_CLASSICAL:
                    {
                        pConfig->RulesConfig.RulesType = RULES_CLASSICAL;
                        break;
                    }
                    case RULES_MODERN: 
                    {
                        pConfig->RulesConfig.RulesType = RULES_MODERN;
                        break;
                    }
                    case RULES_EXPERIMENTAL: 
                    {
                        pConfig->RulesConfig.RulesType = RULES_EXPERIMENTAL;
                        break;
                    }
                    default: 
                    {
                        TTT_CFG_VAL_ERR_PRINT(Val, Line);
                        break;
                    }
                }
            }
            else if (strncmp(pKey, TTT_CONFIG_SIMULATIONS, sizeof(TTT_CONFIG_SIMULATIONS)) == 0)
            {
                if (Val > 0 AND Val <= TVISITS_MAX)
                {
                    pConfig->MctsConfig.Simulations = Val;
                }
                else 
                {
                    TTT_CFG_VAL_ERR_PRINT(Val, Line);
                }
            }
            else if (strncmp(pKey, TTT_CONFIG_SCORING_ALGORITHM, sizeof(TTT_CONFIG_SCORING_ALGORITHM)) == 0)
            {
                switch (Val)
                {
                    case SCORING_ALGORITHM_OPTIMAL:
                    {
                        pConfig->MctsConfig.ScoringAlgorithm = SCORING_ALGORITHM_OPTIMAL;
                        break;
                    }
                    case SCORING_ALGORITHM_QUICK:
                    {
                        pConfig->MctsConfig.ScoringAlgorithm = SCORING_ALGORITHM_QUICK;
                        break;
                    }
                    default:
                    {
                        TTT_CFG_VAL_ERR_PRINT(Val, Line);
                        break; 
                    }
                }
            }
            else if (strncmp(pKey, TTT_CONFIG_PREDICTION_POLICY, sizeof(TTT_CONFIG_PREDICTION_POLICY)) == 0)
            {
                switch (Val)
                {
                    case PREDICTION_POLICY_NEVER: 
                    {
                        pConfig->MctsConfig.PredictionPolicy = PREDICTION_POLICY_NEVER;
                        break;  
                    }
                    case PREDICTION_POLICY_ALWAYS:
                    {
                        pConfig->MctsConfig.PredictionPolicy = PREDICTION_POLICY_ALWAYS;
                        break;
                    }
                    case PREDICTION_POLICY_LONGPATHS:
                    {
                        pConfig->MctsConfig.PredictionPolicy = PREDICTION_POLICY_LONGPATHS;
                        break;
                    }
                    default: 
                    {
                        TTT_CFG_VAL_ERR_PRINT(Val, Line);
                        break;
                    }
                }
            }
            else if (strncmp(pKey, TTT_CONFIG_PREDICTION_STRATEGY, sizeof(TTT_CONFIG_PREDICTION_STRATEGY)) == 0)
            {
                switch (Val)
                {
                    case PREDICTION_STRATEGY_NBR_LINREG:
                    {
                        pConfig->MctsConfig.PredictionStrategy = PREDICTION_STRATEGY_NBR_LINREG;
                        break;  
                    }
                    case PREDICTION_STRATEGY_NBR_LOGREG:
                    {
                        pConfig->MctsConfig.PredictionStrategy = PREDICTION_STRATEGY_NBR_LOGREG;
                        break;
                    }
                    case PREDICTION_STRATEGY_SHP_MLP:
                    {
                        pConfig->MctsConfig.PredictionStrategy = PREDICTION_STRATEGY_SHP_MLP;
                        break;
                    }
                    default:
                    {
                        TTT_CFG_VAL_ERR_PRINT(Val, Line);
                        break;
                    }
                }
            }
            else
            {
                TTT_CFG_KEY_ERR_PRINT(pKey, Line);
            }
        }

        fclose(pFile);
    }
    else
    {
        fprintf(stderr, "ERROR: Could not open file \"%s\"\n", TTT_CONFIG_FILENAME);
        exit(EXIT_FAILURE);
    }
}
