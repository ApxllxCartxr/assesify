# text_cleaner.py
import re

def clean_text(text: str) -> str:
    """
    Clean text by removing extra spaces, newlines, and fixing special characters.
    """
    # Replace multiple spaces/newlines with single space
    text = re.sub(r'\s+', ' ', text)
    # Fix common PDF character issues
    text = text.replace("ﬁ", "fi").replace("ﬂ", "fl")
    return text.strip()
