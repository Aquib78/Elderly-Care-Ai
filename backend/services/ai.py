import easyocr

reader = easyocr.Reader(['en'])

def simplify_medical_text(image_bytes):
    import numpy as np
    import cv2

    # Convert bytes → image
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # OCR
    result = reader.readtext(img, detail=0)

    extracted_text = "\n".join(result)

    # SIMPLE RULE-BASED AI (for now)
    simplified = "🩺 Summary:\n\n"

    for line in result:
        if "low" in line.lower():
            simplified += f"⚠️ {line} → This is lower than normal\n"
        elif "high" in line.lower():
            simplified += f"⚠️ {line} → This is higher than normal\n"
        else:
            simplified += f"✅ {line} → Looks normal\n"

    return extracted_text, simplified