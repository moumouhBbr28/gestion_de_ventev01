import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BonLivrAjoutPage } from './bon-livr-ajout';

@NgModule({
  declarations: [
    BonLivrAjoutPage,
  ],
  imports: [
    IonicPageModule.forChild(BonLivrAjoutPage),
  ],
})
export class BonLivrAjoutPageModule {}
