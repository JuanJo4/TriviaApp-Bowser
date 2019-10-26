import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { QuestionModel, QuestionSnapshot, Question } from "../question/question"
import { withEnvironment } from "../extensions"
import { flow } from "mobx"
import { GetQuestionsResult } from "../../services/api"

/**
 * Model description here for TypeScript hints.
 */
export const QuestionStoreModel = types
  .model("QuestionStore")
  .props({
    questions: types.optional(types.array(QuestionModel), [])
  })
  .extend(withEnvironment)
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    saveQuestions: (questionSnapshots: QuestionSnapshot[]) => {
      const questionModels: Question[] = questionSnapshots.map(q => QuestionModel.create(q))
      self.questions.replace(questionModels)
    }
  }))
  .actions(self => ({
    getQuestions: flow(function *() {
      const result: GetQuestionsResult = yield self.environment.api.getQuestions()

      if(result.kind === "ok") {
        self.saveQuestions(result.questions)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    })
  }))

  /**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

export interface QuestionStore extends Instance<typeof QuestionStoreModel> {}
export interface QuestionStoreSnapshot extends SnapshotOut<typeof QuestionStoreModel> {}
