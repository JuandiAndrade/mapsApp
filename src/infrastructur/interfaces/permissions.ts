// todo: este componente es para armar mi logica de permisos

// No usamos interface (se podria), usamos type cuando quiero que sean uniones
export type PermissionsStatus = 
|'granted'
|'denied'
|'bloked'
|'limited'
|'unavalible'
|'undertermined';