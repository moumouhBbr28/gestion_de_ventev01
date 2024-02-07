import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DevisDataPage } from './devis-data';

@NgModule({
  declarations: [
    DevisDataPage,
  ],
  imports: [
    IonicPageModule.forChild(DevisDataPage),
  ],
})
export class DevisDataPageModule {}
