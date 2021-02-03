package com.github.fdfea.tictactrains;

import java.util.Set;

enum IdSet {

    ALL(Set.of(
            "a7", "b7", "c7", "d7", "e7", "f7", "g7",
            "a6", "b6", "c6", "d6", "e6", "f6", "g6",
            "a5", "b5", "c5", "d5", "e5", "f5", "g5",
            "a4", "b4", "c4", "d4", "e4", "f4", "g4",
            "a3", "b3", "c3", "d3", "e3", "f3", "g3",
            "a2", "b2", "c2", "d2", "e2", "f2", "g2",
            "a1", "b1", "c1", "d1", "e1", "f1", "g1"
    )), RING1(Set.of(
            "a7", "b7", "c7", "d7", "e7", "f7", "g7",
            "a6", "b6", "c6", "d6", "e6", "f6", "g6",
            "a5", "b5", "c5", "d5", "e5", "f5", "g5",
            "a4", "b4", "c4",       "e4", "f4", "g4",
            "a3", "b3", "c3", "d3", "e3", "f3", "g3",
            "a2", "b2", "c2", "d2", "e2", "f2", "g2",
            "a1", "b1", "c1", "d1", "e1", "f1", "g1"
    )), RING2(Set.of(
            "a7", "b7", "c7", "d7", "e7", "f7", "g7",
            "a6", "b6", "c6", "d6", "e6", "f6", "g6",
            "a5", "b5",                   "f5", "g5",
            "a4", "b4",                   "f4", "g4",
            "a3", "b3",                   "f3", "g3",
            "a2", "b2", "c2", "d2", "e2", "f2", "g2",
            "a1", "b1", "c1", "d1", "e1", "f1", "g1"
    )), RING3(Set.of(
            "a7", "b7", "c7", "d7", "e7", "f7", "g7",
            "a6",                               "g6",
            "a5",                               "g5",
            "a4",                               "g4",
            "a3",                               "g3",
            "a2",                               "g2",
            "a1", "b1", "c1", "d1", "e1", "f1", "g1"
    )), RING2_C(Set.of(
            "a7", "b7", "c7", "d7", "e7", "f7", "g7",
            "a6", "b6", "c6", "d6", "e6", "f6", "g6",
            "a5", "b5",                   "f5", "g5",
            "a4", "b4",       "d4",       "f4", "g4",
            "a3", "b3",                   "f3", "g3",
            "a2", "b2", "c2", "d2", "e2", "f2", "g2",
            "a1", "b1", "c1", "d1", "e1", "f1", "g1"
    )), RING3_C(Set.of(
            "a7", "b7", "c7", "d7", "e7", "f7", "g7",
            "a6",                               "g6",
            "a5",                               "g5",
            "a4",             "d4",             "g4",
            "a3",                               "g3",
            "a2",                               "g2",
            "a1", "b1", "c1", "d1", "e1", "f1", "g1"
    ));

    private Set<String> ids;

    IdSet(Set<String> ids) {
        this.ids = ids;
    }

    Set<String> getIds() {
        return ids;
    }

}