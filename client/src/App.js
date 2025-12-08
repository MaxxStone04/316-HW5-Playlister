import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'
import {
    AppBanner,
    HomeWrapper,
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
    SelectAvatarModal,
    NewSongModal,
    EditPlaylistModal
} from './components'
/*
  This is the entry-point for our application. Notice that we
  inject our store into all the components in our application.
  
  @author McKilla Gorilla
*/
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

                    <PlayPlaylistModal />
                    <MUIDeleteModal />
                    <MUIEditSongModal />
                    <RemoveSongModal />
                    <EditPlaylistModal />
                    <SelectAvatarModal />
                </GlobalStoreContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    )
}

export default App