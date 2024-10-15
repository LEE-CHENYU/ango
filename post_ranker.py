import os
import json
from openai import OpenAI
from dotenv import load_dotenv
import sys

class PostRanker:
    def __init__(self):
        load_dotenv()
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        if not self.openai_api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        self.client = OpenAI(api_key=self.openai_api_key)

    def rank_posts(self, user_input, posts):
        system_prompt = """
        You are an expert in ranking and analyzing content relevance. Your task is to rank posts based on their relevance to the user input.
        
        You must provide your response in the following JSON format:
        {
            "ranked_ids": [1, 2, 3, ...],
            "explanation": "A brief explanation of the ranking",
            "success": true/false
        }
        
        The "ranked_ids" should be a list of post IDs in order of relevance.
        The "explanation" should be a concise summary of your ranking rationale.
        The "success" should be true if there are relevant results, and false if there are no relevant results.
        """

        user_prompt = f"""
        Rank the following posts based on their relevance to the user input. Consider these factors:
        1. Time: Prioritize posts that match or are close to any time mentioned in the input.
        2. Address: Prioritize posts related to any location mentioned in the input.
        3. Question topic: Analyze the main topic of the input and prioritize posts that discuss similar subjects.
        4. Ambiguity: If the input is ambiguous, provide a more comprehensive analysis.

        User input: {user_input}

        Posts:
        {self._format_posts(posts)}

        Provide the ranking as a list of post IDs in order of relevance, following the specified JSON format.
        If there are no relevant posts, return an empty list for "ranked_ids" and set "success" to false.
        """

        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.2,
                max_tokens=300,
                top_p=1,
                frequency_penalty=0,
                presence_penalty=0
            )
            
            result = response.choices[0].message.content.strip()
            try:
                parsed_result = json.loads(result)
                ranked_ids = parsed_result.get("ranked_ids", [])
                explanation = parsed_result.get("explanation", "No explanation provided.")
                success = parsed_result.get("success", False)
                
                if not ranked_ids:
                    return self._create_response(posts, "No relevant posts found.", False)
                
                ranked_posts = self._reorder_posts(posts, ranked_ids)
                return self._create_response(ranked_posts, explanation, success)
            except json.JSONDecodeError:
                return self._create_response(posts, "Failed to parse GPT response. Using original order.", False)
        except Exception as e:
            return self._create_response(posts, f"An error occurred: {str(e)}. Posts are in their original order.", False)

    def _format_posts(self, posts):
        return "\n".join([f"ID: {post['id']}, Question: {post['question']}, Address: {post['address']}, Time: {post['time']}" for post in posts])

    def _reorder_posts(self, posts, ranked_ids):
        post_dict = {post['id']: post for post in posts}
        return [post_dict[id] for id in ranked_ids if id in post_dict]

    def _create_response(self, posts, explanation, success):
        return {
            "ranked_posts": posts,
            "explanation": explanation,
            "success": success
        }

def main():
    try:
        input_data = json.loads(sys.stdin.read())
        user_input = input_data['input']
        posts = input_data['posts']

        ranker = PostRanker()
        result = ranker.rank_posts(user_input, posts)
        print(json.dumps(result))
    except Exception as e:
        error_response = {
            "ranked_posts": [],
            "explanation": f"An error occurred: {str(e)}",
            "success": False
        }
        print(json.dumps(error_response))

if __name__ == "__main__":
    main()
