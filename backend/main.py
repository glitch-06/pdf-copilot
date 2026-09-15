import os
import re
import uuid
from io import BytesIO
from collections import Counter

from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from pypdf import PdfReader
from google import genai
from google.genai import errors


load_dotenv()

app = FastAPI()


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# Gemini
# =========================================================

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError(
        "GEMINI_API_KEY is missing from backend/.env"
    )

client = genai.Client(
    api_key=api_key
)

MODEL = "gemini-3.5-flash-lite"


# =========================================================
# In-memory document storage
# =========================================================

documents: dict[str, dict] = {}


# =========================================================
# Request models
# =========================================================

class ChatRequest(BaseModel):
    question: str
    selected_content: str | None = None
    content_type: str | None = None
    page: int | None = None
    document_id: str | None = None


class ExplainRequest(BaseModel):
    content: str
    kind: str
    page: int
    instruction: str


class SummarizeRequest(BaseModel):
    document_id: str


# =========================================================
# Text utilities
# =========================================================

STOP_WORDS = {
    "the",
    "and",
    "for",
    "that",
    "this",
    "with",
    "from",
    "what",
    "when",
    "where",
    "which",
    "about",
    "into",
    "there",
    "their",
    "have",
    "has",
    "does",
    "did",
    "are",
    "was",
    "were",
    "how",
    "why",
    "who",
    "can",
    "could",
    "would",
    "should",
    "your",
    "you",
    "its",
    "it's",
    "our",
    "they",
    "them",
    "then",
    "than",
    "also",
    "more",
    "some",
    "such",
    "not",
    "but",
    "all",
    "any",
    "one",
    "two",
    "use",
    "used",
    "using",
    "based",
    "paper",
    "document",
}


def tokenize(text: str) -> list[str]:
    words = re.findall(
        r"[a-zA-Z0-9][a-zA-Z0-9_-]*",
        text.lower(),
    )

    return [
        word
        for word in words
        if len(word) > 2
        and word not in STOP_WORDS
    ]


def create_chunks(
    pages: list[dict],
    chunk_size: int = 6000,
    overlap: int = 800,
) -> list[dict]:
    chunks = []

    for page_data in pages:
        page_number = page_data["page"]
        text = page_data["text"]

        if not text:
            continue

        start = 0

        while start < len(text):
            end = min(
                start + chunk_size,
                len(text),
            )

            chunk_text = text[
                start:end
            ].strip()

            if chunk_text:
                chunks.append(
                    {
                        "id": len(chunks),
                        "page": page_number,
                        "text": chunk_text,
                        "tokens": tokenize(
                            chunk_text
                        ),
                    }
                )

            if end >= len(text):
                break

            start = max(
                end - overlap,
                start + 1,
            )

    return chunks


def score_chunk(
    question_tokens: list[str],
    chunk: dict,
) -> float:
    if not question_tokens:
        return 0

    counts = Counter(
        chunk["tokens"]
    )

    score = 0.0

    for token in question_tokens:
        frequency = counts.get(
            token,
            0,
        )

        if frequency:
            score += 1 + min(
                frequency,
                3,
            ) * 0.25

    # Slightly reward chunks containing
    # multiple distinct question terms.
    unique_matches = sum(
        1
        for token in set(question_tokens)
        if token in counts
    )

    score += (
        unique_matches * 0.75
    )

    return score


def retrieve_chunks(
    document: dict,
    question: str,
    max_chunks: int = 8,
) -> list[dict]:
    chunks = document.get(
        "chunks",
        [],
    )

    if not chunks:
        return []

    question_tokens = tokenize(
        question
    )

    scored = [
        (
            score_chunk(
                question_tokens,
                chunk,
            ),
            chunk,
        )
        for chunk in chunks
    ]

    scored.sort(
        key=lambda item: item[0],
        reverse=True,
    )

    selected = [
        chunk
        for score, chunk in scored
        if score > 0
    ][:max_chunks]

    # If keyword retrieval finds nothing,
    # use the beginning of the document.
    # This is especially useful for broad
    # questions such as "What is the main idea?"
    if not selected:
        selected = chunks[:max_chunks]

    return selected


def build_context(
    chunks: list[dict],
) -> str:
    if not chunks:
        return "No relevant document text was found."

    parts = []

    for chunk in chunks:
        parts.append(
            f"--- Page {chunk['page']} ---\n"
            f"{chunk['text']}"
        )

    return "\n\n".join(parts)


