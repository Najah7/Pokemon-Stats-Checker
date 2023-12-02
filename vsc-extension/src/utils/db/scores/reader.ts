import { Score } from '../../../types/score';
import { readAllData, readDataByName } from '../common/reader';

import * as env from '../config';

type Scores = Map<number, Score>;

let cashedScores: Scores = new Map<number, Score>();

const readScores = async (): Promise<Scores> => {
    const ss: Scores = await readAllData<Score>(
        env.SCORE_COLLECTION,
        ['name', 'stats'],
        cashedScores
    );
    return ss;
}

const readScoreByUserName = async (name: string): Promise<Score> => {
    const s: Score = await readDataByName<Score>(
        env.SCORE_COLLECTION,
        name,
        ['name', 'stats'],
        cashedScores
    );
    return s;
}

export { readScores, readScoreByUserName };