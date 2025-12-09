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
                        <Route path="/playlists/" exact component={PlaylistsScreen} />
                        <Route path="/songs/" exact component={SongsCatalogScreen} />
                        <Route path="/playlist/:id" exact component={WorkspaceScreen} />
                    </Switch>
                    <Statusbar />
                    
                    {/* Modals */}
                    <PlayPlaylistModal />
                    <MUIDeleteModal />
                    <MUIEditSongModal />
                    <RemoveSongModal />
                    <SelectAvatarModal />
                    <EditPlaylistModal />
                    {/* NewSongModal is handled within SongsCatalogScreen */}
                </GlobalStoreContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    )
}

export default App