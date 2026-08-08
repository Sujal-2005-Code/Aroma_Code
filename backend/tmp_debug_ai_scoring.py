from app.routes.ai_assessment import submit_assessment
from app.models.ai_assessment import AIAssessmentSubmitRequest, AIAssessmentSubmissionItem
import app.routes.ai_assessment as route

class FakeAssessmentsCollection:
    def find_one(self, query):
        return {
            '_id': '6a7604b302f7921a2d75b870',
            'student_id': 'student-1',
            'questions': [{
                'id': 1,
                'question': 'Q1',
                'options': ['A. One', 'B. Two', 'C. Three', 'D. Four'],
                'correctAnswer': 'A',
                'topic': 'T',
                'difficulty': 'Intermediate',
                'explanation': 'e'
            }]
        }

class FakeResultsCollection:
    def find_one(self, query):
        return None
    def insert_one(self, doc):
        return type('InsertResult', (), {'inserted_id': 'res-1'})()

route.get_ai_assessments_collection = lambda: FakeAssessmentsCollection()
route.get_ai_results_collection = lambda: FakeResultsCollection()
route.evaluate_ai_assessment = lambda payload: {'summary':'ok','strengths':[],'weakAreas':[],'learningRecommendations':[],'improvementPlan':[],'aiFeedback':'ok','motivationalQuote':'keep going'}

req = AIAssessmentSubmitRequest(answers=[AIAssessmentSubmissionItem(questionId=1, selectedAnswer='A. One')])
res = submit_assessment('6a7604b302f7921a2d75b870', req, current_user={'user_id':'student-1'})
print('score', res['score'])
print(res['questionAnalysis'])
