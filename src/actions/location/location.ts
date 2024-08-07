import Geolocation from '@react-native-community/geolocation';
import { Location } from '../../infrastructur/interfaces/location';

// !tanto getCurrentPosition como watchPosition no regresan una promesa
// !por lo tanto nosotros las modificamos para que regresen una promesa

export const getCurrentLocation = async (): Promise<Location> => {

	return new Promise((resolve, reject) => {

		Geolocation.getCurrentPosition((info) => {
			resolve({
				latitude: info.coords.latitude,
				longitude: info.coords.longitude
			})

		}, (error) => {
			console.log('Cant get location')
			reject(error);
		}, {
			enableHighAccuracy: true
		})
	})

}


//todo: Si queremos que nuestra camara siga al usuario
// locationCallback--> funcion que vamos a querer llamar cuando tengamos una nueva posicion
export const watchCurrentLocation = (locationCallback: (location: Location) => void): number => {
	return Geolocation.watchPosition(info => (

		// info es la informacion de la localizacion del mismo
		locationCallback({
			latitude: info.coords.latitude,
			longitude: info.coords.longitude
		})

	), (error) => {
		throw new Error('Cant get watchPosition')
	}, {
		enableHighAccuracy: true,
	})
}

// todo: funcion de limpieza
// cuando se llama la funcion watchCurrentLocation, nos regresa un numero que seria el watchId
export const clearWatchLocation = (watchId: number) => {
	Geolocation.clearWatch(watchId)
}