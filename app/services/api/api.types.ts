import { GeneralApiProblem } from "./api-problem"
import { QuestionSnapshot } from "../../models/question"

export interface User {
  id: number
  name: string
}

export type GetQuestionsResult = { kind: "ok"; questions: QuestionSnapshot[] } | GeneralApiProblem
