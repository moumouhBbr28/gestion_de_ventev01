import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServerConfigPage } from './server-config';

@NgModule({
  declarations: [
    ServerConfigPage,
  ],
  imports: [
    IonicPageModule.forChild(ServerConfigPage),
  ],
})
export class ServerConfigPageModule {}
