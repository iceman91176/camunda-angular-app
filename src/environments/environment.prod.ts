import { KeycloakConfig } from 'keycloak-angular';

// Add here your keycloak setup infos
let keycloakConfig: KeycloakConfig = {
  url: 'KEYCLOAK-INSTANCE-URL',
  realm: 'REALM-NAME',
  clientId: 'CLIENT-ID-NAME'
};

export const environment = {
  production: true,
  keycloak: keycloakConfig
};
