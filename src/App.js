import './App.css';
import RickMortyCharacterList from './Components/RickMortyCharacterList';
import Planets from './Components/Planets';
import Navbar from './Components/Navbar';
import Episodes from './Components/Episodes';



function App() {
  return (
    <div className="App container-md">
      <Navbar/>
      <RickMortyCharacterList/>
      <Planets/>
      <Episodes />
    </div>
  );
}

export default App;
