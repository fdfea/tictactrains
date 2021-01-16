#ifndef __BOARD_PRED_H__
#define __BOARD_PRED_H__

#include "board.h"

#define BOARD_NEIGHBORS     4
#define BOARD_SHAPES        33

#define BOARD_PRED_DRAW_MARGIN      0.4f
#define BOARD_SHP_MLP_SCORE_SCALER  24

#define BOARD_SHP_MLP_NEURONS   20
#define BOARD_SHP_LOOKUP_SIZE   512

typedef enum PredictionStrategy 
{
    PREDICTION_STRATEGY_NBR_LINREG = 1, 
    PREDICTION_STRATEGY_NBR_LOGREG = 2, 
    PREDICTION_STRATEGY_SHP_MLP    = 3, 

} ePredictionStrategy;

float board_predict_score(tBoard *pBoard, ePredictionStrategy Strategy);

#endif
