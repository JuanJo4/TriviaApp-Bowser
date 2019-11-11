import * as React from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, TextStyle, FlatList } from "react-native"
import { Text } from "../../components/text"
import { Screen } from "../../components/screen"
import { useStores } from "../../models/root-store"
import { QuestionStore } from "../../models/question-store"
import { color, spacing } from "../../theme"
import { NavigationScreenProps } from "react-navigation"
import { Question } from "../../models/question"

export interface QuestionScreenProps extends NavigationScreenProps<{}> {
  questionStore: QuestionStore
}
export interface QuestionScreenState {
  refreshing: boolean
}

const ROOT: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing.large,
  backgroundColor: color.background,
}
const HEADER_CONTAINER: ViewStyle = {
  marginTop: spacing.extraLarge,
  marginBottom: spacing.medium,
}
const QUESTION: TextStyle = {
  fontWeight: "bold",
  fontSize: 16,
  marginVertical: spacing.medium,
}

const QUESTION_WRAPPER: ViewStyle = {
  borderBottomColor: color.line,
  borderBottomWidth: 1,
  paddingVertical: spacing.large,
}

const QUESTION_LIST: ViewStyle = {
  marginBottom: spacing.large,
}

const ANSWER: TextStyle = {
  fontSize: 12,
}

const ANSWER_WRAPPER: ViewStyle = {
  paddingVertical: spacing.small,
}

export const QuestionScreen: React.FunctionComponent<QuestionScreenProps> = observer((props) => {
  const [state, setState] = React.useState<QuestionScreenState>({ refreshing: false})
  const { questionStore } = useStores()
  const { questions } = questionStore

  const fetchQuestions = () => {
    setState({ refreshing: true })
    questionStore.getQuestions()
    setState({ refreshing: false })
  }

  React.useEffect(() => {
    fetchQuestions()
  }, [])

  const renderQuestion = ({ item }) => {
    const question: Question = item
    return (
      <View style={QUESTION_WRAPPER}>
        <Text style={QUESTION} text={question.question} />
        <View>
          {question.allAnswers.map((a, index) => {
            return (
              <View key={index} style={ANSWER_WRAPPER}>
                <Text style={ANSWER} text={a} />
              </View>
            )
          })}
        </View>
      </View>
    )
  }

  return (
    <Screen style={ROOT} preset="scroll">
      <View style={HEADER_CONTAINER}>
        <Text preset="header" tx="questionScreen.header" />
        <FlatList
          style={QUESTION_LIST}
          data={questionStore.questions}
          renderItem={renderQuestion}
          extraData={{ extraDataForMobX: questions.length > 0 ? questions[0].question : "" }}
          keyExtractor={item => item.id}
          onRefresh={fetchQuestions}
          refreshing={state.refreshing}
        />
      </View>
    </Screen>
  )
})
