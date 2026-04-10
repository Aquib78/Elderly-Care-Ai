import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def simplify_medical_text(raw_text: str):
    prompt = f"""
You are a senior doctor explaining a medical report to an elderly patient.

DO NOT repeat medical terms unnecessarily.
DO NOT copy the report.

Instead:
- Explain what is wrong in simple language
- Explain what it means for the person
- Suggest what they should do next

Use bullet points.

Make it VERY EASY to understand.

Medical Report:
{raw_text}
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    print("[DEBUG] Inside simplify_medical_text()")
    print("🚀 GPT RESPONSE:", response)

    return response.choices[0].message.content