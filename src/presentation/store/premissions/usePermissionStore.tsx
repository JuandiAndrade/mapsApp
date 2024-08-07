import { create } from "zustand";
import { PermissionsStatus } from "../../../infrastructur/interfaces/permissions";
import { checkLocationPermission, requestLocationPermission } from '../../../actions/permissions/location';



interface PrermissionsState {
	locationStatus: PermissionsStatus;


	requestLocationPermission: () => Promise<PermissionsStatus>;
	checkLocationPermission: () => Promise<PermissionsStatus>;

}


export const usePermissionStore = create<PrermissionsState>()( set => ({

	locationStatus: 'undertermined',

	requestLocationPermission: async () =>{
		const status = await requestLocationPermission();
		set({locationStatus:status});
		
		return status
	},
	checkLocationPermission: async () =>{
		const status = await checkLocationPermission();
		set({locationStatus:status});
		
		return status
	},


}))