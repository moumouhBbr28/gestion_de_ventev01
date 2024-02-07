import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DevisAjoutPage } from './devis-ajout';

@NgModule({
  declarations: [
    DevisAjoutPage,
  ],
  imports: [
    IonicPageModule.forChild(DevisAjoutPage),
  ],
})
export class DevisAjoutPageModule {}
