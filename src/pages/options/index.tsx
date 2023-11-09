import { render } from 'react-dom'
import App from './App'
import "./index.css"

console.log('popup script')

const root = document.querySelector('#root')

render(<App />, root)
