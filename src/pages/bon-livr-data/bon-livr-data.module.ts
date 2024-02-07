import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BonLivrDataPage } from './bon-livr-data';

@NgModule({
  declarations: [
    BonLivrDataPage,
  ],
  imports: [
    IonicPageModule.forChild(BonLivrDataPage),
  ],
})
export class BonLivrDataPageModule {}
