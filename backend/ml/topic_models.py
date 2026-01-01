"""Train and manage per-topic models for predicting mastery.

This module trains a RandomForest per topic using features produced by `pipeline.aggregate_features`.
Models are saved to `ml/models/<topic>.joblib` for quick loading at inference.
"""
from __future__ import annotations

import os
from typing import Dict
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier


MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(MODEL_DIR, exist_ok=True)


def train_per_topic_models(agg_df, min_samples=2) -> Dict[str, str]:
    """Train a model per topic and return dict mapping topic -> saved_path.

    Only trains when enough samples exist for that topic.
    """
    saved = {}
    for topic, g in agg_df.groupby("topic"):
        if len(g) < min_samples:
            continue
        X = g[["accuracy_mean", "avg_time_mean", "attempts_count", "improvement_slope", "success_easy", "success_medium", "success_hard"]].fillna(0.0)
        y = (g["accuracy_mean"] >= 0.8).astype(int)  # binary mastery label
        clf = RandomForestClassifier(n_estimators=100, random_state=0)
        clf.fit(X, y)
        path = os.path.join(MODEL_DIR, f"{topic}.joblib")
        joblib.dump(clf, path)
        saved[topic] = path
    return saved


def load_topic_model(topic: str):
    path = os.path.join(MODEL_DIR, f"{topic}.joblib")
    if not os.path.exists(path):
        raise FileNotFoundError(path)
    return joblib.load(path)


def predict_topic_mastery(topic: str, features_row) -> float:
    model = load_topic_model(topic)
    X = np.array([[
        features_row.get("accuracy_mean", 0.0),
        features_row.get("avg_time_mean", 0.0),
        features_row.get("attempts_count", 0.0),
        features_row.get("improvement_slope", 0.0),
        features_row.get("success_easy", 0.0),
        features_row.get("success_medium", 0.0),
        features_row.get("success_hard", 0.0),
    ]])
    prob = model.predict_proba(X)
    return float(prob[0, 1])
