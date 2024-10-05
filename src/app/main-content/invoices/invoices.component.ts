import { Component } from '@angular/core';
import { DateRangePickerComponent } from "../../shared/date-range-picker/date-range-picker.component";

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [DateRangePickerComponent],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css'
})
export class InvoicesComponent {

}
