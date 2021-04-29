import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
function App(props: Record<string, any>){
    return (
        <div className="App">
            {/* <Provider store={}> */}
            hello, react,
            {/* </Provider> */}
        </div>
    )
}

export default App;
