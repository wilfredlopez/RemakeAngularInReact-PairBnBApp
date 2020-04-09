import React, { createContext, useContext, useState } from "react"
import { Place } from "../sharedTypes"
import axios from "axios"
import {
  FIREBASE_REALTIME_DATABASE_URL,
  CUSTOM_IMAGE_UPLOAD_API_ENDPOINT,
} from "../config/constants"

export interface IPlacesContext {
  places: Place[]
}

type BackendObject = Omit<Place, "id">

export interface PlacesContextInterface extends IPlacesContext {
  addPlace: (
    place: Omit<Place, "id" | "imageUrl">,
    imageToUpload: Blob,
    userToken: string,
  ) => Promise<void>
  fetchPlaces: (token: string) => Promise<void>
  fectchOneFromServer: (id: string, token: string) => Promise<Place>
  updatePlace: (
    token: string,
    placeArgument: Pick<Place, "id" | "title" | "description">,
  ) => Promise<void>
}

// const staticPlaces: Place[] = [
//   {
//     description: "Go to the beach every day!",
//     id: "cabrera",
//     imageUrl:
//       "https://www.selectcaribbean.com/wp-content/uploads/2014/05/Playa-Grande-Aerial-shot.jpg",
//     price: 1200,
//     title: "Cabrera",
//     availableFrom: new Date("2019-01-20"),
//     availableTo: new Date("2020-01-20"),
//     userId: "wilfred",
//     location: {
//       address: "sdasd",
//       lat: 20,
//       lng: 200,
//       staticMapImageUrl:
//         "https://www.selectcaribbean.com/wp-content/uploads/2014/05/Playa-Grande-Aerial-shot.jpg",
//     },
//   },
//   {
//     description: "Best City to have fun.",
//     id: "rd",
//     imageUrl:
//       "https://ihg.scene7.com/is/image/ihg/intercontinental-santo-domingo-4888007392-2x1?wid=1440&fit",
//     price: 1820,
//     title: "Santo Domingo",
//     availableFrom: new Date("2019-03-10"),
//     availableTo: new Date("2020-03-10"),
//     userId: "wilfred",
//     location: {
//       address: "sdasd",
//       lat: 20,
//       lng: 200,
//       staticMapImageUrl:
//         "https://www.selectcaribbean.com/wp-content/uploads/2014/05/Playa-Grande-Aerial-shot.jpg",
//     },
//   },
//   {
//     imageUrl:
//       "https://s3.amazonaws.com/aws-lps-storage/20275/main/the-venetian-garfield-nj-wedding-photography-billy-cece3584983.jpg",
//     title: "The Venetian",
//     description: "Want to have your wedding?",
//     id: "garfield-venetian",
//     price: 9000,
//     availableFrom: new Date("2018-09-11"),
//     availableTo: new Date("2020-09-11"),
//     userId: "otherUser",
//     location: {
//       address: "sdasd",
//       lat: 20,
//       lng: 200,
//       staticMapImageUrl:
//         "https://www.selectcaribbean.com/wp-content/uploads/2014/05/Playa-Grande-Aerial-shot.jpg",
//     },
//   },
// ]

const initialContext: PlacesContextInterface = {
  places: [] as Place[],
  addPlace: {} as any,
  fetchPlaces: {} as any,
  fectchOneFromServer: {} as any,
  updatePlace: {} as any,
}

const PlacesContext = createContext(initialContext)