# =========================================================
# Gemini helper
# =========================================================

def generate_with_gemini(
    prompt: str,
):
    try:
        return client.models.generate_content(
            model=MODEL,
            contents=prompt,
        )

    except errors.ClientError as error:

        if getattr(error, "code", None) == 429:
            return JSONResponse(
                status_code=429,
                content={
                    "error": "Gemini API quota exceeded.",
                    "message": (
                        "The Gemini free-tier request quota "
                        "has been reached. Please try again "
                        "later or check your Gemini API quota."
                    ),
                },
            )

        return JSONResponse(
            status_code=500,
            content={
                "error": "Gemini API error.",
                "message": str(error),
            },
        )

    except Exception as error:
        return JSONResponse(
            status_code=500,
            content={
                "error": "Unexpected Gemini error.",
                "message": str(error),
            },
        )


# =========================================================
# Health check
# =========================================================

@app.get("/")
def home():
    return {
        "message": "PDF Copilot backend is working!"
    }


# =========================================================
# Gemini test
# =========================================================

@app.get("/test-gemini")
def test_gemini():

    result = generate_with_gemini(
        "Say hello in one short sentence."
    )

    if isinstance(
        result,
        JSONResponse,
    ):
        return result

    return {
        "response": result.text
    }


# =========================================================
# Upload PDF
# =========================================================

@app.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...),
):
    if file.content_type != "application/pdf":
        return JSONResponse(
            status_code=400,
            content={
                "error": "Invalid file type.",
                "message": "Please upload a PDF file.",
            },
        )

    try:
        file_bytes = await file.read()

        if not file_bytes:
            return JSONResponse(
                status_code=400,
                content={
                    "error": "Empty PDF.",
                    "message": "The uploaded PDF is empty.",
                },
            )

        reader = PdfReader(
            BytesIO(file_bytes)
        )

        pages = []

        for page_number, page in enumerate(
            reader.pages,
            start=1,
        ):
            try:
                text = (
                    page.extract_text()
                    or ""
                )
            except Exception as error:
                print(
                    f"Failed to extract text from page {page_number}:",
                    error,
                )
                text = ""

            pages.append(
                {
                    "page": page_number,
                    "text": text.strip(),
                }
            )

        chunks = create_chunks(
            pages
        )

        full_text = "\n\n".join(
            (
                f"--- Page {item['page']} ---\n"
                f"{item['text']}"
            )
            for item in pages
            if item["text"]
        )

        document_id = str(
            uuid.uuid4()
        )

        documents[document_id] = {
            "id": document_id,
            "filename": (
                file.filename
                or "document.pdf"
            ),
            "page_count": len(
                reader.pages
            ),
            "pages": pages,
            "text": full_text,
            "chunks": chunks,
        }

        print(
            f"Uploaded PDF: {file.filename}"
        )

        print(
            f"Document ID: {document_id}"
        )

        print(
            f"Pages: {len(reader.pages)}"
        )

        print(
            f"Extracted characters: {len(full_text)}"
        )

        print(
            f"Created chunks: {len(chunks)}"
        )

        return {
            "document_id": document_id,
            "filename": (
                file.filename
                or "document.pdf"
            ),
            "page_count": len(
                reader.pages
            ),
            "text_length": len(
                full_text
            ),
            "chunk_count": len(
                chunks
            ),
        }

    except Exception as error:
        print(
            "PDF processing error:",
            repr(error),
        )

        return JSONResponse(
            status_code=500,
            content={
                "error": "PDF processing failed.",
                "message": str(error),
            },
        )


# =========================================================
# Explain selected content
# =========================================================

@app.post("/explain")
def explain(
    request: ExplainRequest,
):
    prompt = f"""
You are PDF Copilot, an AI reading assistant.

The user selected content from a PDF.

SELECTED CONTENT:
{request.content}

CONTENT TYPE:
{request.kind}

PAGE:
{request.page}

USER INSTRUCTION:
{request.instruction}

Explain the selected content accurately
and directly.

Focus specifically on what the user selected.

If it is:
- a paragraph, explain the main idea and reasoning;
- an equation, explain the equation and its variables;
- a definition, explain it clearly;
- a technical concept, explain the intuition and important details.

Use Markdown when helpful.

Do not invent information that is not supported
by the selected content.
"""

    result = generate_with_gemini(
        prompt
    )

    if isinstance(
        result,
        JSONResponse,
    ):
        return result

    return {
        "response": result.text
    }


