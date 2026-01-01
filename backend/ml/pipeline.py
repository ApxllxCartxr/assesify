"""ML pipeline for Personalized Learning Platform.

Modules:
- load_data: read quiz attempts CSV
- preprocess: handle missing values, encode categoricals, make numeric features
- aggregate_features: per-student/per-topic aggregations (accuracy, avg_time, difficulty success ratios)
- model training: clustering and per-topic classifier for mastery
- inference: predict mastery and recommend topics/difficulty

Notes:
- Uses pandas / numpy / scikit-learn. Install them locally to run.
"""
from __future__ import annotations

import math
from typing import Tuple, Dict, Any
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from dataclasses import dataclass


@dataclass
class TrainedModels:
    clusterer: Any
    topic_classifier: Any
    encoders: Dict[str, Any]


def load_data(csv_path: str) -> pd.DataFrame:
    """Load quiz attempts CSV into DataFrame."""
    df = pd.read_csv(csv_path, parse_dates=["attempt_date"])
    return df


def preprocess(df: pd.DataFrame) -> pd.DataFrame:
    """Preprocess raw attempt logs.

    Steps:
    - Fill missing values
    - Ensure types
    - Create accuracy and avg_time_per_question
    - Map difficulty to ordinal value for convenience
    """
    df = df.copy()

    # Fill basic NA
    df["correct_answers"] = df["correct_answers"].fillna(0).astype(int)
    df["total_questions"] = df["total_questions"].fillna(1).astype(int)
    df["time_taken_seconds"] = df["time_taken_seconds"].fillna(df["time_taken_seconds"].median())

    # Derived features
    df["accuracy"] = df["correct_answers"] / df["total_questions"]
    # Avoid divide-by-zero
    df["avg_time_per_question"] = df.apply(
        lambda r: r["time_taken_seconds"] / r["total_questions"] if r["total_questions"] > 0 else np.nan, axis=1
    )

    # Map difficulty to ordinal
    diff_map = {"easy": 0, "medium": 1, "hard": 2}
    df["difficulty_ord"] = df["difficulty"].map(diff_map).fillna(1).astype(int)

    return df


def aggregate_features(df: pd.DataFrame) -> pd.DataFrame:
    """Aggregate features per student and topic to create training examples.

    Returns a DataFrame with rows per (student_id, topic) and features:
    - accuracy_mean
    - accuracy_std
    - avg_time_mean
    - attempts_count
    - improvement_slope (simple trend measure)
    - success_ratio_easy/medium/hard
    """
    df = df.copy()

    # Sort by date for trend calculations
    df = df.sort_values("attempt_date")

    groups = []
    for (sid, topic), g in df.groupby(["student_id", "topic"]):
        accuracy_mean = g["accuracy"].mean()
        accuracy_std = g["accuracy"].std(ddof=0) if len(g) > 1 else 0.0
        avg_time_mean = g["avg_time_per_question"].mean()
        attempts_count = len(g)

        # improvement_slope: simple linear trend on accuracy over time (seconds)
        if len(g) >= 2:
            # Convert dates to ordinal numbers
            x = (g["attempt_date"]).apply(lambda d: d.timestamp()).values
            y = g["accuracy"].values
            # Fit slope = cov(x,y)/var(x)
            cov = np.cov(x, y, bias=True)[0, 1]
            varx = np.var(x)
            slope = cov / varx if varx != 0 else 0.0
        else:
            slope = 0.0

        # difficulty success ratios
        success_easy = g[g["difficulty"] == "easy"]["accuracy"].mean() if not g[g["difficulty"] == "easy"].empty else np.nan
        success_medium = g[g["difficulty"] == "medium"]["accuracy"].mean() if not g[g["difficulty"] == "medium"].empty else np.nan
        success_hard = g[g["difficulty"] == "hard"]["accuracy"].mean() if not g[g["difficulty"] == "hard"].empty else np.nan

        groups.append({
            "student_id": sid,
            "topic": topic,
            "accuracy_mean": accuracy_mean,
            "accuracy_std": accuracy_std,
            "avg_time_mean": avg_time_mean,
            "attempts_count": attempts_count,
            "improvement_slope": slope,
            "success_easy": success_easy,
            "success_medium": success_medium,
            "success_hard": success_hard,
        })

    out = pd.DataFrame(groups)

    # Fill NaNs for success ratios with 0.0 to be conservative
    out[["success_easy", "success_medium", "success_hard"]] = out[
        ["success_easy", "success_medium", "success_hard"]
    ].fillna(0.0)

    return out


