"""Create an adaptive learning path per student.

Rules:
- For each weak topic (low accuracy), recommend sequence: Revision -> Practice -> Assessment -> Advancement
- Adjust number of practice items according to how weak the student is
- Keep variations so two students get different sequences if needed
"""
from typing import List, Dict


def generate_learning_path(recommendation: Dict, pace: str = "normal") -> List[Dict]:
    """Generate a sequence of learning steps for a student recommendation.

    recommendation: {"recommendations": [{topic, accuracy, recommended_difficulty}], ...}
    pace: "slow" | "normal" | "fast" — controls how many practice blocks
    """
    pace_map = {"slow": 3, "normal": 2, "fast": 1}
    repeats = pace_map.get(pace, 2)

    path = []
    for rec in recommendation.get("recommendations", []):
        topic = rec["topic"]
        accuracy = rec["accuracy"]
        difficulty = rec["recommended_difficulty"]

        # number of practice blocks scales with weakness
        practice_blocks = max(1, int((1 - accuracy) * 5) * repeats)

        # Ensure uniqueness across students by varying steps with topic name hash
        seed = abs(hash(topic)) % 3

        sequence = []
        sequence.append({"step": "revision", "topic": topic, "details": f"Read textbook / notes for {topic}", "difficulty": "easy"})
        for i in range(practice_blocks):
            sequence.append({"step": "practice", "topic": topic, "details": f"Practice set {i+1}", "difficulty": difficulty if i >= seed else "easy"})
        sequence.append({"step": "assessment", "topic": topic, "details": "Short quiz to test mastery", "difficulty": difficulty})
        sequence.append({"step": "advance_or_repeat", "topic": topic, "details": "If assessment good -> advance, else repeat practice", "difficulty": difficulty})

        path.append({"topic": topic, "sequence": sequence})

    return path


if __name__ == "__main__":
    example = {"recommendations": [{"topic": "algebra", "accuracy": 0.45, "recommended_difficulty": "easy"}]}
    print(generate_learning_path(example, pace="normal"))
