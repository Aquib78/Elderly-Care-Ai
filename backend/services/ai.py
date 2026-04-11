import easyocr

reader = easyocr.Reader(['en'])

def simplify_medical_text(image_bytes):
    import numpy as np
    import cv2

    # =========================
    # OCR
    # =========================
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    result = reader.readtext(img, detail=0)
    extracted_text = "\n".join(result)

    # =========================
    # SMART ANALYSIS
    # =========================
    findings = []
    abnormal = []

    for line in result:
        lower = line.lower()

        # Detect abnormal indicators
        if any(word in lower for word in ["low", "decreased", "deficient"]):
            abnormal.append(f"{line} (Below normal range)")
        elif any(word in lower for word in ["high", "elevated", "increased"]):
            abnormal.append(f"{line} (Above normal range)")
        else:
            findings.append(line)

    # =========================
    # STRUCTURED OUTPUT
    # =========================
    summary = "The uploaded medical report has been analyzed."

    if abnormal:
        summary += " Some values appear outside the normal range and may require attention."
    else:
        summary += " Most values appear within normal limits."

    simplified = f"""
Summary:
{summary}

Key Findings:
{chr(10).join(["- " + f for f in findings[:5]])}

Abnormal Indicators:
{chr(10).join(["- " + a for a in abnormal]) if abnormal else "- No major abnormalities detected"}

Explanation:
This report has been interpreted using pattern-based analysis. Values marked as high or low may indicate underlying health conditions depending on clinical context.

Conclusion:
{"Further medical consultation is recommended." if abnormal else "No immediate concerns based on extracted data."}
"""

    return extracted_text, simplified.strip()