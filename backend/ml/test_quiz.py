from ml.utils.text_cleaner import clean_text
from ml.train.quiz_gen import chunk_text, generate_quiz

# Use an inline sample lesson text instead of a local PDF
raw_text = (
    "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods "
    "from carbon dioxide and water. Photosynthesis in plants generally involves the green pigment chlorophyll and "
    "generates oxygen as a byproduct."
)
print("RAW TEXT:", raw_text[:500])

# Clean the text
cleaned_text = clean_text(raw_text)
print("CLEANED TEXT:", cleaned_text[:500])

# Chunk the text
chunks = chunk_text(cleaned_text, max_words=30)
print("First chunk:", chunks[0])
print("Total chunks:", len(chunks))

# Generate quiz
quiz = []
for c in chunks:
    quiz.extend(generate_quiz(c))

print("Sample quiz (first 5 questions):", quiz[:5])