const PlacesContextProvider: React.FC = React.memo((props) => {
  const [places, setPlaces] = useState<Place[]>([])

  async function updatePlace(
    token: string,
    placeArgument: Pick<Place, "id" | "title" | "description">,
  ) {
    if (places.length <= 0) {
      try {
        await fetchPlaces(token)
        return updatePlaceOnServer(placeArgument, token)
      } catch (error) {
        console.log(error)
      }
    } else {
      return updatePlaceOnServer(placeArgument, token)
    }
  }

  async function updatePlaceOnServer(
    placeArgument: Pick<Place, "id" | "title" | "description">,
    token: string,
  ) {
    let updatedPlaces: Place[] = []
    let placeToUpdate: Place
    const placeIndex = places.findIndex((p) => p.id === placeArgument.id)
    updatedPlaces = [...places]
    placeToUpdate = {
      ...updatedPlaces[placeIndex],
      ...placeArgument,
    }
    updatedPlaces[placeIndex] = placeToUpdate
    return axios
      .put(
        `${FIREBASE_REALTIME_DATABASE_URL}/offered-places/${placeArgument.id}.json?auth=${token}`,
        placeToUpdate,
      )
      .then((_res) => {
        setPlaces(updatedPlaces)
      })
      .catch((error) => console.log(error))
  }

  async function fetchPlaces(token: string) {
    return axios
      .get<{ [key: string]: BackendObject }>(
        `${FIREBASE_REALTIME_DATABASE_URL}/offered-places.json?auth=${token}`,
      )
      .then((response) => {
        const resData = response.data
        let placesRes: Place[] = []
        for (let key in resData) {
          if (resData.hasOwnProperty(key)) {
            resData[key].availableFrom = new Date(resData[key].availableFrom)
            resData[key].availableTo = new Date(resData[key].availableTo)
            placesRes.push({
              ...resData[key],
              id: key,
            })
          }
        }

        setPlaces(placesRes)
      })
  }

  function fectchOneFromServer(id: string, token: string) {
    return axios
      .get<BackendObject>(
        `${FIREBASE_REALTIME_DATABASE_URL}/offered-places/${id}.json?auth=${token}`,
      )
      .then((response) => {
        const resData = response.data
        resData.availableFrom = new Date(resData.availableFrom)
        resData.availableTo = new Date(resData.availableTo)
        console.log(resData.userId)
        const place: Place = {
          ...resData,
          id: id,
        }
        return place
      })
  }
  async function addPlace(
    place: Omit<Place, "id" | "imageUrl">,
    imageToUpload: Blob,
    usertoken: string,
  ) {
    return uploadImage(imageToUpload, usertoken)
      .then((response) => {
        const newPlace = {
          ...place,
          id: "newplace" + places.length + 1,
          imageUrl: response.data.imageUrl,
        }
        return axios
          .post<{ name: string }>(
            `${FIREBASE_REALTIME_DATABASE_URL}/offered-places.json?auth=${usertoken}`,
            {
              ...newPlace,
              id: null,
            },
          )
          .then((response) => {
            const data = response.data

            newPlace.id = data.name
            setPlaces((existingPlaces) => existingPlaces.concat(newPlace))
          })
      })
      .catch((error) => console.log(error))
  }

  function uploadImage(image: File | Blob, token: string) {
    const uploadData = new FormData()
    uploadData.append("image", image)

    return axios.post<{ imageUrl: string; imagePath: string }>(
      `${CUSTOM_IMAGE_UPLOAD_API_ENDPOINT}`,
      uploadData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
  }

  return (
    <PlacesContext.Provider
      value={{
        places,
        addPlace,
        fetchPlaces,
        fectchOneFromServer,
        updatePlace,
      }}
    >
      {props.children}
    </PlacesContext.Provider>
  )
})

const usePlacesContext = () => {
  const {
    places,
    addPlace,
    fetchPlaces,
    fectchOneFromServer,
    updatePlace,
  } = useContext(PlacesContext)

  async function getPlace(id: string, token: string) {
    return new Promise<Place>((resolve, reject) => {
      let place = places.find((p) => p.id === id)
      if (!place) {
        return fectchOneFromServer(id, token)
          .then((fetchedPlace) => {
            resolve(fetchedPlace)
          })
          .catch((err) => {
            console.log(err)
            reject(place)
          })
      } else {
        resolve(place)
      }
    })
  }
  return {
    places,
    addPlace,
    getPlace,
    fetchPlaces,
    fectchOneFromServer,
    updatePlace,
  }
}

export { PlacesContext, PlacesContextProvider, usePlacesContext }
