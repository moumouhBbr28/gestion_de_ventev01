import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LgAccueilPage } from './lg-accueil';

@NgModule({
  declarations: [
    LgAccueilPage,
  ],
  imports: [
    IonicPageModule.forChild(LgAccueilPage),
  ],
})
export class LgAccueilPageModule {}
