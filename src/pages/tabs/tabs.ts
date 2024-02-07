import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { BonLivrPage } from "../bon-livr/bon-livr";
import { CommandesPage } from "../commandes/commandes";
import { FactvPage } from "../factv/factv";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root = HomePage;
  tab2Root = CommandesPage;
  tab3Root = FactvPage;
  tab4Root = BonLivrPage;

  constructor() {}
}
