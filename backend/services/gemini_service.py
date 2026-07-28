import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel("gemini-2.5-flash")


def extract_claim_info(claim: str):

    prompt = f"""
    Analyze this claim and return:

    1. Claim Summary
    2. Important Keywords
    3. Entities Mentioned

    Claim:
    {claim}

    Return in clean text format.
    """
    try:
        response = model.generate_content(prompt)

        return response.text
    except Exception as e:
        return f"Gemini Error: {str(e)}"