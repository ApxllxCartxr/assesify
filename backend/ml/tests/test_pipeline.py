import sys
import os
import pandas as pd

sys.path.insert(0, r"c:/Users/Home/Desktop/backend/assesify/backend")

from ml.pipeline import load_data, preprocess, aggregate_features, recommend_next_topic


def test_pipeline_end_to_end():
    csv_path = os.path.join(os.path.dirname(__file__), "..", "data", "sample_attempts.csv")
    df = load_data(csv_path)
    assert not df.empty

    dfp = preprocess(df)
    assert "accuracy" in dfp.columns

    agg = aggregate_features(dfp)
    assert "accuracy_mean" in agg.columns

    rec = recommend_next_topic("s1", agg, top_n=2)
    assert isinstance(rec, dict)
    assert "recommendations" in rec
