import 'react-native-gesture-handler';

// import {enableLatestRenderer} from 'react-native-maps';

// enableLatestRenderer();


import { NavigationContainer } from '@react-navigation/native'
import { StackNavigator } from './presentation/navigation/StackNavigator';
import { PremissionsChecker } from './presentation/providers/PermissionsChecker';

export const MapsApp = () => {
	return (
		<NavigationContainer>
			<PremissionsChecker>
				<StackNavigator />
			</PremissionsChecker>
		</NavigationContainer>
	)
}
