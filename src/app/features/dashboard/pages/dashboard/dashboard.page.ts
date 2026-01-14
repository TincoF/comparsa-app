import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { IntegrantesService } from '../../../integrantes/services/integrantes.service';

@Component({
  selector: 'app-dashboard.page',
  imports: [],
  templateUrl: './dashboard.page.html',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardPage {
  integrantesService = inject(IntegrantesService);

}
