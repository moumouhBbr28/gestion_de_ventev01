import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FactvAjoutPage } from './factv-ajout';

@NgModule({
  declarations: [
    FactvAjoutPage,
  ],
  imports: [
    IonicPageModule.forChild(FactvAjoutPage),
  ],
})
export class FactvAjoutPageModule {}
