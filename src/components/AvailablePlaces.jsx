import { useState } from 'react';
import Places from './Places.jsx';
import { useEffect } from 'react';
import ErrorComponent from './Error.jsx';
import { fetchPlaces } from '../utils/httpHelper.jsx';

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetchingData, setIsFetchingData] = useState(true)
  const [availablePlaces, setAvailablePlaces] = useState([])
  const [caughtError, setCaughtError] = useState()

  useEffect(() => {
    async function getPlaces() {
      try {
        const places = await fetchPlaces()
        setAvailablePlaces(places)
        setIsFetchingData(false)
      } catch (error) {
        setCaughtError(error)
      }
    }
    getPlaces()
  }, [])

  if (caughtError) {
    return <ErrorComponent title="An error occured!" message={caughtError.message}/>
  }

  return (
    <Places
      title="Available Places"
      isLoading={isFetchingData}
      loadingContent="Fetching data..."
      places={availablePlaces}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
