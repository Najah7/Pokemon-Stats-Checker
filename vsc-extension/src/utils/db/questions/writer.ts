// import { Question } from '../../../types/question';
// import { insertData, updateData, deleteData } from '../common/writer';

// import * as env from '../config';

// const insertQuestion = async (question: Question): Promise<void> => {
//     await insertData<Question>(
//         env.QUESTION_COLLECTION,
//         question,
//     );
// }

// const updateQuestion = async (question: Question): Promise<void> => {
//     await updateData<Question>(
//         env.QUESTION_COLLECTION,
//         question,
//     );
// }

// const deleteQuestion = async (questionId: number): Promise<void> => {
//     await deleteData(
//         env.QUESTION_COLLECTION,
//         { id: questionId }
//     );
// }

// export { insertQuestion, updateQuestion, deleteQuestion };