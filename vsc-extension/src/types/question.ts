type Question {
    id: number;
    text: string;
    answer: string;
}

type QuestionId = number;

type Questions = Map<QuestionId, Question>;

export { Question, Questions };