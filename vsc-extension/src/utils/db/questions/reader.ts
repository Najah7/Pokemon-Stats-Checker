import { Question, Questions } from '../../../types/question';
import { readAllData, readDataById, readDataByName } from '../common/reader';

import * as env from '../config';

let cashedQuestions: Questions = new Array<Question>();

const activeQuestionsCache = async (): Promise<void> => {
    cashedQuestions = await readQuestions();
}

const readQuestions = async (): Promise<Questions> => {
    const data = await readAllData<Question>(
        env.QUESTION_COLLECTION,
        ['text', 'answer'],
        cashedQuestions
    );
    if (data instanceof Array) {
        return data;
    }
    return [];
}

export {
    activeQuestionsCache,
    readQuestions,
};