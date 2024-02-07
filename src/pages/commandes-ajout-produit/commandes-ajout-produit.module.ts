import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommandesAjoutProduitPage } from './commandes-ajout-produit';

@NgModule({
  declarations: [
    CommandesAjoutProduitPage,
  ],
  imports: [
    IonicPageModule.forChild(CommandesAjoutProduitPage),
  ],
})
export class CommandesAjoutProduitPageModule {}
