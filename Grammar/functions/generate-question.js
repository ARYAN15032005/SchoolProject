exports.handler = async (event) => {
    const { category } = JSON.parse(event.body);

    const prompt = `Create a ${category} fill-in-the-blank question with:
    - A funny/playful sentence
    - 4 multiple choice options
    - Clear explanation
    Format as JSON: {
        "question": "The monkey ___ danced on the pizza!",
        "options": ["joyful", "joyfully", "joy", "joying"],
        "correct": "joyfully",
        "explanation": "'Joyfully' is the adverb form needed here 😄"
    }`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7
            })
        });

        const data = await response.json();
        const questionData = JSON.parse(data.choices[0].message.content);

        return {
            statusCode: 200,
            body: JSON.stringify(questionData)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to generate question" })
        };
    }
};