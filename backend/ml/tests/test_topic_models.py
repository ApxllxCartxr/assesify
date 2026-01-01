import sys
import os

sys.path.insert(0, r"c:/Users/Home/Desktop/backend/assesify/backend")

from ml.pipeline import load_data, preprocess, aggregate_features
from ml.topic_models import train_per_topic_models, load_topic_model


def test_train_per_topic_models(tmp_path):
    csv = os.path.join(os.path.dirname(__file__), '..', 'data', 'sample_attempts.csv')
    df = load_data(csv)
    df = preprocess(df)
    agg = aggregate_features(df)
    saved = train_per_topic_models(agg, min_samples=1)
    assert isinstance(saved, dict)
    for topic, path in saved.items():
        assert os.path.exists(path)
        model = load_topic_model(topic)
        assert model is not None