# =========================================================
# Document-aware chat
# =========================================================

@app.post("/chat")
def chat(
    request: ChatRequest,
):
    document = None

    if request.document_id:
        document = documents.get(
            request.document_id
        )

        if not document:
            return JSONResponse(
                status_code=404,
                content={
                    "error": "Document not found.",
                    "message": (
                        "The uploaded document "
                        "could not be found."
                    ),
                },
            )

    # -----------------------------------------------------
    # Selection + document context
    # -----------------------------------------------------

    if request.selected_content:

        document_context = ""

        if document:
            relevant_chunks = retrieve_chunks(
                document,
                request.question,
                max_chunks=6,
            )

            document_context = (
                build_context(
                    relevant_chunks
                )
            )

        prompt = f"""
You are PDF Copilot, an AI assistant
inside a PDF reader.

The user selected this content:

=========================
SELECTED CONTENT
=========================

{request.selected_content}

=========================
CONTENT TYPE
=========================

{request.content_type or "text"}

=========================
PAGE
=========================

{request.page or "unknown"}

=========================
RELEVANT DOCUMENT CONTEXT
=========================

{document_context or "Not available."}

=========================
USER QUESTION
=========================

{request.question}

=========================

Answer the user's question specifically
in the context of the selected content.

Use the relevant document context when
it helps answer the question.

Do not invent information.

Use Markdown where useful.
"""

    # -----------------------------------------------------
    # Document-only chat
    # -----------------------------------------------------

    elif document:

        relevant_chunks = retrieve_chunks(
            document,
            request.question,
            max_chunks=8,
        )

        document_context = build_context(
            relevant_chunks
        )

        prompt = f"""
You are PDF Copilot, an AI assistant
for understanding PDF documents.

The user asked:

=========================
USER QUESTION
=========================

{request.question}

=========================
RELEVANT PDF CONTENT
=========================

{document_context}

=========================

Answer the question using the PDF
content as your primary source.

The document may contain many pages.
The provided context contains the sections
most relevant to the user's question.

If the answer is not supported by the
provided PDF context, say so clearly.

Do not invent facts.

Use Markdown where useful.

Be clear and concise.
"""

    # -----------------------------------------------------
    # No document
    # -----------------------------------------------------

    else:

        prompt = f"""
You are PDF Copilot, an AI assistant.

The user asked:

{request.question}

Answer clearly and concisely.

Use Markdown where useful.
"""

    result = generate_with_gemini(
        prompt
    )

    if isinstance(
        result,
        JSONResponse,
    ):
        return result

    return {
        "response": result.text
    }


# =========================================================
# Document summary
# =========================================================

@app.post("/summarize")
def summarize(
    request: SummarizeRequest,
):
    document = documents.get(
        request.document_id
    )

    if not document:
        return JSONResponse(
            status_code=404,
            content={
                "error": "Document not found.",
                "message": (
                    "The uploaded document "
                    "could not be found."
                ),
            },
        )

    # Retrieve representative chunks instead
    # of sending hundreds of thousands of
    # characters directly to Gemini.
    chunks = document.get(
        "chunks",
        [],
    )

    if not chunks:
        return JSONResponse(
            status_code=400,
            content={
                "error": "No text found.",
                "message": (
                    "No extractable text was found "
                    "in this PDF."
                ),
            },
        )

    # For now, use evenly distributed chunks
    # to represent the entire document.
    max_summary_chunks = 30

    if len(chunks) <= max_summary_chunks:
        selected_chunks = chunks
    else:
        step = (
            len(chunks)
            / max_summary_chunks
        )

        selected_chunks = [
            chunks[
                min(
                    int(i * step),
                    len(chunks) - 1,
                )
            ]
            for i in range(
                max_summary_chunks
            )
        ]

    context = build_context(
        selected_chunks
    )

    prompt = f"""
You are PDF Copilot.

Create a useful summary of this PDF.

=========================
DOCUMENT CONTEXT
=========================

{context}

=========================

The context contains representative
sections from the document.

Include:

## Main idea

## Key points

## Important concepts

## Conclusions

If the document is a research paper,
also identify the problem, approach,
and major findings when supported.

Only use information supported
by the provided document context.

Do not invent details.

Use clear Markdown.
"""

    result = generate_with_gemini(
        prompt
    )

    if isinstance(
        result,
        JSONResponse,
    ):
        return result

    return {
        "response": result.text
    }