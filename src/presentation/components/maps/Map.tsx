
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import { Platform } from 'react-native';
import { Location } from '../../../infrastructur/interfaces/location';
import { FAB } from '../ui/FAB';
import { useEffect, useRef, useState } from 'react';
import { useLocationStore } from '../../store/location/useLocationStore';

interface Props {
	showsUserLocation?: boolean;
	initialLocation: Location;
}

export const Map = ({ showsUserLocation = true, initialLocation }: Props) => {

	const mapRef = useRef<MapView>();
	// cameraLocation, para que no se vea mal cuando toque el boton(se me corta la pantalla y vuelve a aparecer debido que que vuelve a initialLocation(cambia))
	const cameraLoction = useRef<Location>(initialLocation)

	// Para que me deje de seguir la camara
	const [isFollowingUser, setisFollowingUser] = useState(true)

	const [isShowingPolyline, setIsShowingPolyline] = useState(true)

	const { getLocation, lastKnownLocation, watchLocation, clearWatchLocation, userLocationsList } = useLocationStore()

	const moveCamaraToLocation = (location: Location) => {
		if (!mapRef.current) return;
		mapRef.current.animateCamera({
			center: location,
		})
	}

	const moveToCurrentLocation = async () => {
		// agregamos este if al final porque a veces getLocation(promesa) a veces demora en responder y a veces puede dar la impresion de no saber donde esta el usuario
		if (!lastKnownLocation) {
			moveCamaraToLocation(initialLocation)
		}
		const location = await getLocation();
		if (!location) return;
		moveCamaraToLocation(location)
	}

	// todo inmediatamente que se monta quiero seguir al usuario

	useEffect(() => {
		watchLocation()
		return () => {
			clearWatchLocation();
		}
	}, [])


	// si el lastKnownLocation cambia => ahi es cuando vamos a mover la camara
	useEffect(() => {
		if (lastKnownLocation && isFollowingUser) {
			moveCamaraToLocation(lastKnownLocation);
		}
	}, [lastKnownLocation, isFollowingUser])



	return (
		<>
			<MapView
				ref={(map) => mapRef.current = map!}
				showsUserLocation={showsUserLocation}
				// esta condicion del provider es para que en android me tome google maps y en ios apple maps
				provider={Platform.OS === 'ios' ? undefined : PROVIDER_GOOGLE} // remove if not using Google Maps
				style={{ flex: 1 }}
				// cuando la persona mueve el mapa quiero tambien dejar de seguir al usuario
				onTouchStart={() => setisFollowingUser(false)}
				region={{
					latitude: cameraLoction.current.latitude,
					longitude: cameraLoction.current.longitude,
					latitudeDelta: 0.015,
					longitudeDelta: 0.0121,
				}}
			>

				{/* Mostrar las lineas*/}
				{
					isShowingPolyline && (

						<Polyline
							coordinates={userLocationsList}
							strokeColor='black'
							strokeWidth={5}
						/>
					)
				}



				{/* <Marker
					coordinate={{
						latitude: 37.78825,
						longitude: -122.4324,
					}}
					title='Este es el titulo'
					description='Este es el cuerpo del marcador'
					image={require('../../../assets/custom-marker.png')}
				/> */}
			</MapView>
			<FAB
				iconName='compass-outline'
				onPress={moveToCurrentLocation}
				style={{
					bottom: 20,
					right: 20
				}}
			/>
			<FAB
				iconName={isFollowingUser ? 'walk-outline' : 'accessibility-outline'}
				onPress={() => setisFollowingUser(!isFollowingUser)}
				style={{
					bottom: 80,
					right: 20
				}}
			/>
			<FAB
				iconName={isShowingPolyline ? 'eye-outline' : 'eye-off-outline'}
				onPress={() => setIsShowingPolyline(!isShowingPolyline)}
				style={{
					bottom: 140,
					right: 20
				}}
			/>
		</>
	)
}

