// ** Router Import
import Router from './router/Router'
import {useContext, useEffect, useState} from "react"
import {AbilityContext} from "./utility/context/Can"
import useAuth from "./data/use-auth"
import {isUserLoggedIn} from "./auth/utils"


const App = props => {
    // console.log(localStorage.getItem('auth'))
    const [startApp, setStartApp] = useState(false)
    const {ability} = useContext(AbilityContext)
    const {loading, user} = useAuth({ability})
    let loading2 = true
    // console.log(location.pathname)
    if (!isUserLoggedIn()) {
        loading2 = false
    }

    useEffect(() => {
        // console.log(user)
        if (user) {
            ability.update(user.permissions)
        }
        if (!loading || !loading2) {
            setStartApp(true)
        }
        // console.log(ability.rules)

    }, [loading, user])
    return startApp ? <Router/> : null
}

export default App