def cluster_students(features_df: pd.DataFrame, n_clusters: int = 3) -> Tuple[KMeans, pd.DataFrame]:
    """Cluster students by aggregated features to find natural groups (e.g., beginner/intermediate/advanced).

    Returns the fitted KMeans and the DataFrame with cluster labels attached.
    """
    X = features_df[["accuracy_mean", "avg_time_mean", "improvement_slope"]].fillna(0.0).values
    km = KMeans(n_clusters=n_clusters, random_state=0)
    labels = km.fit_predict(X)
    features_df = features_df.copy()
    features_df["cluster"] = labels
    return km, features_df


def train_topic_classifier(features_df: pd.DataFrame) -> TrainedModels:
    """Train a simple classifier that predicts 'mastery level' for topic using RandomForest.

    We derive a target label using thresholds on accuracy_mean:
    - accuracy < 0.5 -> Beginner
    - 0.5 <= accuracy < 0.8 -> Intermediate
    - >= 0.8 -> Advanced

    This function returns TrainedModels containing a trained RandomForest and any encoders used.
    """
    df = features_df.copy()

    def label_from_accuracy(a: float) -> str:
        if a < 0.5:
            return "Beginner"
        if a < 0.8:
            return "Intermediate"
        return "Advanced"

    df["label"] = df["accuracy_mean"].apply(label_from_accuracy)

    # Features for the classifier
    feat_cols = ["accuracy_mean", "avg_time_mean", "attempts_count", "improvement_slope", "success_easy", "success_medium", "success_hard"]
    X = df[feat_cols].fillna(0.0)
    y = df["label"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, random_state=0)
    clf = RandomForestClassifier(n_estimators=200, random_state=0)
    clf.fit(X_train, y_train)

    preds = clf.predict(X_test)
    print("Classifier report:\n", classification_report(y_test, preds))

    models = TrainedModels(clusterer=None, topic_classifier=clf, encoders={})
    return models


def predict_mastery(models: TrainedModels, agg_df: pd.DataFrame) -> pd.DataFrame:
    """Predict mastery labels for each (student, topic) row in agg_df."""
    df = agg_df.copy()
    feat_cols = ["accuracy_mean", "avg_time_mean", "attempts_count", "improvement_slope", "success_easy", "success_medium", "success_hard"]
    df[feat_cols] = df[feat_cols].fillna(0.0)
    preds = models.topic_classifier.predict(df[feat_cols])
    df["predicted_mastery"] = preds
    return df


def recommend_next_topic(student_id: str, agg_df: pd.DataFrame, top_n: int = 3) -> Dict[str, Any]:
    """Recommend topics that need more practice for the student (ranked by weakness).

    Strategy:
    - For the student, find topics with lowest accuracy_mean and label Beginner/Intermediate/Advanced
    - Recommend the bottom `top_n` topics for practice
    - Suggest difficulty: if current accuracy < 0.4 -> easy, 0.4-0.7 -> medium, else hard
    """
    s = agg_df[agg_df["student_id"] == student_id]
    if s.empty:
        return {"recommendations": [], "reason": "no_data"}

    s = s.sort_values("accuracy_mean")
    recs = []
    for _, row in s.head(top_n).iterrows():
        acc = row["accuracy_mean"]
        if acc < 0.4:
            diff = "easy"
        elif acc < 0.7:
            diff = "medium"
        else:
            diff = "hard"
        recs.append({"topic": row["topic"], "accuracy": float(acc), "recommended_difficulty": diff})

    return {"recommendations": recs, "student_id": student_id}


if __name__ == "__main__":
    # Simple demo flow
    print("Loading sample data and building features...")
    df = load_data("data/sample_attempts.csv")
    df = preprocess(df)
    agg = aggregate_features(df)
    km, clustered = cluster_students(agg)
    models = train_topic_classifier(clustered)
    preds = predict_mastery(models, agg)
    print(preds.head())
    print(recommend_next_topic("s1", preds))
