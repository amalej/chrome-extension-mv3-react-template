import { openOptionsPage } from '../../utils'
const App = (): JSX.Element => {
  return (
    <div>
      <p>Hello world from Pop-up page</p>
      <button onClick={openOptionsPage}>Open Options page</button>
    </div>
  )
}

export default App
