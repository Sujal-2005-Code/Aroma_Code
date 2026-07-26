from typing import Any

from pydantic import BaseModel


class AutoSaveRequest(BaseModel):

    assessment_id: str

    question_id: str

    # An assessment response can be an option, multiple options, or a coding
    # submission. Keeping this JSON-compatible prevents autosave from losing
    # MSQ and coding answers.
    answer: Any
