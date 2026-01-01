# ML module — pipeline & Gemini integration

This `ml/` folder contains code to:
- Preprocess and aggregate quiz attempt data
- Train simple ML models to classify student mastery per topic
- Recommend next topics and create personalized learning paths
- Build prompts for Gemini to generate quizzes for chosen topic/difficulty

Quick ML pipeline explanation

1. Data ingestion: read quiz attempts logs from CSV (columns: student_id, topic, difficulty, total_questions, correct_answers, time_taken_seconds, attempt_date).
2. Preprocessing: fill missing values, compute accuracy and avg time per question, map difficulty to ordinal values.
3. Aggregation: group by (student_id, topic) to compute accuracy_mean, avg_time_mean, improvement_slope (trend), and difficulty-specific success ratios.
4. Modeling: cluster students (KMeans) and train a RandomForest classifier to predict mastery labels (Beginner/Intermediate/Advanced derived from accuracy thresholds).
5. Inference & recommendations: predict mastery per topic and produce topic/difficulty recommendations and learning paths.

Files added
- `data/sample_attempts.csv` — small sample dataset
- `pipeline.py` — core pipeline: load, preprocess, aggregate, clustering, classifier, recommend_next_topic
- `personalized_path.py` — algorithm to generate adaptive learning sequences
- `gemini_prompt.py` — helper to build Gemini prompts (structured JSON requests)
- `tests/test_pipeline.py` — basic end-to-end unit test using the sample data

Running locally (developer quick start)

1. Ensure you have Python packages installed: pandas, numpy, scikit-learn (install in your venv).
2. Run the pipeline demo:

   python -c "import sys; sys.path.insert(0, 'c:/Users/Home/Desktop/backend/assesify/backend'); from ml.pipeline import load_data, preprocess, aggregate_features; df=load_data('ml/data/sample_attempts.csv'); df=preprocess(df); agg=aggregate_features(df); print(agg.head())"

3. Run tests (if pytest installed):

   pytest backend/ml/tests -q

Gemini prompt example

Use `ml/gemini_prompt.build_quiz_prompt(topic, difficulty, n_questions)` to get a clean prompt text that instructs Gemini to return valid JSON like:

```json
{"quiz": [{"question": "...", "choices": ["...","...","...","..."], "answer": "...", "difficulty": "medium"}, ...]}
```

Example prompt (summary):

"You are a helpful quiz writer. Return ONLY valid JSON. Create a quiz for the specified topic and difficulty... Topic: algebra, Difficulty: medium, Number of questions: 5"

Notes & Next steps
- The model training here is intentionally simple and modular to be extended.
- You can replace the RandomForest with a more complex model or add per-topic models for better performance.
- For production, move heavy processing to a background worker and store results in the DB.
