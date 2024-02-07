import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestPrinterPage } from './test-printer';

@NgModule({
  declarations: [
    TestPrinterPage,
  ],
  imports: [
    IonicPageModule.forChild(TestPrinterPage),
  ],
})
export class TestPrinterPageModule {}
