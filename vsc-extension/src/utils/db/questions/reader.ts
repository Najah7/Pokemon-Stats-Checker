import { Question, Questions } from '../../../types/question';
import { readAllData, readDataById, readDataByName } from '../common/reader';

import * as env from '../config';

let cashedQuestions: Questions = new Map<number, Question>();

const activeQuestionsCache = async (): Promise<void> => {
    cashedQuestions = await readQuestions();
}

const readQuestions = async (): Promise<Questions> => {
    const qs: Questions = await readAllData<Question>(
        env.QUESTION_COLLECTION,
        ['id', 'question', 'answer'],
        cashedQuestions
    );
    return qs;
}

const readQuestionById = async (id: number): Promise<Question> => {
    const q: Question = await readDataById<Question>(
        env.QUESTION_COLLECTION,
        id,
        ['id', 'question', 'answer'],
        cashedQuestions
    );
    return q;
}

export {
    activeQuestionsCache,
    readQuestions,
    readQuestionById
};