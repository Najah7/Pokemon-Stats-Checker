import { Score } from '../../../types/score';
import { readAllData, readDataByName } from '../common/reader';

import * as env from '../config';

let cashedScores: Score[] = new Array<Score>();

const readScoreByUserName = async (name: string): Promise<Score> => {

    const s: Score = await readDataByName<Score>(
        env.SCORE_COLLECTION,
        name,
        ['name', 'baseStats'],
        cashedScores
    );
    return s;
}

export { cashedScores, readScoreByUserName };