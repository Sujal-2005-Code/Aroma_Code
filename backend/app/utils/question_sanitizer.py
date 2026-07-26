def sanitize_question(question: dict):
    """
    Remove all sensitive information before sending
    questions to students.
    """

    question = dict(question)

    # Convert Mongo ObjectId to string
    if "_id" in question:
        question["_id"] = str(question["_id"])

    # Remove MCQ answer
    question.pop("correct_answer", None)

    # Remove MSQ answers
    question.pop("correct_answers", None)

    # Remove hidden coding testcases
    question.pop("hidden_test_cases", None)

    return question