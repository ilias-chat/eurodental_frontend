import { Component } from '@angular/core';
import { DateRangePickerComponent } from "../../../shared/date-range-picker/date-range-picker.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [DateRangePickerComponent, FormsModule],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css'
})
export class InvoicesComponent {

}
