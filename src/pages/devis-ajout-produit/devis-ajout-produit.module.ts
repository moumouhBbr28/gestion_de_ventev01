import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DevisAjoutProduitPage } from './devis-ajout-produit';

@NgModule({
  declarations: [
    DevisAjoutProduitPage,
  ],
  imports: [
    IonicPageModule.forChild(DevisAjoutProduitPage),
  ],
})
export class DevisAjoutProduitPageModule {}
