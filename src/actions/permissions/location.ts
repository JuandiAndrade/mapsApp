

// Lo renombro porque tengo que ponerle el typo de nuestras interfaces que se llama igual
import { check, openSettings, PERMISSIONS, request, PermissionStatus as RNPermissionStatus } from "react-native-permissions"
import { PermissionsStatus } from "../../infrastructur/interfaces/permissions"
import { Platform } from "react-native"




export const requestLocationPermission = async (): Promise<PermissionsStatus> => {
	let status: RNPermissionStatus = 'unavailable'

	if (Platform.OS === 'ios') {
		status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
	} else if (Platform.OS === 'android') {
		status = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
	} else {
		throw new Error('Unsupported platform');
	}

	if (status === 'blocked') {
		// si el estatus es bloked entonces damos otra chance abriendo las settings del dispositivo y habilite el locations
		await openSettings();
		return await checkLocationPermission();
	}

	const permissionMapper: Record<RNPermissionStatus, PermissionsStatus> = {
		granted: 'granted',
		denied: 'denied',
		blocked: 'bloked',
		unavailable: 'unavalible',
		limited: 'limited',
	}

	return permissionMapper[status] ?? 'unavalible';

}

// todo: el reques abre un popUp, el check (cuando este en un loading) simplemente verifica si ya se ha otorgado o no y no pregunta
// todo el check veifica con la funcion checkLocationPermission y si no me ha dado el acceso entonces mando a llamar a requestLocationPermission

export const checkLocationPermission = async (): Promise<PermissionsStatus> => {
	let status: RNPermissionStatus = 'unavailable'

	if (Platform.OS === 'ios') {
		status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
	} else if (Platform.OS === 'android') {
		status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
	} else {
		throw new Error('Unsupported platform');
	}

	const permissionMapper: Record<RNPermissionStatus, PermissionsStatus> = {
		granted: 'granted',
		denied: 'denied',
		blocked: 'bloked',
		unavailable: 'unavalible',
		limited: 'limited',
	}

	return permissionMapper[status] ?? 'unavalible';

}