export async function initPlaces() {
    const response = await fetch('http://localhost:3000/user-places')
    if (!response.ok) {
      throw new Error('Something wrong with initalising places!')
    }
    const jsonData = await response.json()
    return jsonData.places
}

export async function fetchPlaces() {
    const response = await fetch('http://localhost:3000/places')
    if (!response.ok) {
      throw new Error('Something wrong with fetching places!')
    }
    const jsonData = await response.json()
    return jsonData.places
}

export async function updatePlaces(places) {
    const response = await fetch('http://localhost:3000/user-places',
        {
            method: "PUT",
            body: JSON.stringify(
                {
                    'places': places
                }
            ),
            headers: {
                "content-type": "application/json"
            }
        }
    )
    if (!response.ok) {
      throw new Error('Something wrong with updating places!')
    }
    const jsonData = await response.json()
    return jsonData.message
}