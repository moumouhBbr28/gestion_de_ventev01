import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClientAjoutPage } from './client-ajout';

@NgModule({
  declarations: [
    ClientAjoutPage,
  ],
  imports: [
    IonicPageModule.forChild(ClientAjoutPage),
  ],
})
export class ClientAjoutPageModule {}
