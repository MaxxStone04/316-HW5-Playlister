import './App.css';
import { useContext } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider, GlobalStoreContext } from './store'
import {
    AppBanner,
    WelcomeScreen,
    LoginScreen,
    RegisterScreen,
    EditAccountScreen,
    Statusbar,
    WorkspaceScreen,
    PlaylistsScreen,
    SongsCatalogScreen,
    PlayPlaylistModal,
    MUIDeleteModal,
    MUIEditSongModal,
    RemoveSongModal,
    NewSongModal,
} from './components'
/*
  This is the entry-point for our application. Notice that we
  inject our store into all the components in our application.
  
  @author McKilla Gorilla
*/

function Modals() {
    const { store } = useContext(GlobalStoreContext);

    return (
        <>
            <PlayPlaylistModal />
            <MUIDeleteModal />
            <MUIEditSongModal />
            <RemoveSongModal />
        </>
    );
}
const App = () => {   
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <GlobalStoreContextProvider>              
                    <AppBanner />
                    <Switch>
                        <Route path="/" exact component={WelcomeScreen} />
                        <Route path="/login/" exact component={LoginScreen} />
                        <Route path="/register/" exact component={RegisterScreen} />
                        <Route path="/edit-account/" exact component={EditAccountScreen} />
                        <Route path="/playlist/" exact component={PlaylistsScreen} />

                        <Route path="/songs/" exact component={SongsCatalogScreen} />
                        <Route path="/playlist/:id" exact component={WorkspaceScreen} />
                    </Switch>
                    <Statusbar />

                    <Modals />
                </GlobalStoreContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    )
}

export default App