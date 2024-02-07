import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommandesAjoutPage } from './commandes-ajout';

@NgModule({
  declarations: [
    CommandesAjoutPage,
  ],
  imports: [
    IonicPageModule.forChild(CommandesAjoutPage),
  ],
})
export class CommandesAjoutPageModule {}
