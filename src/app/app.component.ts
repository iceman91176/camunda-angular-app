import { Component } from '@angular/core';
import { KeycloakProfile } from 'keycloak-js';
import { KeycloakService } from 'keycloak-angular';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userDetails: KeycloakProfile;
  title = 'Camunda Angular Tasklist';

  constructor(private keycloakService: KeycloakService) {}

  async ngOnInit() {
    if (await this.keycloakService.isLoggedIn()) {
      this.userDetails = await this.keycloakService.loadUserProfile();
      console.log(this.keycloakService.getUserRoles());
    }
  }

  async doLogout() {
    await this.keycloakService.logout();
  }
}
