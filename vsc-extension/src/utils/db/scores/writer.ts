import { Score } from '../../../types/score';
import { insertData, updateData, deleteData } from '../common/writer';
import * as env from '../config';

const insertScore = async (score: Score): Promise<void> => {
    await insertData<Score>(
        env.SCORE_COLLECTION,
        score,
    );
}

const updateScore = async (score: Score): Promise<void> => {
    await updateData<Score>(
        env.SCORE_COLLECTION,
        score,
    );
}

const deleteScore = async (name: string): Promise<void> => {
    await deleteData(
        env.SCORE_COLLECTION,
        { name: name }
    );
}

export { insertScore, updateScore, deleteScore };