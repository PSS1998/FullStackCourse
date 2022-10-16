import { useState } from "react"


const Title = () => <h1>give feedback</h1>

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Statistics = ({ good, neutral, bad }) => {
  if (good + neutral + bad === 0){
    return (
      <>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </>
    )
  }
  else{
    return (
      <div>
        <h1>statistics</h1>
        <table>
          <tbody>
            <StatisticLine text="good" value={good} />
            <StatisticLine text="neutral" value={neutral} />
            <StatisticLine text="bad" value={bad} />
            <StatisticLine text="all" value={good + neutral + bad} />
            <StatisticLine text="average" value={(good-bad)/(good+neutral+bad)} />
            <StatisticLine text="positive" value={((good)/(good+neutral+bad))*100 + " %"} />
          </tbody>
        </table>
      </div>
    )
  }
}

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleClick = (func, variable) => () => func(variable+1)
  
  return (
    <div>
      <Title />
      <Button handleClick={handleClick(setGood, good)} text="good" />
      <Button handleClick={handleClick(setNeutral, neutral)} text="neutral" />
      <Button handleClick={handleClick(setBad, good)} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App