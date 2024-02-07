import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DevisEditProduitPage } from './devis-edit-produit';

@NgModule({
  declarations: [
    DevisEditProduitPage,
  ],
  imports: [
    IonicPageModule.forChild(DevisEditProduitPage),
  ],
})
export class DevisEditProduitPageModule {}
