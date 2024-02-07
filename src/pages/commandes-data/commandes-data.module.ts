import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommandesDataPage } from './commandes-data';

@NgModule({
  declarations: [
    CommandesDataPage,
  ],
  imports: [
    IonicPageModule.forChild(CommandesDataPage),
  ],
})
export class CommandesDataPageModule {}
