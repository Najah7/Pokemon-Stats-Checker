import fs from 'fs';

import { Pokemon } from '../../../types/pokemon';
import * as env from '../config';
import { initDB } from '../common/init';

const QuestionsJson = (db_path: string): Pokemon[] => {
    const data = fs.readFileSync(db_path, 'utf8');
    return JSON.parse(data);
}

if (require.main === module) {
    const questions = QuestionsJson(env.QUESTION_LOCAL_DB);
    initDB(env.QUESTION_COLLECTION, questions);
}