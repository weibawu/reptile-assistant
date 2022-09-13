import {useRoutes} from 'react-router-dom';
import router from 'src/router';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import {CssBaseline} from '@mui/material';
import ThemeProvider from './theme/ThemeProvider';
import {Authenticator} from "@aws-amplify/ui-react";
import {Amplify, DataStore, Hub} from "aws-amplify";
import amplifyConfig from "./aws-exports";

Amplify.configure(amplifyConfig);
// Amplify.Logger.LOG_LEVEL = 'DEBUG';

// @ts-ignore
window._ = Amplify;

function App() {
    const content = useRoutes(router);

    return (
        <Authenticator>
            <Authenticator.Provider>
                <ThemeProvider>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <CssBaseline/>
                        {content}
                    </LocalizationProvider>
                </ThemeProvider>
            </Authenticator.Provider>
        </Authenticator>
    );
}

export default App;
