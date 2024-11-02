import { useRef, useState, useCallback, useEffect } from 'react';

import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import ErrorComponent from './components/Error.jsx';
import { initPlaces, updatePlaces } from './utils/httpHelper.jsx';

function App() {
  const selectedPlace = useRef();

  const [userPlaces, setUserPlaces] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(true)
  const [caughtError, setCaughtError] = useState()

  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    async function initialisePlaces() {
      try {
        const places = await initPlaces()
        setUserPlaces(places)
        setIsFetchingData(false)
      } catch(error) {
        setCaughtError(error)
      }
    }
    initialisePlaces()
  }, [])

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });
    await updatePlaces([selectedPlace, ...userPlaces])
  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );
    try {
      await updatePlaces(
        userPlaces.filter((place) => place.id !== selectedPlace.current.id)
      )
    } catch (error) {
      setUserPlaces(userPlaces)
    }
      

    setModalIsOpen(false);
  }, [userPlaces]);

  return (
    <>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {caughtError && <ErrorComponent title="Something wrong with initialising places" message={caughtError.message}/>}
        {!caughtError && <Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          places={userPlaces}
          onSelectPlace={handleStartRemovePlace}
          isLoading={isFetchingData}
          loadingContent={isFetchingData}
        />}
        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
