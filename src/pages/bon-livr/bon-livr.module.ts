import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BonLivrPage } from './bon-livr';

@NgModule({
  declarations: [
    BonLivrPage,
  ],
  imports: [
    IonicPageModule.forChild(BonLivrPage),
  ],
})
export class BonLivrPageModule {}
