// Todo: para que siemre tenga permiso a la uficacion
// todo: este componente esta embolviendo a toda mi aplicacion en todo momento


import { PropsWithChildren, useEffect } from 'react'
import { AppState } from 'react-native'
import { usePermissionStore } from '../store/premissions/usePermissionStore'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootStackParams } from '../navigation/StackNavigator'

export const PremissionsChecker = ({ children }: PropsWithChildren) => {

	const { locationStatus, checkLocationPermission } = usePermissionStore()
	const navigation = useNavigation<NavigationProp<RootStackParams>>();

	// todo este ultimo useEffect es para redireccionar al usuario en el caso de que tengamos el permiso indicado

	useEffect(() => {
		if (locationStatus === 'granted') {
			// lo comento porque no queremos que vuelva  la pantalla anterior
			// navigation.navigate('MapScreen')
			// todo usamos el reset, me resetea el stack de rutas entonces no puedo regresar a la ruta anterior porque no existe
			// todo la ventaja es que nos podemos crear todo un stack
			// todo esto no me destruye el stack (original)
			navigation.reset({
				// index: 0,
				routes: [{ name: 'MapScreen' }]
				// ejemplo de stack
				// routes: [
				// 	{name: 'MapScreen'},
				// 	{name: 'LoadingScreen'}
				// 	{name: 'MapScreen'}
				// ]
			})
		} else if (locationStatus !== 'undertermined') {
			// navigation.navigate('PermissionsScreen')
			navigation.reset({
				routes: [{ name: 'PermissionsScreen' }]
			})
		}
	}, [locationStatus])


	// cuando se monta verifica, pero si cambia de estado entra en juego el siguiente useEffect
	useEffect(() => {
		checkLocationPermission()
	}, [])


	// todo: queremos verificar el estado de la aplicacion con mi useEffect
	useEffect(() => {
		const subscriptions = AppState.addEventListener('change', (nextAppState) => {
			// console.log('AppState', nextAppState)
			if (nextAppState === 'active') {
				checkLocationPermission();
			}
		});

		// es importante que la subscriptions se limpie
		return () => {
			subscriptions.remove();
		}
	}, [])




	return (
		<>
			{children}
		</>
	)
}
