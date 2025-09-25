from utils.database import get_last_mood

def analyze_mood(username: str, mood: str, notes: str | None = None) -> dict:
    mood = mood.lower().strip()
    notes_text = notes.lower().strip() if notes else ""

    # --- Mood Categorization ---
    positive_moods = ["happy", "calm", "good", "neutral"]
    negative_moods = ["sad", "stressed", "angry", "down", "anxious"]

    # --- Notes Analysis Keywords ---
    positive_keywords = ["good", "great", "happy", "well", "amazing", "fantastic", "awesome", "up"]
    negative_keywords = ["sad", "stressed", "tired", "angry", "bad", "down", "anxious", "not good", "lost"]

    is_positive = mood in positive_moods or any(keyword in notes_text for keyword in positive_keywords)
    is_negative = mood in negative_moods or any(keyword in notes_text for keyword in negative_keywords)

    # --- Comparative Analysis ---
    last_mood_entry = get_last_mood(username)
    comparative_message = ""
    if last_mood_entry:
        last_mood_lower = last_mood_entry.lower()
        if mood in positive_moods and last_mood_lower in negative_moods:
            comparative_message = "It's great to see you're feeling better than your last check-in."
        elif mood in negative_moods and last_mood_lower in positive_moods:
            comparative_message = "It seems you're feeling a bit down compared to last time. Remember that feelings come and go."

    # --- Response Generation ---
    message = "Thanks for checking in. Tracking your mood is a great step for your well-being."
    suggestions = []

    if is_positive:
        message = "Glad you’re feeling well today! Keep it up 💪"
    elif is_negative:
        message = "We've noticed you're feeling down, and it's okay to not be okay."
        suggestions = [
            {"type": "chatbot", "text": "Would you like to talk about what's on your mind with our friendly chatbot?"},
            {"type": "support", "text": "For immediate support, you can call the National Suicide Prevention Lifeline at 988."},
            {"type": "social", "text": "Connecting with a friend or family member can also make a big difference."}
        ]

    return {
        "message": message,
        "comparative_message": comparative_message,
        "suggestions": suggestions
    }