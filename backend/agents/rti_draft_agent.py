def generate_rti_draft(missing):

    questions = []

    for item in missing:

        if item == "completion":
            questions.append(
                "Provide the completion report."
            )

        elif item == "contractor":
            questions.append(
                "Provide contractor details."
            )

        elif item == "audit":
            questions.append(
                "Provide audit reports."
            )

        elif item == "budget":
            questions.append(
                "Provide budget allocation documents."
            )

        elif item == "tender":
            questions.append(
                "Provide tender documents."
            )

    return {
        "missing": missing,
        "questions": questions
    }