from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
from .talent_analyzer import full_analysis, QUESTIONS, TALENTS

app = FastAPI(
    title="Karta Talantov — ML API",
    description="Talent scoring and career recommendation engine",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Schemas ───────────────────────────────────────────────────────────────────
class AnalyzeRequest(BaseModel):
    answers: dict[str, int] = Field(
        ...,
        example={"q1": 1, "q2": 3, "q3": 1, "q4": 2, "q5": 2,
                 "q6": 2, "q7": 0, "q8": 1, "q9": 2, "q10": 1}
    )
    lang: Optional[str] = Field("en", pattern="^(uz|ru|en)$")


class CareerResult(BaseModel):
    id:            str
    name:          str
    icon:          str
    match_percent: float


class AnalyzeResponse(BaseModel):
    scores:      dict[str, float]
    top_talents: list[str]
    careers:     list[CareerResult]
    strengths:   list[str]
    lang:        str


class QuestionOption(BaseModel):
    uz: list[str]
    ru: list[str]
    en: list[str]

class QuestionOut(BaseModel):
    id:      str
    talent:  str
    question: dict
    options:  dict


# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "service": "karta-talantov-ml", "talents": TALENTS}


@app.get("/questions", response_model=list[QuestionOut])
def get_questions():
    """Return all quiz questions (all 3 languages)."""
    return [
        QuestionOut(
            id=q["id"],
            talent=q["talent"],
            question=q["question"],
            options=q["options"],
        )
        for q in QUESTIONS
    ]


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(body: AnalyzeRequest):
    """
    Analyze quiz answers and return talent scores + career recommendations.

    - Computes weighted talent scores per dimension (0–100)
    - Ranks careers by dot-product similarity with talent vector
    - Returns top strengths in the requested language
    """
    if not body.answers:
        raise HTTPException(status_code=400, detail="answers cannot be empty")

    valid_ids = {q["id"] for q in QUESTIONS}
    for qid in body.answers:
        if qid not in valid_ids:
            raise HTTPException(status_code=400, detail=f"Unknown question id: {qid}")

    try:
        result = full_analysis(body.answers, lang=body.lang)
        return AnalyzeResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/talents")
def get_talents():
    """Return all talent dimension names."""
    return {"talents": TALENTS}
