import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommandesEditProduitPage } from './commandes-edit-produit';

@NgModule({
  declarations: [
    CommandesEditProduitPage,
  ],
  imports: [
    IonicPageModule.forChild(CommandesEditProduitPage),
  ],
})
export class CommandesEditProduitPageModule {}
