import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommandesRemisePage } from './commandes-remise';

@NgModule({
  declarations: [
    CommandesRemisePage,
  ],
  imports: [
    IonicPageModule.forChild(CommandesRemisePage),
  ],
})
export class CommandesRemisePageModule {}
