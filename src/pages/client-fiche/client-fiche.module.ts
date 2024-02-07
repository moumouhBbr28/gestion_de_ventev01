import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClientFichePage } from './client-fiche';

@NgModule({
  declarations: [
    ClientFichePage,
  ],
  imports: [
    IonicPageModule.forChild(ClientFichePage),
  ],
})
export class ClientFichePageModule {}
