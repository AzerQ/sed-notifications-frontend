import NotificationsBar from "./NotificationsBar/NotificationsBar";
import React from "react";
import {mockNotifications} from "./MockNotifications";

const App: React.FC = () => {
    return (<>
        <NotificationsBar notifications={mockNotifications}/>
    </>)
}

export default App;