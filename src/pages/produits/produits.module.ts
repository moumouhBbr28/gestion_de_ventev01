import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProduitsPage } from './produits';

@NgModule({
  declarations: [
    ProduitsPage,
  ],
  imports: [
    IonicPageModule.forChild(ProduitsPage),
  ],
})
export class ProduitsPageModule {}
