import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreancePage } from './creance';

@NgModule({
  declarations: [
    CreancePage,
  ],
  imports: [
    IonicPageModule.forChild(CreancePage),
  ],
})
export class CreancePageModule {}
